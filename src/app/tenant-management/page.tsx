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
import { useSweetAlert } from '@/lib/sweetalert-config';

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

  // Hook untuk SweetAlert dengan tema dinamis
  const sweetAlert = useSweetAlert();

  // Dynamic title management using custom hook
  const { fullTitle, pageTitle, pageSubtitle } = usePageTitle({
    title: 'Manajemen Tenant',
    subtitle: `Kelola ${tenants.length} tenant dalam sistem`,
    description: `Kelola ${tenants.length} tenant dalam sistem. Fitur lengkap untuk mengelola tenant, status, dan konfigurasi sistem.`,
    keywords: 'tenant management, admin panel, status management, tenant configuration'
  });

  // Fetch tenants data function
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

  // Fetch tenants data
  useEffect(() => {
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
    // Validasi: konfirmasi untuk tenant aktif
    if (tenant.status === 'active') {
      const confirmActive = await sweetAlert.confirm(
        "Konfirmasi Hapus Tenant Aktif",
        `Tenant "${tenant.name}" memiliki status aktif. Apakah Anda yakin ingin menghapusnya?`,
        {
          icon: 'warning',
          confirmButtonColor: '#dc3545',
          confirmButtonText: 'Ya, Hapus',
          cancelButtonText: 'Batal',
          showCancelButton: true
        }
      );
      
      if (!confirmActive.isConfirmed) {
        return;
      }
    }

    const result = await sweetAlert.confirmDelete(tenant.name);

    if (result.isConfirmed) {
      try {
        // Tampilkan loading
        sweetAlert.loading('Memproses...', 'Sedang menghapus tenant');

        const response = await fetch(`/api/tenants/${tenant.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Reload data setelah delete berhasil
        await fetchTenants();
        
        // Tampilkan splash success
        sweetAlert.success("Berhasil!", `Tenant "${tenant.name}" berhasil dihapus.`);
      } catch (error) {
        // Tampilkan splash error
        if (error instanceof Error) {
          sweetAlert.error("Error!", error.message);
        } else {
          sweetAlert.error("Error!", "Terjadi kesalahan yang tidak diketahui");
        }
      }
    }
  };

  const handleApprove = async (tenant: Tenant) => {
    // Validasi: hanya bisa approve jika status pending
    if (tenant.status !== 'pending') {
      sweetAlert.warning("Tidak dapat approve!", "Hanya tenant dengan status pending yang dapat diapprove.");
      return;
    }

    const result = await sweetAlert.confirmApprove(tenant.name);

    if (result.isConfirmed) {
      try {
        // Tampilkan loading
        sweetAlert.loading('Memproses...', 'Sedang approve tenant');

        await approveTenantWithCookies(tenant.id);

        // Reload data setelah approve berhasil
        await fetchTenants();
        
        // Tampilkan splash success
        sweetAlert.success("Berhasil!", `Tenant "${tenant.name}" berhasil diapprove dan diaktifkan.`);
      } catch (error) {
        // Tampilkan splash error
        if (error instanceof Error) {
          sweetAlert.error("Error!", error.message);
        } else {
          sweetAlert.error("Error!", "Terjadi kesalahan yang tidak diketahui");
        }
      }
    }
  };

  const handleStatusChange = async (tenant: Tenant) => {
    // Validasi: status yang diizinkan
    const allowedStatuses = ['pending', 'suspended', 'active'];
    if (!allowedStatuses.includes(tenant.status)) {
      sweetAlert.warning("Status tidak valid!", "Status tenant tidak valid untuk diubah.");
      return;
    }

    const result = await sweetAlert.confirm(tenant.name, `Pilih status baru untuk ${tenant.name}:`, {
      icon: 'question',
      confirmButtonColor: '#696cff',
      confirmButtonText: 'Ubah Status',
      cancelButtonText: 'Batal',
      input: 'select',
      inputOptions: {
        'pending': 'Pending',
        'active': 'Aktif',
        'suspended': 'Ditangguhkan'
      },
      inputValue: tenant.status
    });

    if (result.value) {
      try {
        // Tampilkan loading
        sweetAlert.loading('Memproses...', 'Sedang mengubah status tenant');

        await updateTenantStatusWithCookies(tenant.id, result.value);

        // Reload data setelah status change berhasil
        await fetchTenants();
        
        // Tampilkan splash success
        sweetAlert.success("Berhasil!", `Status tenant "${tenant.name}" berhasil diubah menjadi ${getStatusText(result.value)}.`);
      } catch (error) {
        // Tampilkan splash error
        if (error instanceof Error) {
          sweetAlert.error("Error!", error.message);
        } else {
          sweetAlert.error("Error!", "Terjadi kesalahan yang tidak diketahui");
        }
      }
    }
  };

  // Conditional rendering functions untuk action buttons
  const showApproveButton = (tenant: Tenant) => {
    return tenant.status === 'pending';
  };

  const showStatusButton = (tenant: Tenant) => {
    // Tampilkan tombol status untuk semua status yang diizinkan
    return ['pending', 'suspended', 'active'].includes(tenant.status);
  };

  const showDeleteButton = (tenant: Tenant) => {
    // Tampilkan tombol delete untuk semua status
    return true;
  };

  const handleView = (tenant: Tenant) => {
    router.push(`/tenant-management/${tenant.id}`);
  };

  const handlePaymentMethods = (tenant: Tenant) => {
    router.push(`/tenant-payment-methods/${tenant.id}`);
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
                  onPaymentMethods={handlePaymentMethods}
                  showApproveButton={showApproveButton}
                  showStatusButton={showStatusButton}
                  showDeleteButton={showDeleteButton}
                  showPaymentMethodsButton={() => true}
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