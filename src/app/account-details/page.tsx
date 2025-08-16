'use client'

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import DashboardLayout from '@/components/layout/DashboardLayout'
import SecureGuard from '@/components/auth/SecureGuard'
import { useAuth } from '@/contexts/AuthContext'
import { usePageTitle } from '@/hooks/usePageTitle';
import { useToast } from '@/contexts/ToastContext';
import { updateUser as updateUserAPI } from '@/lib/api';
import Swal from 'sweetalert2';

// Interface untuk response API user
interface UserData {
  id: string;
  fullName: string;
  email: string;
  role: string;
  forcePasswordChange: boolean;
  tenantId: string;
  tenant?: {
    id: string;
    name: string;
    status: string;
    domain: string;
    logo_url?: string;
    email?: string;
    contact_person?: string;
  };
}

export default function AccountDetailsPage() {
  const { user: authUser, updateUser } = useAuth()
  const { showToast } = useToast()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showTenantModal, setShowTenantModal] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [updateForm, setUpdateForm] = useState({
    fullName: '',
    email: ''
  })
  const [tenantForm, setTenantForm] = useState({
    name: '',
    logo_url: '',
    domain: '',
    email: '',
    contact_person: ''
  })

  // Dynamic title management using custom hook
  const { fullTitle, pageTitle, pageSubtitle } = usePageTitle({
    title: 'Detail Akun',
    subtitle: 'Informasi detail akun pengguna',
    description: 'Kelola dan lihat informasi detail akun pengguna dalam sistem.',
    keywords: 'account details, user profile, account security, user management'
  });

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        console.log('🔍 Fetching user data...')
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        })
        
        if (!response.ok) {
          throw new Error('Gagal mengambil data user')
        }
        
        const data = await response.json()
        console.log('📦 User data received:', data)
        
        if (data.user) {
          setUser(data.user)
          setUpdateForm({
            fullName: data.user.fullName || '',
            email: data.user.email || ''
          })
          if (data.user.tenant) {
            setTenantForm({
              name: data.user.tenant.name || '',
              logo_url: data.user.tenant.logo_url || '',
              domain: data.user.tenant.domain || '',
              email: data.user.tenant.email || '',
              contact_person: data.user.tenant.contact_person || ''
            })
          }
          console.log('✅ User data set successfully')
        }
      } catch (error) {
        console.error('❌ Error fetching user data:', error)
        showToast({
          type: 'error',
          title: 'Error',
          message: 'Gagal mengambil data user'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [showToast])

  // Handle user update
  const handleUserUpdate = async () => {
    try {
      setUpdating(true)
      console.log('🔄 Updating user data...')
      const data = await updateUserAPI({
        id: user?.id || '',
        fullName: updateForm.fullName,
        email: updateForm.email
      })

      // Update local state
      if (data.user) {
        setUser(data.user)
        // Update auth context
        updateUser({
          id: data.user.id,
          fullName: data.user.fullName,
          email: data.user.email,
          role: data.user.role,
          tenantId: data.user.tenantId || null,
          force_password_change: data.user.forcePasswordChange
        })
        console.log('✅ User updated successfully')
      }

      // Show SweetAlert success
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data user berhasil diperbarui',
        confirmButtonText: 'OK',
        confirmButtonColor: '#696cff',
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: 'swal-custom-popup'
        }
      })
      
      // Also show toast notification
      showToast({
        type: 'success',
        title: 'Berhasil',
        message: 'Data user berhasil diperbarui'
      })
      setShowUpdateModal(false)
    } catch (error) {
      console.error('❌ Error updating user:', error)
      
      // Show SweetAlert error
      await Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error instanceof Error ? error.message : 'Gagal memperbarui data user',
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc3545',
        customClass: {
          popup: 'swal-custom-popup'
        }
      })
      
      // Also show toast notification
      showToast({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Gagal memperbarui data user'
      })
    } finally {
      setUpdating(false)
    }
  }

  // Handle tenant update (only for admin_tenant role)
  const handleTenantUpdate = async () => {
    if (!user?.tenant?.id) {
      // Show SweetAlert error
      await Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Tidak ada data tenant yang dapat diupdate',
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc3545',
        customClass: {
          popup: 'swal-custom-popup'
        }
      })
      
      // Also show toast notification
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Tidak ada data tenant yang dapat diupdate'
      })
      return
    }

    try {
      setUpdating(true)
      console.log('🔄 Updating tenant data...')
      const response = await fetch(`/api/tenants/${user.tenant.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          name: tenantForm.name,
          logo_url: tenantForm.logo_url,
          domain: tenantForm.domain,
          email: tenantForm.email,
          contact_person: tenantForm.contact_person
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Gagal memperbarui data tenant')
      }

      // Update local state
      if (data.data && user) {
        setUser({
          ...user,
          tenant: {
            ...user.tenant,
            name: data.data.name,
            logo_url: data.data.logo_url,
            domain: data.data.domain,
            email: data.data.email,
            contact_person: data.data.contact_person
          }
        })
        console.log('✅ Tenant updated successfully')
      }

      // Show SweetAlert success
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Data tenant berhasil diperbarui',
        confirmButtonText: 'OK',
        confirmButtonColor: '#696cff',
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: 'swal-custom-popup'
        }
      })
      
      // Also show toast notification
      showToast({
        type: 'success',
        title: 'Berhasil',
        message: 'Data tenant berhasil diperbarui'
      })
      setShowTenantModal(false)
    } catch (error) {
      console.error('❌ Error updating tenant:', error)
      
      // Show SweetAlert error
      await Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error instanceof Error ? error.message : 'Gagal memperbarui data tenant',
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc3545',
        customClass: {
          popup: 'swal-custom-popup'
        }
      })
      
      // Also show toast notification
      showToast({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Gagal memperbarui data tenant'
      })
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container-xxl flex-grow-1 container-p-y">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={`${pageSubtitle}. Kelola dan lihat informasi detail akun pengguna dalam sistem.`} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={`${pageSubtitle}. Informasi detail akun pengguna.`} />
        <meta name="keywords" content="account details, user profile, account security, user management" />
      </Head>
      
      <SecureGuard requireAuth={true}>
        <DashboardLayout>
          <div className="container-xxl flex-grow-1 container-p-y">
            {/* Page Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h4 className="fw-bold mb-1 text-primary">
                  <i className="ti ti-user me-2"></i>
                  {pageTitle}
                </h4>
                <p className="text-muted mb-0">{pageSubtitle}</p>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-label-primary">
                  <i className="ti ti-download me-1"></i>
                  <span>Export Data</span>
                </button>
              </div>
            </div>

            <div className="row">
              {/* Card Informasi Akun */}
              <div className="col-lg-6 mb-4">
                <div className="card h-100">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">
                      <i className="ti ti-user text-primary me-2"></i>
                      Informasi Akun
                    </h5>
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setShowUpdateModal(true)}
                    >
                      <i className="ti ti-edit me-1"></i>
                      Edit
                    </button>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="text-muted">Nama Lengkap</span>
                          <span className="fw-semibold">{user?.fullName || '-'}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="text-muted">Email</span>
                          <span className="fw-semibold">{user?.email || '-'}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="text-muted">ID Pengguna</span>
                          <span className="fw-semibold text-muted">{user?.id || '-'}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="text-muted">Role</span>
                          <span className="badge bg-label-primary">{user?.role || '-'}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="text-muted">Status Password</span>
                          <span className={`badge ${user?.forcePasswordChange ? 'bg-label-danger' : 'bg-label-success'}`}>
                            {user?.forcePasswordChange ? 'Perlu Diubah' : 'Aman'}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="text-muted">Status Akun</span>
                          <span className="badge bg-label-success">Aktif</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Informasi Tenant */}
              <div className="col-lg-6 mb-4">
                <div className="card h-100">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">
                      <i className="ti ti-building text-primary me-2"></i>
                      Informasi Tenant
                    </h5>
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setShowTenantModal(true)}
                      disabled={!user?.tenant}
                    >
                      <i className="ti ti-edit me-1"></i>
                      Edit
                    </button>
                  </div>
                  <div className="card-body">
                    {user?.tenant ? (
                      <div className="row">
                        <div className="col-12">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-muted">Nama Tenant</span>
                            <span className="fw-semibold">{user.tenant.name || '-'}</span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-muted">Domain</span>
                            <span className="fw-semibold">{user.tenant.domain || '-'}</span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-muted">Email</span>
                            <span className="fw-semibold">{user.tenant.email || '-'}</span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-muted">Contact Person</span>
                            <span className="fw-semibold">{user.tenant.contact_person || '-'}</span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-muted">Tenant ID</span>
                            <span className="fw-semibold text-muted">{user.tenant.id || '-'}</span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted">Status Tenant</span>
                            <span className="badge bg-label-success">{user.tenant.status || 'Aktif'}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <i className="ti ti-building-off text-muted fs-1 mb-3"></i>
                        <p className="text-muted mb-0">Tidak ada data tenant</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Update User */}
          {showUpdateModal && (
            <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Informasi Akun</h5>
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setShowUpdateModal(false)}
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Nama Lengkap</label>
                      <input
                        type="text"
                        className="form-control"
                        value={updateForm.fullName}
                        onChange={(e) => setUpdateForm({...updateForm, fullName: e.target.value})}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={updateForm.email}
                        onChange={(e) => setUpdateForm({...updateForm, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={() => setShowUpdateModal(false)}
                    >
                      Batal
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-primary" 
                      onClick={handleUserUpdate}
                      disabled={updating}
                    >
                      {updating ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Menyimpan...
                        </>
                      ) : (
                        'Simpan'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Update Tenant */}
          {showTenantModal && (
            <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Informasi Tenant</h5>
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setShowTenantModal(false)}
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    {user?.tenant ? (
                      <>
                        <div className="mb-3">
                          <label className="form-label">Nama Tenant</label>
                          <input
                            type="text"
                            className="form-control"
                            value={tenantForm.name}
                            onChange={(e) => setTenantForm({...tenantForm, name: e.target.value})}
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Logo URL</label>
                          <input
                            type="url"
                            className="form-control"
                            value={tenantForm.logo_url}
                            onChange={(e) => setTenantForm({...tenantForm, logo_url: e.target.value})}
                            placeholder="https://example.com/logo.png"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Domain</label>
                          <input
                            type="url"
                            className="form-control"
                            value={tenantForm.domain}
                            onChange={(e) => setTenantForm({...tenantForm, domain: e.target.value})}
                            placeholder="https://example.com"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            value={tenantForm.email}
                            onChange={(e) => setTenantForm({...tenantForm, email: e.target.value})}
                            placeholder="tenant@example.com"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Contact Person</label>
                          <input
                            type="tel"
                            className="form-control"
                            value={tenantForm.contact_person}
                            onChange={(e) => setTenantForm({...tenantForm, contact_person: e.target.value})}
                            placeholder="08123456789"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <i className="ti ti-building-off text-muted fs-1 mb-3"></i>
                        <p className="text-muted mb-0">Tidak ada data tenant yang dapat diedit</p>
                      </div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={() => setShowTenantModal(false)}
                    >
                      Tutup
                    </button>
                    {user?.tenant && (
                      <button 
                        type="button" 
                        className="btn btn-primary" 
                        onClick={handleTenantUpdate}
                        disabled={updating}
                      >
                        {updating ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Menyimpan...
                          </>
                        ) : (
                          'Simpan'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DashboardLayout>
      </SecureGuard>
    </>
  )
} 