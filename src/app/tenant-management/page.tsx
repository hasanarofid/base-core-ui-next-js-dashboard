'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout'
import AuthGuard from '@/components/auth/AuthGuard'
import { Building, Plus, Search, Filter, Download, ChevronLeft, ChevronRight, Eye, Edit, Trash2 } from 'lucide-react'
import { DataTable, Column } from '@/components/ui/DataTable';
import { Tenant } from '@/types/tenant';
import Badge from '@/components/ui/Badge';
import { getTenants, approveTenantWithCookies, updateTenantStatusWithCookies } from '@/lib/api';
import { environment } from '@/config/environment';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function TenantManagementPage() {
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  // Fetch tenants data
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getTenants();
        setTenants(response.data);
      } catch (err) {
        console.error('Error fetching tenants:', err);
        setError('Gagal mengambil data tenants. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tenant.domain && tenant.domain.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (tenant.contact_person && tenant.contact_person.includes(searchTerm))
  );

  const paginatedTenants = filteredTenants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredTenants.length / itemsPerPage);

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1);
  };

  const handleEdit = (tenant: Tenant) => {
    router.push(`/tenant-management/${tenant.id}/edit`);
  };

    const handleDelete = async (tenant: Tenant) => {
    // Validasi: tidak bisa hapus jika status aktif
    if (tenant.status === 'active') {
      Swal.fire({
        title: "Tidak dapat menghapus!",
        text: "Tenant dengan status aktif tidak dapat dihapus. Ubah status terlebih dahulu.",
        icon: "warning",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    const result = await Swal.fire({
      title: `Apakah Anda yakin ingin menghapus tenant "${tenant.name}"?`,
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/tenants/${tenant.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Gagal menghapus tenant');
        }

        setTenants(tenants.filter(t => t.id !== tenant.id));
        Swal.fire("Berhasil!", "Tenant berhasil dihapus.", "success");
      } catch (error) {
        if (error instanceof Error) {
          Swal.fire("Error!", error.message, "error");
        } else {
          Swal.fire("Error!", "Terjadi kesalahan yang tidak diketahui", "error");
        }
      }
    }
  };

  const handleApprove = async (tenant: Tenant) => {
    // Validasi: hanya bisa approve jika status pending
    if (tenant.status !== 'pending') {
      Swal.fire({
        title: "Tidak dapat approve!",
        text: "Hanya tenant dengan status pending yang dapat diapprove.",
        icon: "warning",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    const result = await Swal.fire({
      title: `Apakah Anda yakin ingin approve tenant "${tenant.name}"?`,
      text: "Tenant akan diaktifkan dan dapat mengakses sistem.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, approve!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const result = await approveTenantWithCookies(tenant.id);
        
        // Update tenant status di state
        setTenants(tenants.map(t => 
          t.id === tenant.id 
            ? { ...t, status: 'active' as const }
            : t
        ));
        
        Swal.fire("Berhasil!", "Tenant berhasil diapprove.", "success");
      } catch (error) {
        if (error instanceof Error) {
          Swal.fire("Error!", error.message, "error");
        } else {
          Swal.fire("Error!", "Terjadi kesalahan yang tidak diketahui", "error");
        }
      }
    }
  };

  const handleStatusChange = async (tenant: Tenant) => {
    // Validasi: tidak bisa ubah status jika sudah aktif
    if (tenant.status === 'active') {
      Swal.fire({
        title: "Tidak dapat mengubah status!",
        text: "Tenant dengan status aktif tidak dapat diubah statusnya.",
        icon: "warning",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    const { value: newStatus } = await Swal.fire({
      title: `Ubah Status Tenant "${tenant.name}"`,
      text: "Pilih status baru untuk tenant ini:",
      input: 'select',
      inputOptions: {
        'pending': 'Pending',
        'suspended': 'Suspended',
        'inactive': 'Inactive'
      },
      inputValue: tenant.status,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ubah Status",
      cancelButtonText: "Batal",
      inputValidator: (value) => {
        if (!value) {
          return 'Anda harus memilih status!'
        }
      }
    });

    if (newStatus) {
      try {
        const result = await updateTenantStatusWithCookies(tenant.id, newStatus);
        
        // Update tenant status di state
        setTenants(tenants.map(t => 
          t.id === tenant.id 
            ? { ...t, status: newStatus as 'pending' | 'suspended' | 'inactive' }
            : t
        ));
        
        Swal.fire("Berhasil!", `Status tenant berhasil diubah menjadi ${newStatus}.`, "success");
      } catch (error) {
        if (error instanceof Error) {
          Swal.fire("Error!", error.message, "error");
        } else {
          Swal.fire("Error!", "Terjadi kesalahan yang tidak diketahui", "error");
        }
      }
    }
  };

  // Conditional rendering functions untuk action buttons
  const showApproveButton = (tenant: Tenant) => {
    return tenant.status === 'pending';
  };

  const showStatusButton = (tenant: Tenant) => {
    return tenant.status !== 'active';
  };

  const showDeleteButton = (tenant: Tenant) => {
    return tenant.status !== 'active';
  };

  const handleView = (tenant: Tenant) => {
    router.push(`/tenant-management/${tenant.id}`);
  };

  const getStatusBadgeVariant = (status: unknown) => {
    const statusStr = String(status);
    switch (statusStr) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'suspended': return 'danger';
      case 'inactive': return 'default';
      default: return 'default';
    }
  };

  const getStatusText = (status: unknown) => {
    const statusStr = String(status);
    switch (statusStr) {
      case 'active': return 'Aktif';
      case 'pending': return 'Menunggu';
      case 'suspended': return 'Ditangguhkan';
      case 'inactive': return 'Tidak Aktif';
      default: return statusStr;
    }
  };

  const columns: Column<Tenant>[] = [
    {
      key: 'name',
      header: 'INFORMASI TENANT',
      sortable: true,
      render: (value, row) => (
        <div className="space-y-1">
          <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
            {row.name}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {row.domain || 'Domain tidak tersedia'}
          </div>
        </div>
      )
    },
    {
      key: 'email',
      header: 'INFORMASI KONTAK',
      sortable: true,
      render: (value, row) => (
        <div className="space-y-2">
          <div>
            <span className="text-sm text-gray-900 dark:text-gray-100 font-medium">{row.email}</span>
            <div className="text-xs text-gray-400">Email Utama</div>
          </div>
          {row.contact_person && (
            <div>
              <span className="text-sm text-gray-700 dark:text-gray-300">{row.contact_person}</span>
              <div className="text-xs text-gray-400">Kontak Person</div>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'status',
      header: 'STATUS AKUN',
      sortable: true,
      render: (value) => (
        <div className="flex flex-col items-start">
          <Badge 
            variant={getStatusBadgeVariant(value)}
            className="text-xs px-4 py-2 font-semibold rounded-full shadow-sm border-0"
          >
            {getStatusText(value)}
          </Badge>
        </div>
      )
    },
    {
      key: 'client_id',
      header: 'INFORMASI CLIENT',
      sortable: true,
      render: (value, row) => (
        <div className="flex flex-col items-start gap-2">
          <div className="text-sm text-gray-900 dark:text-gray-100 font-medium">
            Client ID: {row.client_id || 'Tidak tersedia'}
          </div>
          {row.client_key && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Key: {row.client_key.substring(0, 8)}...
            </div>
          )}
        </div>
      )
    },
    {
      key: 'lastLogin',
      header: 'AKTIVITAS TERAKHIR',
      sortable: true,
      render: (value) => (
        <div className="flex flex-col">
          <span className="text-sm text-gray-900 dark:text-gray-100 font-medium">
            {value ? new Date(String(value)).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }) : 'Belum pernah login'}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {value ? new Date(String(value)).toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit'
            }) : 'Akun baru'}
          </span>
        </div>
      )
    },
    {
      key: 'createdAt',
      header: 'TANGGAL PENDAFTARAN',
      sortable: true,
      render: (value) => (
        <div className="flex flex-col">
          <span className="text-sm text-gray-900 dark:text-gray-100 font-medium">
            {new Date(String(value)).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(String(value)).toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      )
    }
  ];

  if (error) {
    return (
      <AuthGuard requireAuth={true}>
        <DashboardLayout>
          <div className="container-xxl flex-grow-1 container-p-y">
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Error!</h4>
              <p>{error}</p>
              <button 
                className="btn btn-outline-danger"
                onClick={() => window.location.reload()}
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requireAuth={true}>
      <DashboardLayout>
        <div className="container-xxl flex-grow-1 container-p-y">
          {/* Page Header - Matching Dashboard Style */}
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="fw-bold mb-1 flex items-center gap-2">
                    <Building className="w-6 h-6 text-brand-blue-3" />
                    Manajemen Tenant
                  </h4>
                  <p className="text-muted mb-0">Kelola dan monitor semua tenant dalam sistem Anda</p>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-outline-primary d-flex align-items-center gap-2 px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 border-2 hover:border-brand-blue-3">
                    <Download className="w-4 h-4" />
                    <span>Ekspor Data</span>
                  </button>
                  <button 
                    className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 bg-gradient-to-r from-brand-blue-3 to-brand-blue-4 hover:from-brand-blue-4 hover:to-brand-blue-5"
                    onClick={() => router.push('/tenant-management/create')}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Tenant Baru</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* DataTable Card */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="card-title mb-1">Daftar Semua Tenant</h5>
                      <p className="text-muted mb-0">
                        {loading ? 'Memuat data...' : `${tenants.length} tenant ditemukan`}
                      </p>
                    </div>
                    <div className="d-flex align-items-center gap-6">
                      <div className="flex-1" style={{ minWidth: '300px' }}>
                        <input
                          type="text"
                          placeholder="Cari berdasarkan nama, email, atau domain..."
                          className="form-control"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="flex-shrink-0">
                        <button className="btn btn-outline-primary d-flex align-items-center gap-2 px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 border-2 hover:border-brand-blue-3">
                          <Filter className="w-4 h-4" />
                          <span>Filter Lanjutan</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body p-0">
                  <DataTable
                    data={paginatedTenants}
                    columns={columns}
                    loading={loading}
                    searchable={false}
                    filterable={false}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                    onApprove={handleApprove}
                    onStatusChange={handleStatusChange}
                    showApproveButton={showApproveButton}
                    showStatusButton={showStatusButton}
                    showDeleteButton={showDeleteButton}
                    pagination={{
                      currentPage,
                      totalPages,
                      totalItems: filteredTenants.length,
                      itemsPerPage,
                      onPageChange: setCurrentPage
                    }}
                    className="border-0 shadow-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
} 