'use client'

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import DashboardLayout from '@/components/layout/DashboardLayout'
import SecureGuard from '@/components/auth/SecureGuard'
import { useAuth } from '@/contexts/AuthContext'
import { usePageTitle } from '@/hooks/usePageTitle';
import { useToastContext } from '@/contexts/ToastContext';

// CSS untuk styling card payment channel
const paymentChannelStyles = `
  .payment-channel-card {
    border-radius: 12px;
    border: 1px solid #e9ecef;
    transition: all 0.3s ease;
  }
  
  .payment-channel-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
  
  /* Toggle switch styling - hidden for now
  .payment-channel-card .form-check-input {
    width: 2.5rem;
    height: 1.25rem;
    margin-top: 0;
  }
  
  .payment-channel-card .form-check-input:checked {
    background-color: #696cff;
    border-color: #696cff;
  }
  */
  
  .payment-channel-card .badge {
    font-size: 0.75rem;
  }
`;

// Interface untuk payment method detail
interface PaymentMethod {
  id: string;
  code: string;
  name: string;
  type: string;
  logo_url: string;
}

// Interface untuk response API tenant payment methods
interface TenantPaymentMethod {
  id: string;
  tenant_id: string;
  payment_method_id: string;
  fee_type: 'flat' | 'percent';
  fee_value: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  paymentMethod: PaymentMethod;
}

interface TenantPaymentMethodsResponse {
  message: string;
  data: TenantPaymentMethod[];
}

// Interface untuk user data dari /api/user
interface UserData {
  id: string;
  fullName: string;
  email: string;
  role: string;
  tenantId: string;
  tenant?: {
    id: string;
    name: string;
    status: string;
    domain: string;
  };
}

interface UserResponse {
  message: string;
  user: UserData;
}

export default function PaymentChannelPage() {
  const { user } = useAuth()
  const { showSuccess, showError } = useToastContext()
  const [paymentMethods, setPaymentMethods] = useState<TenantPaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [tenantId, setTenantId] = useState<string | null>(null)

  // Dynamic title management using custom hook
  const { fullTitle, pageTitle, pageSubtitle } = usePageTitle({
    title: 'Payment Channel',
    subtitle: 'Kelola channel pembayaran yang tersedia',
    description: 'Kelola dan konfigurasi channel pembayaran dalam sistem.',
    keywords: 'payment channel, payment method, payment configuration, payment gateway'
  });

  // Fetch user data to get tenant ID (for admin_tenant role)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        console.log('🔍 Fetching user data to get tenant ID...')
        
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        })
        
        if (!response.ok) {
          throw new Error('Gagal mengambil data user')
        }
        
        const data = await response.json()
        console.log('📦 User data received:', data)
        
        // Check if user has tenant_admin role
        if (data.user && data.user.role !== 'tenant_admin') {
          throw new Error('Akses ditolak. Hanya admin tenant yang dapat mengakses halaman ini.')
        }
        
        if (data.user && data.user.tenantId) {
          setTenantId(data.user.tenantId)
          console.log('✅ Tenant ID set:', data.user.tenantId)
          
          // Fetch payment methods after getting tenant ID
          await fetchPaymentMethods(data.user.tenantId)
        } else {
          throw new Error('Tenant ID tidak ditemukan')
        }
      } catch (error) {
        console.error('❌ Error fetching user data:', error)
        showError('Error', error instanceof Error ? error.message : 'Gagal mengambil data user')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [showError])

  // Fetch payment methods data from external API
  const fetchPaymentMethods = async (tenantId: string) => {
    try {
      console.log('🔍 Fetching payment methods for tenant:', tenantId)
      
      const response = await fetch(`/api/tenant-payment-methods?tenant_id=${tenantId}`, {
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error('Gagal mengambil data payment methods')
      }
      
      const data: TenantPaymentMethodsResponse = await response.json()
      console.log('📦 Payment methods data received:', data)
      
      if (data.data) {
        setPaymentMethods(data.data)
        console.log('✅ Payment methods data set successfully')
      }
    } catch (error) {
      console.error('❌ Error fetching payment methods:', error)
      showError('Error', 'Gagal mengambil data payment methods')
    }
  }

  // Toggle status payment method
  const togglePaymentMethodStatus = async (methodId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      
      const response = await fetch(`/api/tenant-payment-methods/${methodId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      })
      
      if (!response.ok) {
        throw new Error('Gagal mengubah status payment method')
      }
      
      // Update local state
      setPaymentMethods(prev => prev.map(method => 
        method.id === methodId 
          ? { ...method, status: newStatus as 'active' | 'inactive' }
          : method
      ))
      
      showSuccess('Berhasil', `Status payment method berhasil diubah menjadi ${newStatus === 'active' ? 'aktif' : 'nonaktif'}`)
    } catch (error) {
      console.error('❌ Error toggling payment method status:', error)
      showError('Error', 'Gagal mengubah status payment method')
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
        <meta name="description" content={`${pageSubtitle}. Kelola dan konfigurasi channel pembayaran dalam sistem.`} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={`${pageSubtitle}. Kelola channel pembayaran.`} />
        <meta name="keywords" content="payment channel, payment method, payment configuration, payment gateway" />
        <style>{paymentChannelStyles}</style>
      </Head>
      
      <SecureGuard requireAuth={true}>
        <DashboardLayout>
          <div className="container-xxl flex-grow-1 container-p-y">
            {/* Page Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h4 className="fw-bold mb-1 text-primary">
                  <i className="ti ti-credit-card me-2"></i>
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

            {/* Payment Channel Cards */}
            <div className="row">
              {paymentMethods.length === 0 ? (
                <div className="col-12">
                  <div className="card">
                    <div className="card-body text-center py-5">
                      <i className="ti ti-credit-card text-muted" style={{ fontSize: '3rem' }}></i>
                      <p className="text-muted mt-3">Belum ada payment channel yang dikonfigurasi</p>
                    </div>
                  </div>
                </div>
              ) : (
                paymentMethods.map((method) => (
                  <div key={method.id} className="col-md-6 col-lg-3 mb-3">
                    <div className="card h-100 shadow-sm payment-channel-card">
                      <div className="card-body p-4">
                        {/* Header */}
                        <div className="mb-3">
                          <h6 className="card-title fw-bold mb-0">
                            {method.paymentMethod.name}
                          </h6>
                        </div>

                        {/* Logo Bank */}
                        <div className="text-center mb-3">
                          {method.paymentMethod.logo_url ? (
                            <img
                              src={method.paymentMethod.logo_url}
                              alt={method.paymentMethod.name}
                              className="img-fluid"
                              style={{ maxHeight: '50px', maxWidth: '100px', objectFit: 'contain' }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="bg-light rounded p-2 d-inline-block">
                              <i className="ti ti-building-bank text-muted" style={{ fontSize: '1.5rem' }}></i>
                            </div>
                          )}
                        </div>

                        {/* Informasi Payment Method */}
                        <div className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-muted small">Kode:</span>
                            <span className="fw-semibold small">{method.paymentMethod.code}</span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-muted small">Tipe:</span>
                            <span className="fw-semibold small">{method.paymentMethod.type}</span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-muted small">Status:</span>
                            <span className={`badge ${method.status === 'active' ? 'bg-label-success' : 'bg-label-danger'} small`}>
                              {method.status === 'active' ? 'Aktif' : 'Nonaktif'}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-muted small">Biaya:</span>
                            <span className="fw-semibold small">
                              {method.fee_type === 'percent' 
                                ? `${(method.fee_value * 100).toFixed(1)}%` 
                                : `Rp ${method.fee_value.toLocaleString()}`
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </DashboardLayout>
      </SecureGuard>
    </>
  )
} 