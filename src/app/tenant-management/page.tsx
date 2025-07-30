'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout'
import AuthGuard from '@/components/auth/AuthGuard'
import { Building, Plus, Mail, Phone, Calendar, Search, Filter, Download, FileText } from 'lucide-react'
import { DataTable, Column } from '@/components/ui/DataTable';
import { Tenant } from '@/types/tenant';
import Badge from '@/components/ui/Badge';
import { getTenants } from '@/lib/api';

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

  const handleDelete = (tenant: Tenant) => {
    if (confirm(`Apakah Anda yakin ingin menghapus tenant "${tenant.name}"?`)) {
      setTenants(tenants.filter(t => t.id !== tenant.id));
    }
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
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-blue-3 to-brand-blue-4 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {row.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                {row.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                <Building className="w-3 h-3" />
                {row.domain || 'Domain tidak tersedia'}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'email',
      header: 'INFORMASI KONTAK',
      sortable: true,
      render: (value, row) => (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-blue-1 to-brand-blue-3 rounded-full flex items-center justify-center">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <span className="text-sm text-gray-900 dark:text-gray-100 font-medium">{row.email}</span>
              <div className="text-xs text-gray-400 mt-1">Email Utama</div>
            </div>
          </div>
          {row.contact_person && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                <Phone className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <span className="text-sm text-gray-700 dark:text-gray-300">{row.contact_person}</span>
                <div className="text-xs text-gray-400 mt-1">Kontak Person</div>
              </div>
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
        <div className="flex flex-col items-start gap-2">
          <Badge 
            variant={getStatusBadgeVariant(value)}
            className="text-xs px-3 py-1.5 font-semibold"
          >
            {getStatusText(value)}
          </Badge>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              value === 'active' ? 'bg-green-500' :
              value === 'pending' ? 'bg-yellow-500' :
              value === 'suspended' ? 'bg-red-500' :
              'bg-gray-400'
            }`}></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {value === 'active' ? 'Akun aktif dan dapat digunakan' :
               value === 'pending' ? 'Menunggu verifikasi admin' :
               value === 'suspended' ? 'Akun ditangguhkan sementara' :
               'Akun tidak aktif'}
            </span>
          </div>
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
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
            <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </div>
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
        </div>
      )
    },
    {
      key: 'createdAt',
      header: 'TANGGAL PENDAFTARAN',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-blue-1 to-brand-blue-3 rounded-full flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
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
                  <button className="btn btn-outline-primary d-flex align-items-center gap-2">
                    <Download className="w-4 h-4" />
                    <span>Ekspor Data</span>
                  </button>
                  <button 
                    className="btn btn-primary d-flex align-items-center gap-2"
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
                    <div className="d-flex gap-2">
                      <div className="position-relative">
                        <Search className="position-absolute start-0 top-50 translate-middle-y ms-3 w-4 h-4 text-muted" />
                        <input
                          type="text"
                          className="form-control ps-5"
                          placeholder="Cari berdasarkan nama, email, atau domain..."
                          value={searchTerm}
                          onChange={(e) => handleSearch(e.target.value)}
                          style={{ minWidth: '300px' }}
                        />
                      </div>
                      <button className="btn btn-outline-primary d-flex align-items-center gap-2">
                        <Filter className="w-4 h-4" />
                        <span>Filter Lanjutan</span>
                      </button>
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