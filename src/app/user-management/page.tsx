'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout'
import AuthGuard from '@/components/auth/AuthGuard'
import { Users, Plus, Search, Filter, Download, ChevronLeft, ChevronRight, Eye, Edit, Trash2, CheckCircle, Settings, Mail, Key } from 'lucide-react'
import { DataTable, Column } from '@/components/ui/DataTable';
import { User } from '@/types/user';
import Badge from '@/components/ui/Badge';
import { getUsersWithCookies } from '@/lib/api';
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

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1);
  };

  const handleView = (user: User) => {
    router.push(`/user-management/${user.id}`);
  };







  const getVerificationBadgeVariant = (isVerified: boolean) => {
    return isVerified ? 'success' : 'warning';
  };

  const getVerificationText = (isVerified: boolean) => {
    return isVerified ? 'Terverifikasi' : 'Belum Terverifikasi';
  };

  const getPasswordChangeBadgeVariant = (forcePasswordChange: boolean) => {
    return forcePasswordChange ? 'danger' : 'success';
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
        <div className="space-y-1">
          <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
            {row?.full_name || row?.FullName || 'Nama tidak tersedia'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
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
        <div className="space-y-2">
          <div>
            <span className="text-sm text-gray-900 dark:text-gray-100 font-medium">{row?.email || 'Email tidak tersedia'}</span>
            <div className="text-xs text-gray-400">Email Utama</div>
          </div>
          {row?.tenant && (
            <div>
              <span className="text-sm text-gray-700 dark:text-gray-300">{row.tenant.name}</span>
              <div className="text-xs text-gray-400">Tenant</div>
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
        <div className="flex flex-col items-start gap-2">
          <Badge 
            variant={getVerificationBadgeVariant(value as boolean)}
            className="text-xs px-4 py-2 font-semibold rounded-full shadow-sm border-0"
          >
            {getVerificationText(value as boolean)}
          </Badge>
        </div>
      )
    },
    {
      key: 'force_password_change',
      header: 'STATUS PASSWORD',
      sortable: true,
      render: (value) => (
        <div className="flex flex-col items-start gap-2">
          <Badge 
            variant={getPasswordChangeBadgeVariant(value as boolean)}
            className="text-xs px-4 py-2 font-semibold rounded-full shadow-sm border-0"
          >
            {getPasswordChangeText(value as boolean)}
          </Badge>
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
                    <Users className="w-6 h-6 text-brand-blue-3" />
                    Manajemen User
                  </h4>
                  <p className="text-muted mb-0">Kelola dan monitor semua user dalam sistem Anda</p>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-outline-primary d-flex align-items-center gap-2 px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 border-2 hover:border-brand-blue-3">
                    <Download className="w-4 h-4" />
                    <span>Ekspor Data</span>
                  </button>
                  <button 
                    className="btn btn-outline-primary d-flex align-items-center gap-2 px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 border-2 hover:border-brand-blue-3"
                    onClick={() => router.push('/user-management/create')}
                    disabled
                    title="Fitur tidak tersedia"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah User Baru</span>
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
                      <h5 className="card-title mb-1">Daftar Semua User</h5>
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
                    data={paginatedUsers}
                    columns={columns}
                    loading={loading}
                    searchable={false}
                    filterable={false}
                    onView={handleView}
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