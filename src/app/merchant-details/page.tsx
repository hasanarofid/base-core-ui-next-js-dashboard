'use client'

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import DashboardLayout from '@/components/layout/DashboardLayout'
import SecureGuard from '@/components/auth/SecureGuard'
import { useAuth } from '@/contexts/AuthContext'
import { usePageTitle } from '@/hooks/usePageTitle';
import { useToast } from '@/contexts/ToastContext';
import Swal from 'sweetalert2';

// Interface untuk response API tenant
interface TenantData {
  id: string;
  name: string;
  logo_url: string;
  domain: string;
  email: string;
  contact_person: string;
  config_json: {
    callbackUrl?: string;
    ipConfig?: string[];
    [key: string]: unknown;
  };
  status: string;
  client_id: string;
  client_key: string;
  createdAt: string;
  updatedAt: string;
}

interface TenantResponse {
  message: string;
  data: TenantData;
}

export default function MerchantDetailsPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [tenantData, setTenantData] = useState<TenantData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showTenantModal, setShowTenantModal] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [tenantForm, setTenantForm] = useState({
    name: '',
    logo_url: '',
    domain: '',
    email: '',
    contact_person: '',
    callbackUrl: '',
    ipConfig: [] as string[]
  })

  // Fetch tenant data from API
  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        setLoading(true)
        console.log('🔍 Fetching tenant data...')
        
        if (user?.tenantId) {
          await fetchTenantDataById(user.tenantId)
        }
      } catch (error) {
        console.error('❌ Error fetching tenant data:', error)
        showToast({
          type: 'error',
          title: 'Error',
          message: 'Gagal mengambil data tenant'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTenantData()
  }, [user?.tenantId, showToast])

  // Fetch tenant data by ID
  const fetchTenantDataById = async (tenantId: string) => {
    try {
      console.log('🔍 Fetching tenant data for ID:', tenantId)
      const response = await fetch(`/api/tenant/${tenantId}`, {
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error('Gagal mengambil data tenant')
      }
      
      const data: TenantResponse = await response.json()
      console.log('📦 Tenant data received:', data)
      
      if (data.data) {
        setTenantData(data.data)
        setTenantForm({
          name: data.data.name || '',
          logo_url: data.data.logo_url || '',
          domain: data.data.domain || '',
          email: data.data.email || '',
          contact_person: data.data.contact_person || '',
          callbackUrl: data.data.config_json?.callbackUrl || '',
          ipConfig: data.data.config_json?.ipConfig || []
        })
        console.log('✅ Tenant data set successfully')
        console.log('📊 Tenant status:', data.data.status)
        console.log('📊 Status text:', getTenantStatusText(data.data.status))
        console.log('📊 Status badge class:', getTenantStatusBadgeClass(data.data.status))
      }
    } catch (error) {
      console.error('❌ Error fetching tenant data:', error)
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Gagal mengambil data tenant'
      })
    }
  }

  // Helper function untuk mendapatkan teks status tenant
  const getTenantStatusText = (status?: string) => {
    console.log('🔍 Getting tenant status text for:', status)
    
    if (!status) {
      console.log('📊 Status text: Tidak Diketahui (no status)')
      return 'Tidak Diketahui'
    }
    
    const statusMap: { [key: string]: string } = {
      'active': 'Aktif',
      'inactive': 'Tidak Aktif',
      'pending': 'Pending',
      'suspended': 'Ditangguhkan',
      'deleted': 'Dihapus'
    }
    
    const result = statusMap[status.toLowerCase()] || status
    console.log('📊 Status text result:', result)
    return result
  }

  // Helper function untuk mendapatkan badge class status tenant
  const getTenantStatusBadgeClass = (status?: string) => {
    console.log('🔍 Getting tenant status badge class for:', status)
    
    if (!status) {
      console.log('📊 Badge class: bg-label-secondary (no status)')
      return 'bg-label-secondary'
    }
    
    const statusClassMap: { [key: string]: string } = {
      'active': 'bg-label-success',
      'inactive': 'bg-label-danger',
      'pending': 'bg-label-warning',
      'suspended': 'bg-label-info',
      'deleted': 'bg-label-dark'
    }
    
    const result = statusClassMap[status.toLowerCase()] || 'bg-label-secondary'
    console.log('📊 Badge class result:', result)
    return result
  }

  // Handle tenant update
  const handleTenantUpdate = async () => {
    if (!tenantData?.id) {
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
      const response = await fetch(`/api/tenant/${tenantData.id}`, {
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
          contact_person: tenantForm.contact_person,
          config_json: {
            callbackUrl: tenantForm.callbackUrl,
            ipConfig: tenantForm.ipConfig
          }
        })
      })

      if (!response.ok) {
        throw new Error('Gagal memperbarui data tenant')
      }

      const data = await response.json()
      console.log('✅ Tenant updated successfully:', data)

      // Update local state
      if (data.data) {
        setTenantData(data.data)
        console.log('✅ Tenant data updated successfully')
      }

      // Close modal
      setShowTenantModal(false)

      // Show success alert
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

    } catch (error) {
      console.error('❌ Error updating tenant:', error)
      
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
      
      showToast({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Gagal memperbarui data tenant'
      })
    } finally {
      setUpdating(false)
    }
  }

  // Data merchant dummy - dalam implementasi nyata akan diambil dari API
  const merchantData = {
    name: 'PT. Merchant Indonesia',
    code: 'MERCH001',
    type: 'E-commerce',
    status: 'Aktif',
    address: 'Jl. Sudirman No. 123, Jakarta Pusat',
    phone: '+62 21 1234 5678',
    email: 'contact@merchantindonesia.com',
    website: 'www.merchantindonesia.com',
    registrationDate: '2024-01-15',
    taxId: '12.345.678.9-123.456',
    bankAccount: '1234567890',
    bankName: 'Bank Central Asia (BCA)',
    settlementPeriod: 'T+1',
    commissionRate: '2.5%',
    monthlyVolume: 'Rp 500.000.000',
    totalTransactions: 1250
  }

  // Dynamic title management using custom hook
  const { fullTitle, pageTitle, pageSubtitle } = usePageTitle({
    title: 'Detail Merchant',
    subtitle: 'Informasi detail merchant dan konfigurasi',
    description: 'Kelola dan lihat informasi detail merchant dalam sistem.',
    keywords: 'merchant details, merchant profile, merchant configuration, business information'
  });

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
        <meta name="description" content={`${pageSubtitle}. Kelola dan lihat informasi detail merchant dalam sistem.`} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={`${pageSubtitle}. Informasi detail merchant.`} />
        <meta name="keywords" content="merchant details, merchant profile, merchant configuration, business information" />
      </Head>
      
      <SecureGuard requireAuth={true}>
        <DashboardLayout>
          <div className="container-xxl flex-grow-1 container-p-y">
            {/* Page Header - Matching Dashboard Style */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h4 className="fw-bold mb-1 text-primary">
                  <i className="ti ti-building-store me-2"></i>
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




            {/* Informasi Tenant */}
            <div className="row">
              <div className="col-12 mb-4">
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">
                      <i className="ti ti-building text-primary me-2"></i>
                      Informasi Tenant
                    </h5>
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setShowTenantModal(true)}
                      disabled={!tenantData}
                    >
                      <i className="ti ti-edit me-1"></i>
                      Edit
                    </button>
                  </div>
                  <div className="card-body">
                    {tenantData ? (
                      <div className="row">
                        <div className="col-md-6">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-muted">Nama Tenant</span>
                            <span className="fw-semibold">{tenantData.name || '-'}</span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-muted">Domain</span>
                            <span className="fw-semibold">{tenantData.domain || '-'}</span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-muted">Email</span>
                            <span className="fw-semibold">{tenantData.email || '-'}</span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-muted">Contact Person</span>
                            <span className="fw-semibold">{tenantData.contact_person || '-'}</span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-muted">Callback URL</span>
                            <span className="fw-semibold text-primary">
                              {tenantData.config_json?.callbackUrl ? (
                                <a href={tenantData.config_json.callbackUrl} target="_blank" rel="noopener noreferrer">
                                  {tenantData.config_json.callbackUrl}
                                </a>
                              ) : '-'}
                            </span>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-muted">Client ID</span>
                            <span className="fw-semibold text-muted">{tenantData.client_id || '-'}</span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-muted">Tenant ID</span>
                            <span className="fw-semibold text-muted">{tenantData.id || '-'}</span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-muted">Status Tenant</span>
                            <span className={`badge ${getTenantStatusBadgeClass(tenantData.status)}`}>
                              {getTenantStatusText(tenantData.status)}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-muted">Tanggal Dibuat</span>
                            <span className="fw-semibold">{new Date(tenantData.createdAt).toLocaleDateString('id-ID')}</span>
                          </div>
                          <div className="mb-3">
                            <span className="text-muted d-block mb-2">IP Config</span>
                            {tenantData.config_json?.ipConfig && tenantData.config_json.ipConfig.length > 0 ? (
                              <div className="d-flex flex-wrap gap-1">
                                {tenantData.config_json.ipConfig.map((ip, index) => (
                                  <span key={index} className="badge bg-label-info me-1 mb-1">{ip}</span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
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

            {/* Konfigurasi Merchant */}
          </div>

          {/* Modal Edit Tenant */}
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
                    {tenantData ? (
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
                        <div className="mb-3">
                          <label className="form-label">Callback URL</label>
                          <input
                            type="url"
                            className="form-control"
                            value={tenantForm.callbackUrl}
                            onChange={(e) => setTenantForm({...tenantForm, callbackUrl: e.target.value})}
                            placeholder="https://example.com/callback"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">IP Config (satu IP per baris)</label>
                          <textarea
                            className="form-control"
                            rows={3}
                            value={tenantForm.ipConfig.join('\n')}
                            onChange={(e) => setTenantForm({
                              ...tenantForm, 
                              ipConfig: e.target.value.split('\n').filter(ip => ip.trim() !== '')
                            })}
                            placeholder="192.168.1.1&#10;10.0.0.1&#10;172.16.0.1"
                          />
                          <small className="text-muted">Masukkan satu IP address per baris</small>
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
                    {tenantData && (
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