'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import DashboardLayout from '@/components/layout/DashboardLayout'
import AuthGuard from '@/components/auth/AuthGuard'
import { DataTable, Column } from '@/components/ui/DataTable';
import { User } from '@/types/user';
import { getUsersWithCookies, deleteUserWithCookies } from '@/lib/api';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useSweetAlert } from '@/lib/sweetalert-config';
import Swal from 'sweetalert2';

/**
 * User Management Page
 * 
 * Fitur yang tersedia:
 * 1. List Users - Menampilkan semua user dengan informasi lengkap
 * 2. View User - Melihat detail user
 * 3. Search dan Filter - Pencarian berdasarkan nama, email, role, atau tenant
 * 4. Pagination - Navigasi halaman data
 * 
 * API Methods:
 * - GET /api/user - List semua user
 * 
 * Role yang tersedia:
 * - superadmin - Super Admin
 * - admin_tenant - Admin Tenant  
 * - end_user - End User
 * 
 * Status yang diizinkan:
 * - isVerified: true/false - Status verifikasi user
 * - force_password_change: true/false - Status force password change
 */

export default function UserManagementPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  // Hook untuk SweetAlert dengan tema dinamis
  const sweetAlert = useSweetAlert();

  // Dynamic title management using custom hook
  const { fullTitle, pageTitle, pageSubtitle } = usePageTitle({
    title: 'Manajemen User',
    subtitle: `Kelola ${users.length} user dalam sistem`,
    description: `Kelola ${users.length} user dalam sistem. Platform manajemen user dengan role dan status yang komprehensif.`,
    keywords: 'user management, role management, user verification, admin panel'
  });

  // Fetch users data function
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUsersWithCookies();
      
      // Validasi response - handle different response formats
      console.log('🔍 Raw API Response:', response);
      console.log('🔍 Response type:', typeof response);
      console.log('🔍 Response structure:', Object.keys(response || {}));
      
      if (response) {
        // Coba berbagai format response dengan prioritas
        let usersData: User[] = [];
        
        // Cast response untuk fleksibilitas parsing
        const responseAny = response as unknown as Record<string, unknown>;
        
        // 1. Cek jika response memiliki property data yang berupa array
        if (responseAny.data && Array.isArray(responseAny.data)) {
          console.log('✅ Found response.data array with', responseAny.data.length, 'items');
          usersData = responseAny.data;
        } 
        // 2. Cek jika response itu sendiri adalah array
        else if (Array.isArray(responseAny)) {
          console.log('✅ Response is direct array with', responseAny.length, 'items');
          usersData = responseAny;
        } 
        // 3. Cek jika response memiliki property users
        else if (responseAny.users && Array.isArray(responseAny.users)) {
          console.log('✅ Found response.users array with', responseAny.users.length, 'items');
          usersData = responseAny.users;
        }
        // 4. Cek jika response memiliki property result atau results
        else if (responseAny.result && Array.isArray(responseAny.result)) {
          console.log('✅ Found response.result array with', responseAny.result.length, 'items');
          usersData = responseAny.result;
        }
        else if (responseAny.results && Array.isArray(responseAny.results)) {
          console.log('✅ Found response.results array with', responseAny.results.length, 'items');
          usersData = responseAny.results;
        }
        // 5. Cek semua properties untuk menemukan array yang mengandung user data
        else {
          console.log('🔍 Searching for user array in response properties...');
          const responseObj = responseAny as Record<string, unknown>;
            
            // Cari property yang berupa array dan mengandung data user-like
            for (const [key, value] of Object.entries(responseObj)) {
              if (Array.isArray(value) && value.length > 0) {
                // Cek apakah item pertama memiliki properties user-like
                const firstItem = value[0];
                if (firstItem && typeof firstItem === 'object' && 
                    ('email' in firstItem || 'id' in firstItem || 'full_name' in firstItem || 'FullName' in firstItem)) {
                  console.log(`✅ Found user array in property '${key}' with`, value.length, 'items');
                  usersData = value as User[];
                  break;
                }
              }
            }
            
            // Jika masih tidak ditemukan, coba sebagai single user
            if (usersData.length === 0) {
              if (responseObj.user) {
                console.log('✅ Found single user in response.user');
                usersData = [responseObj.user as User];
              } else if (responseObj.email || responseObj.id) {
                console.log('✅ Response appears to be single user object');
                usersData = [responseObj as unknown as User];
              }
            }
          }
          
          console.log('📊 Final processed users data:', usersData);
          console.log('📊 Users count:', usersData.length);
          
          // Tambahan debugging untuk setiap user
          usersData.forEach((user, index) => {
            console.log(`👤 User ${index + 1}:`, {
              id: user.id,
              name: user.fullName,
              email: user.email,
              role: user.role
            });
          });
          
          setUsers(usersData);
        } else {
          console.warn('⚠️ Empty or null response:', response);
          setUsers([]);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Gagal mengambil data users. Silakan coba lagi.');
        setUsers([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    // Fetch users data on component mount
    useEffect(() => {
      fetchUsers();
    }, []);

  const filteredUsers = users?.filter(user =>
    (user.fullName  || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getRoleDisplayName(user.role).toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.tenant?.name && user.tenant.name.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const paginatedUsers = filteredUsers?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ) || [];

  const totalPages = Math.ceil((filteredUsers?.length || 0) / itemsPerPage);

  const handleView = (user: User) => {
    router.push(`/user-management/${user.id}`);
  };

  // Handle delete user
  const handleDelete = async (user: User) => {
    try {
      const result = await sweetAlert.confirmDelete(user.fullName || 'User');
      
      if (result.isConfirmed) {
        sweetAlert.loading('Menghapus user...');
        
        await deleteUserWithCookies(user.id);
        
        sweetAlert.closeLoading();
        sweetAlert.success('Berhasil', 'User berhasil dihapus');
        
        // Reload data setelah delete berhasil
        await fetchUsers();
      }
    } catch (error) {
      sweetAlert.closeLoading();
      console.error('Error deleting user:', error);
      
      let errorMessage = 'Terjadi kesalahan saat menghapus user';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      sweetAlert.error('Error', errorMessage);
    }
  };

  const getVerificationBadgeClass = (isVerified: boolean) => {
    return isVerified ? 'badge bg-label-success rounded-pill' : 'badge bg-label-warning rounded-pill';
  };

  const getVerificationText = (isVerified: boolean) => {
    return isVerified ? 'Terverifikasi' : 'Belum Terverifikasi';
  };

  const getPasswordChangeBadgeClass = (forcePasswordChange: boolean) => {
    return forcePasswordChange ? 'badge bg-label-danger rounded-pill' : 'badge bg-label-success rounded-pill';
  };

  const getPasswordChangeText = (forcePasswordChange: boolean) => {
    return forcePasswordChange ? 'Perlu Ganti Password' : 'Password Normal';
  };

  const getRoleDisplayName = (role: string | undefined) => {
    if (!role) return 'Role tidak tersedia';
    
    switch (role.toLowerCase()) {
      case 'superadmin':
        return 'Super Admin';
      case 'admin_tenant':
        return 'Admin Tenant';
      case 'end_user':
        return 'End User';
      default:
        return role;
    }
  };

  // Validasi data sebelum render
  if (!users) {
    return (
      <AuthGuard requireAuth={true}>
        <DashboardLayout>
          <div className="container-xxl flex-grow-1 container-p-y">
            <div className="alert alert-warning" role="alert">
              <h4 className="alert-heading">Loading...</h4>
              <p>Sedang memuat data users...</p>
            </div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  const columns: Column<User>[] = [
    {
      key: 'fullName',
      header: 'INFORMASI USER',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="fw-semibold text-body">
            {row?.fullName || 'Nama tidak tersedia'}
          </div>
          <div className="text-muted small">
            Role: {getRoleDisplayName(row?.role) || 'Role tidak tersedia'}
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
            <span className="text-body fw-medium">{row?.email || 'Email tidak tersedia'}</span>
            <div className="text-muted small">Email Utama</div>
          </div>
          {row?.tenant && (
            <div>
              <span className="text-body">{row.tenant.name}</span>
              <div className="text-muted small">Tenant</div>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'isVerified',
      header: 'STATUS VERIFIKASI',
      sortable: true,
      render: (value) => (
        <div>
          <span className={getVerificationBadgeClass(value as boolean)}>
            {getVerificationText(value as boolean)}
          </span>
        </div>
      )
    },
    {
      key: 'force_password_change',
      header: 'STATUS PASSWORD',
      sortable: true,
      render: (value) => (
        <div>
          <span className={getPasswordChangeBadgeClass(value as boolean)}>
            {getPasswordChangeText(value as boolean)}
          </span>
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
    },
    {
      key: 'actions',
      header: 'AKSI',
      sortable: false,
      render: (value, row) => (
        <div className="d-flex gap-1">
          <button
            className="btn btn-sm btn-label-primary"
            onClick={() => handleView(row)}
            title="Lihat Detail"
          >
            <i className="ti ti-eye"></i>
          </button>
          {/* <button
            className="btn btn-sm btn-label-warning"
            onClick={() => router.push(`/user-management/${row.id}/edit`)}
            title="Edit User"
          >
            <i className="ti ti-edit"></i>
          </button> */}
          <button
            className="btn btn-sm btn-label-danger"
            onClick={() => handleDelete(row)}
            title="Hapus User"
          >
            <i className="ti ti-trash"></i>
          </button>
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
        <meta name="description" content={`${pageSubtitle}. Platform manajemen user dengan role dan status yang komprehensif.`} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={`${pageSubtitle}. Kelola user, role, dan verifikasi dalam sistem tenant.`} />
        <meta name="keywords" content="user management, role management, user verification, admin panel" />
      </Head>
      
      <AuthGuard requireAuth={true}>
        <DashboardLayout>
          <div className="container-xxl flex-grow-1 container-p-y">
            {/* Page Header - Matching Dashboard Style */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h4 className="fw-bold mb-1 text-primary">
                  <i className="ti ti-users me-2"></i>
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
                  onClick={() => router.push('/user-management/create')}
                >
                  <i className="ti ti-plus me-1"></i>
                  <span>Tambah User Baru</span>
                </button>
              </div>
            </div>

            {/* DataTable Card */}
            <div className="card">
              <div className="card-header">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="card-title mb-1 text-primary">Daftar Semua User</h5>
                    <p className="text-muted mb-0">
                      {loading ? 'Memuat data...' : `${users?.length || 0} user ditemukan`}
                    </p>
                  </div>
                  <div className="d-flex align-items-center gap-6">
                    <div className="flex-1" style={{ minWidth: '300px' }}>
                      <input
                        type="text"
                        placeholder="Cari berdasarkan nama, email, atau role..."
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
                  data={paginatedUsers}
                  columns={columns}
                  loading={loading}
                  searchable={false}
                  filterable={false}
                  actions={false}
                  pagination={{
                    currentPage,
                    totalPages,
                    totalItems: filteredUsers.length,
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