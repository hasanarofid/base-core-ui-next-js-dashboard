'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import DashboardLayout from '@/components/layout/DashboardLayout'
import AuthGuard from '@/components/auth/AuthGuard'
import { DataTable, Column } from '@/components/ui/DataTable';
import { User } from '@/types/user';
import { getUsersWithCookies } from '@/lib/api';
import { usePageTitle } from '@/hooks/usePageTitle';
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

  // Dynamic title management using custom hook
  const { fullTitle, pageTitle, pageSubtitle } = usePageTitle({
    title: 'Manajemen User',
    subtitle: `Kelola ${users.length} user dalam sistem`,
    description: `Kelola ${users.length} user dalam sistem. Platform manajemen user dengan role dan status yang komprehensif.`,
    keywords: 'user management, role management, user verification, admin panel'
  });

  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getUsersWithCookies();
        
        // Validasi response - handle different response formats
        console.log('API Response:', response);
        
        if (response) {
          // Coba berbagai format response
          let usersData: User[] = [];
          
          if (response.data && Array.isArray(response.data)) {
            usersData = response.data;
          } else if (Array.isArray(response)) {
            usersData = response;
          } else {
            // Handle single user response
            const responseObj = response as unknown as Record<string, unknown>;
            if (responseObj.user) {
              usersData = [responseObj.user as User];
            }
          }
          
          setUsers(usersData);
          console.log('Processed users data:', usersData);
        } else {
          console.warn('Empty response:', response);
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

    fetchUsers();
  }, []);

  const filteredUsers = users?.filter(user =>
    (user.full_name || user.FullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      key: 'full_name',
      header: 'INFORMASI USER',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="fw-semibold text-body">
            {row?.full_name || row?.FullName || 'Nama tidak tersedia'}
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
                  onView={handleView}
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