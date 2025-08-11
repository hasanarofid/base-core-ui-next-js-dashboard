'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import AuthGuard from '@/components/auth/AuthGuard'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { usePageTitle } from '@/hooks/usePageTitle'
import { User } from '@/types'



export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  usePageTitle({
    title: 'Detail User',
    subtitle: 'Informasi lengkap user',
    description: 'Halaman detail informasi user dalam sistem',
    keywords: 'user detail, profile, information'
  })

  useEffect(() => {
    if (userId) {
      fetchUserDetail(userId)
    }
  }, [userId])

  const fetchUserDetail = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      
      // TODO: Implementasi API call untuk detail user
      // Sementara gunakan dummy data
      setTimeout(() => {
        const dummyUser: User = {
          id: id,
          fullName: 'John Doe',
          email: 'john.doe@example.com',
          role: 'admin',
          phone: '+62 812-3456-7890',
          avatar: '/theme/assets/img/avatars/14.png',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          lastLogin: '2025-08-09T14:20:00Z'
        }
        setUser(dummyUser)
        setLoading(false)
      }, 1000)
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Gagal mengambil detail user')
      setLoading(false)
    }
  }

  const getRoleBadgeClass = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'badge bg-label-primary'
      case 'tenant':
        return 'badge bg-label-success'
      case 'user':
        return 'badge bg-label-info'
      default:
        return 'badge bg-label-secondary'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Aktif' : 'Tidak Aktif'
  }

  const getStatusBadgeClass = (isActive: boolean) => {
    return isActive ? 'badge bg-label-success' : 'badge bg-label-danger'
  }

  if (loading) {
    return (
      <AuthGuard requireAuth={true}>
        <DashboardLayout>
          <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Memuat detail user...</p>
            </div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  if (error) {
    return (
      <AuthGuard requireAuth={true}>
        <DashboardLayout>
          <div className="container-xxl flex-grow-1 container-p-y">
            <div className="card">
              <div className="card-body text-center py-5">
                <i className="ti ti-alert-triangle text-danger mb-3" style={{ fontSize: '3rem' }}></i>
                <h4 className="mb-2">Error!</h4>
                <p className="mb-4">{error}</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => router.push('/user-management')}
                >
                  <i className="ti ti-arrow-left me-1"></i>
                  Kembali ke Daftar User
                </button>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  if (!user) {
    return (
      <AuthGuard requireAuth={true}>
        <DashboardLayout>
          <div className="container-xxl flex-grow-1 container-p-y">
            <div className="card">
              <div className="card-body text-center py-5">
                <i className="ti ti-user-x text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                <h4 className="mb-2">User Tidak Ditemukan</h4>
                <p className="mb-4">User dengan ID {userId} tidak ditemukan.</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => router.push('/user-management')}
                >
                  <i className="ti ti-arrow-left me-1"></i>
                  Kembali ke Daftar User
                </button>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard requireAuth={true}>
      <Head>
        <title>Detail User - {user.fullName} | Innovia Tenant App</title>
      </Head>
      
      <DashboardLayout>
        <div className="container-xxl flex-grow-1 container-p-y">
          {/* Breadcrumb */}
          <h4 className="fw-bold py-3 mb-4">
            <span className="text-muted fw-light">User Management /</span> Detail User
          </h4>

          {/* Header dengan tombol kembali */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center">
                <button 
                  className="btn btn-label-secondary"
                  onClick={() => router.push('/user-management')}
                >
                  <i className="ti ti-arrow-left me-1"></i>
                  Kembali
                </button>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-label-primary"
                    onClick={() => router.push(`/user-management/${userId}/edit`)}
                  >
                    <i className="ti ti-edit me-1"></i>
                    Edit
                  </button>
                  <button className="btn btn-label-danger">
                    <i className="ti ti-trash me-1"></i>
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Header */}
          <div className="row">
            <div className="col-12">
              <div className="card mb-4">
                <div className="user-profile-header-banner">
                  <Image 
                    src="/theme/assets/img/pages/profile-banner.png" 
                    alt="Banner image" 
                    className="rounded-top w-100" 
                    style={{ height: '200px', objectFit: 'cover' }}
                    width={1200}
                    height={200}
                  />
                </div>
                <div className="user-profile-header d-flex flex-column flex-sm-row text-sm-start text-center mb-4">
                  <div className="flex-shrink-0 mt-n2 mx-sm-0 mx-auto">
                    <Image
                      src={user.avatar || '/theme/assets/img/avatars/14.png'}
                      alt="user image"
                      className="d-block h-auto ms-0 ms-sm-4 rounded user-profile-img"
                      style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                      width={120}
                      height={120}
                    />
                  </div>
                  <div className="flex-grow-1 mt-3 mt-sm-5">
                    <div className="d-flex align-items-md-end align-items-sm-start align-items-center justify-content-md-between justify-content-start mx-4 flex-md-row flex-column gap-4">
                      <div className="user-profile-info">
                        <h4 className="mb-2">{user.fullName}</h4>
                        <ul className="list-inline mb-0 d-flex align-items-center flex-wrap justify-content-sm-start justify-content-center gap-2">
                          <li className="list-inline-item">
                            <i className="ti ti-crown text-primary"></i> 
                            <span className={getRoleBadgeClass(user.role)}>{user.role}</span>
                          </li>
                          <li className="list-inline-item">
                            <i className="ti ti-mail text-primary"></i> {user.email}
                          </li>
                          <li className="list-inline-item">
                            <i className="ti ti-calendar text-primary"></i> 
                            Bergabung {user.createdAt ? formatDate(user.createdAt) : 'Tidak tersedia'}
                          </li>
                        </ul>
                      </div>
                      <span className={getStatusBadgeClass(user.isActive ?? false)}>
                        <i className={`ti ${user.isActive ? 'ti-check' : 'ti-x'} me-1`}></i>
                        {getStatusText(user.isActive ?? false)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Profile Content */}
          <div className="row">
            <div className="col-xl-4 col-lg-5 col-md-5">
              {/* About User */}
              <div className="card mb-4">
                <div className="card-body">
                  <small className="card-text text-uppercase text-muted">Informasi Pengguna</small>
                  <ul className="list-unstyled mb-4 mt-3">
                    <li className="d-flex align-items-center mb-3">
                      <i className="ti ti-user text-primary"></i>
                      <span className="fw-bold mx-2">Nama Lengkap:</span> 
                      <span>{user.fullName}</span>
                    </li>
                    <li className="d-flex align-items-center mb-3">
                      <i className="ti ti-check text-primary"></i>
                      <span className="fw-bold mx-2">Status:</span> 
                      <span className={getStatusBadgeClass(user.isActive ?? false)}>
                        {getStatusText(user.isActive ?? false)}
                      </span>
                    </li>
                    <li className="d-flex align-items-center mb-3">
                      <i className="ti ti-crown text-primary"></i>
                      <span className="fw-bold mx-2">Role:</span> 
                      <span className={getRoleBadgeClass(user.role)}>{user.role}</span>
                    </li>
                    <li className="d-flex align-items-center mb-3">
                      <i className="ti ti-id text-primary"></i>
                      <span className="fw-bold mx-2">User ID:</span> 
                      <span className="font-monospace">{user.id}</span>
                    </li>
                  </ul>
                  
                  <small className="card-text text-uppercase text-muted">Kontak</small>
                  <ul className="list-unstyled mb-4 mt-3">
                    <li className="d-flex align-items-center mb-3">
                      <i className="ti ti-mail text-primary"></i>
                      <span className="fw-bold mx-2">Email:</span>
                      <span>{user.email}</span>
                    </li>
                    <li className="d-flex align-items-center mb-3">
                      <i className="ti ti-phone text-primary"></i>
                      <span className="fw-bold mx-2">Telepon:</span>
                      <span>{user.phone || 'Tidak tersedia'}</span>
                    </li>
                  </ul>
                  
                  <small className="card-text text-uppercase text-muted">Aktivitas</small>
                  <ul className="list-unstyled mb-0 mt-3">
                    <li className="d-flex align-items-center mb-3">
                      <i className="ti ti-calendar-plus text-primary"></i>
                      <span className="fw-bold mx-2">Tanggal Bergabung:</span>
                      <span>{user.createdAt ? formatDate(user.createdAt) : 'Tidak tersedia'}</span>
                    </li>
                    <li className="d-flex align-items-center">
                      <i className="ti ti-clock text-primary"></i>
                      <span className="fw-bold mx-2">Login Terakhir:</span>
                      <span>{user.lastLogin ? formatDate(user.lastLogin) : 'Belum pernah login'}</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card mb-4">
                <div className="card-body">
                  <small className="card-text text-uppercase text-muted">Aksi Cepat</small>
                  <div className="d-grid gap-2 mt-3">
                    <button 
                      className="btn btn-primary"
                      onClick={() => router.push(`/user-management/${userId}/edit`)}
                    >
                      <i className="ti ti-edit me-2"></i>
                      Edit Pengguna
                    </button>
                    <button 
                      className="btn btn-label-warning"
                      onClick={() => {
                        // TODO: Implementasi reset password
                        alert('Fitur reset password akan diimplementasikan')
                      }}
                    >
                      <i className="ti ti-key me-2"></i>
                      Reset Password
                    </button>
                    <button 
                      className={`btn ${user.isActive ? 'btn-label-danger' : 'btn-label-success'}`}
                      onClick={() => {
                        // TODO: Implementasi toggle status
                        alert(`Fitur ${user.isActive ? 'nonaktifkan' : 'aktifkan'} user akan diimplementasikan`)
                      }}
                    >
                      <i className={`ti ${user.isActive ? 'ti-user-x' : 'ti-user-check'} me-2`}></i>
                      {user.isActive ? 'Nonaktifkan' : 'Aktifkan'} User
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-8 col-lg-7 col-md-7">
              {/* Activity Timeline */}
              <div className="card card-action mb-4">
                <div className="card-header align-items-center">
                  <h5 className="card-action-title mb-0">
                    <i className="ti ti-clock-hour-3 me-2"></i>
                    Riwayat Aktivitas
                  </h5>
                  <div className="card-action-element">
                    <div className="dropdown">
                      <button
                        type="button"
                        className="btn dropdown-toggle hide-arrow p-0"
                        data-bs-toggle="dropdown"
                        aria-expanded="false">
                        <i className="ti ti-dots-vertical text-muted"></i>
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li><a className="dropdown-item" href="javascript:void(0);">Ekspor Log</a></li>
                        <li><a className="dropdown-item" href="javascript:void(0);">Filter Aktivitas</a></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><a className="dropdown-item" href="javascript:void(0);">Refresh</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="card-body pb-0">
                  <ul className="timeline ms-1 mb-0">
                    <li className="timeline-item timeline-item-transparent">
                      <span className="timeline-point timeline-point-primary"></span>
                      <div className="timeline-event">
                        <div className="timeline-header">
                          <h6 className="mb-0">Login Terakhir</h6>
                          <small className="text-muted">Hari ini</small>
                        </div>
                        <p className="mb-2">Login ke sistem pada {user.lastLogin ? formatDate(user.lastLogin) : 'Tidak tersedia'}</p>
                      </div>
                    </li>
                    <li className="timeline-item timeline-item-transparent">
                      <span className="timeline-point timeline-point-success"></span>
                      <div className="timeline-event">
                        <div className="timeline-header">
                          <h6 className="mb-0">Akun Dibuat</h6>
                          <small className="text-muted">{user.createdAt ? formatDate(user.createdAt) : 'Tidak tersedia'}</small>
                        </div>
                        <p className="mb-0">Pengguna terdaftar dalam sistem</p>
                      </div>
                    </li>
                    <li className="timeline-item timeline-item-transparent border-0">
                      <span className="timeline-point timeline-point-info"></span>
                      <div className="timeline-event">
                        <div className="timeline-header">
                          <h6 className="mb-0">Role Ditetapkan</h6>
                          <small className="text-muted">{user.createdAt ? formatDate(user.createdAt) : 'Tidak tersedia'}</small>
                        </div>
                        <p className="mb-0">Role <span className={getRoleBadgeClass(user.role)}>{user.role}</span> ditetapkan</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* User Statistics */}
              <div className="row">
                <div className="col-lg-6">
                  <div className="card mb-4">
                    <div className="card-body text-center">
                      <div className="avatar mx-auto mb-3">
                        <span className="avatar-initial rounded bg-label-primary">
                          <i className="ti ti-users ti-md"></i>
                        </span>
                      </div>
                      <h5 className="mb-1">Role Management</h5>
                      <p className="mb-0">User role: <span className={getRoleBadgeClass(user.role)}>{user.role}</span></p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="card mb-4">
                    <div className="card-body text-center">
                      <div className="avatar mx-auto mb-3">
                        <span className="avatar-initial rounded bg-label-success">
                          <i className="ti ti-shield-check ti-md"></i>
                        </span>
                      </div>
                      <h5 className="mb-1">Account Security</h5>
                      <p className="mb-0">Status: <span className={getStatusBadgeClass(user.isActive ?? false)}>{getStatusText(user.isActive ?? false)}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
} 