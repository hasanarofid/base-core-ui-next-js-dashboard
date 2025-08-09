'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import DashboardLayout from '@/components/layout/DashboardLayout'
import AuthGuard from '@/components/auth/AuthGuard'
import { DataTable, Column } from '@/components/ui/DataTable';
import { Tenant } from '@/types/tenant';
import Badge from '@/components/ui/Badge';
import { getTenantsWithCookies, updateTenantStatusWithCookies, approveTenantWithCookies } from '@/lib/api';
import { usePageTitle } from '@/hooks/usePageTitle';
import Swal from 'sweetalert2';

/**
 * Tenant Management Page
 * 
 * Fitur yang tersedia:
 * 1. Update Status Tenant - Mengubah status tenant (pending, suspended, active)
 * 2. Approve Status Tenant - Mengubah status dari pending ke active
 * 3. Validasi Status - Hanya status yang diizinkan: pending, suspended, active
 * 4. Splash Success Messages - Notifikasi sukses dengan timer dan progress bar
 * 5. Error Messages - Notifikasi error dengan timer dan progress bar
 * 6. Loading States - Indikator loading saat proses berlangsung
 * 
 * API Methods:
 * - PATCH /api/tenants/[id]/status - Update status tenant
 * - PATCH /api/tenants/[id]/approve - Approve tenant
 * 
 * Status yang diizinkan:
 * - pending: Tenant menunggu approval
 * - suspended: Tenant ditangguhkan
 * - active: Tenant aktif dan dapat mengakses sistem
 */

export default function TenantManagementPage() {
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  // Dynamic title management using custom hook
  const { fullTitle, pageTitle, pageSubtitle } = usePageTitle({
    title: 'Manajemen Tenant',
    subtitle: `Kelola ${tenants.length} tenant dalam sistem`,
    description: `Kelola ${tenants.length} tenant dalam sistem. Fitur lengkap untuk mengelola tenant, status, dan konfigurasi sistem.`,
    keywords: 'tenant management, admin panel, status management, tenant configuration'
  });

  // Fetch tenants data
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getTenantsWithCookies();
        console.log('🔍 Full API Response:', JSON.stringify(response, null, 2));
        
        // Handle multiple possible response formats
        let tenantsData: Tenant[] = [];
        
        if (response) {
          // Format 1: { message: "success", data: [...] } - Standard TenantListResponse
          if (response.data && Array.isArray(response.data)) {
            tenantsData = response.data;
            console.log('✅ Found tenants in response.data:', tenantsData.length);
          }
          // Format 2: Direct array [...] - Fallback
          else if (Array.isArray(response)) {
            tenantsData = response as unknown as Tenant[];
            console.log('✅ Found tenants as direct array:', tenantsData.length);
          }
          else {
            console.warn('❌ Could not find tenant array in expected format');
            console.warn('Response structure:', Object.keys(response));
            console.warn('response.data exists:', !!response.data);
            console.warn('response.data type:', typeof response.data);
            console.warn('response.data is array:', Array.isArray(response.data));
            
            // Last resort: check if response.data exists but is not an array
            if (response.data) {
              console.log('🔍 response.data content:', response.data);
            }
          }
        }
        
        console.log('🔍 Setting tenants count:', tenantsData.length);
        setTenants(tenantsData);
        
        // 🧪 TEST: Add dummy data if no tenants found (for debugging)
        if (tenantsData.length === 0) {
          console.log('🧪 No tenants found, adding test data...');
          const testTenants: Tenant[] = [
            {
              id: 'test-1',
              name: 'Test Tenant 1',
              email: 'test1@example.com',
              status: 'active',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              domain: 'test1.example.com',
              contact_person: 'John Doe'
            },
            {
              id: 'test-2', 
              name: 'Test Tenant 2',
              email: 'test2@example.com',
              status: 'pending',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              domain: 'test2.example.com',
              contact_person: 'Jane Smith'
            }
          ];
          console.log('🧪 Setting test tenants:', testTenants);
          setTenants(testTenants);
        }
        
      } catch (err) {
        console.error('❌ Error fetching tenants:', err);
        setError('Gagal mengambil data tenant. Silakan coba lagi.');
        setTenants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  // Watch tenants state changes
  useEffect(() => {
    console.log('🔍 Tenants state updated:', tenants.length, 'items');
  }, [tenants]);

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
        // Tampilkan loading
        Swal.fire({
          title: 'Memproses...',
          text: 'Sedang menghapus tenant',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

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
        
        // Tampilkan splash success
        Swal.fire({
          title: "Berhasil!",
          text: `Tenant "${tenant.name}" berhasil dihapus.`,
          icon: "success",
          confirmButtonColor: "#28a745",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      } catch (error) {
        // Tampilkan splash error
        if (error instanceof Error) {
          Swal.fire({
            title: "Error!",
            text: error.message,
            icon: "error",
            confirmButtonColor: "#dc3545",
            timer: 5000,
            timerProgressBar: true
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: "Terjadi kesalahan yang tidak diketahui",
            icon: "error",
            confirmButtonColor: "#dc3545",
            timer: 5000,
            timerProgressBar: true
          });
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
        // Tampilkan loading
        Swal.fire({
          title: 'Memproses...',
          text: 'Sedang approve tenant',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        await approveTenantWithCookies(tenant.id);
        
        // Update tenant status di state
        setTenants(tenants.map(t => 
          t.id === tenant.id 
            ? { ...t, status: 'active' as const }
            : t
        ));
        
        // Tampilkan splash success
        Swal.fire({
          title: "Berhasil!",
          text: `Tenant "${tenant.name}" berhasil diapprove dan diaktifkan.`,
          icon: "success",
          confirmButtonColor: "#28a745",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      } catch (error) {
        // Tampilkan splash error
        if (error instanceof Error) {
          Swal.fire({
            title: "Error!",
            text: error.message,
            icon: "error",
            confirmButtonColor: "#dc3545",
            timer: 5000,
            timerProgressBar: true
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: "Terjadi kesalahan yang tidak diketahui",
            icon: "error",
            confirmButtonColor: "#dc3545",
            timer: 5000,
            timerProgressBar: true
          });
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
        'active': 'Active'
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
        // Validasi status yang diizinkan
        if (!['pending', 'suspended', 'active'].includes(value)) {
          return 'Status yang dipilih tidak valid!'
        }
      }
    });

    if (newStatus) {
      try {
        // Tampilkan loading
        Swal.fire({
          title: 'Memproses...',
          text: 'Sedang mengubah status tenant',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        await updateTenantStatusWithCookies(tenant.id, newStatus);
        
        // Update tenant status di state
        setTenants(tenants.map(t => 
          t.id === tenant.id 
            ? { ...t, status: newStatus as 'pending' | 'suspended' | 'active' }
            : t
        ));
        
        // Tampilkan splash success
        Swal.fire({
          title: "Berhasil!",
          text: `Status tenant "${tenant.name}" berhasil diubah menjadi ${getStatusText(newStatus)}.`,
          icon: "success",
          confirmButtonColor: "#28a745",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      } catch (error) {
        // Tampilkan splash error
        if (error instanceof Error) {
          Swal.fire({
            title: "Error!",
            text: error.message,
            icon: "error",
            confirmButtonColor: "#dc3545",
            timer: 5000,
            timerProgressBar: true
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: "Terjadi kesalahan yang tidak diketahui",
            icon: "error",
            confirmButtonColor: "#dc3545",
            timer: 5000,
            timerProgressBar: true
          });
        }
      }
    }
  };

  // Conditional rendering functions untuk action buttons
  const showApproveButton = (tenant: Tenant) => {
    return tenant.status === 'pending';
  };

  const showStatusButton = (tenant: Tenant) => {
    // Hanya tampilkan tombol status jika status bukan active
    // dan status yang ada adalah salah satu dari yang diizinkan
    return tenant.status !== 'active' && ['pending', 'suspended', 'active'].includes(tenant.status);
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
      default: return 'default';
    }
  };

  const getStatusText = (status: unknown) => {
    const statusStr = String(status);
    switch (statusStr) {
      case 'active': return 'Aktif';
      case 'pending': return 'Menunggu';
      case 'suspended': return 'Ditangguhkan';
      default: return statusStr;
    }
  };

  const columns: Column<Tenant>[] = [
    {
      key: 'name',
      header: 'INFORMASI TENANT',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="fw-semibold text-body">
            {row.name}
          </div>
          <div className="text-muted small">
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
        <div>
          <div className="mb-1">
            <span className="text-body fw-medium">{row.email}</span>
            <div className="text-muted small">Email Utama</div>
          </div>
          {row.contact_person && (
            <div>
              <span className="text-body">{row.contact_person}</span>
              <div className="text-muted small">Kontak Person</div>
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
        <div>
          <Badge 
            variant={getStatusBadgeVariant(value)}
            className="badge"
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
        <div>
          <div className="text-body fw-medium">
            Client ID: {row.client_id || 'Tidak tersedia'}
          </div>
          {row.client_key && (
            <div className="text-muted small">
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
        <div>
          <span className="text-body fw-medium">
            {value ? new Date(String(value)).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }) : 'Belum pernah login'}
          </span>
          <div className="text-muted small">
            {value ? new Date(String(value)).toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit'
            }) : 'Akun baru'}
          </div>
        </div>
      )
    },
    {
      key: 'createdAt',
      header: 'TANGGAL PENDAFTARAN',
      sortable: true,
      render: (value) => (
        <div>
          <span className="text-body fw-medium">
            {new Date(String(value)).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </span>
          <div className="text-muted small">
            {new Date(String(value)).toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit'
            })}
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
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={`${pageSubtitle}. Fitur lengkap untuk mengelola tenant, status, dan konfigurasi sistem.`} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={`${pageSubtitle}. Platform manajemen tenant dengan fitur lengkap.`} />
        <meta name="keywords" content="tenant management, admin panel, status management, tenant configuration" />
      </Head>
      
      <AuthGuard requireAuth={true}>
        <DashboardLayout>
          <div className="container-xxl flex-grow-1 container-p-y">
            {/* Page Header - Matching Dashboard Style */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h4 className="fw-bold mb-1 text-primary">
                  <i className="ti ti-building me-2"></i>
                  {pageTitle}
                </h4>
                <p className="text-muted mb-0">{pageSubtitle}</p>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-label-primary">
                  <i className="ti ti-download me-1"></i>
                  <span>Ekspor Data</span>
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => router.push('/tenant-management/create')}
                >
                  <i className="ti ti-plus me-1"></i>
                  <span>Tambah Tenant Baru</span>
                </button>
              </div>
            </div>

            {/* DataTable Card */}
            <div className="card">
              <div className="card-header">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="card-title mb-1 text-primary">Daftar Semua Tenant</h5>
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
                      <button className="btn btn-label-primary">
                        <i className="ti ti-filter me-1"></i>
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
        </DashboardLayout>
      </AuthGuard>
    </>
  )
} 