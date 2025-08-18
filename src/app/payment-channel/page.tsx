'use client'

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import DashboardLayout from '@/components/layout/DashboardLayout'
import SecureGuard from '@/components/auth/SecureGuard'
import { useAuth } from '@/contexts/AuthContext'
import { usePageTitle } from '@/hooks/usePageTitle';
import { useToast } from '@/contexts/ToastContext';

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
  const { showToast } = useToast()
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
        showToast({
          type: 'error',
          title: 'Error',
          message: error instanceof Error ? error.message : 'Gagal mengambil data user'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [showToast])

  // Fetch payment methods data from external API
  const fetchPaymentMethods = async (tenantId: string) => {
    try {
      console.log('🔍 Fetching payment methods for tenant:', tenantId)
      
      const response = await fetch(`/api/tenants/${tenantId}/payment-methods`, {
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
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Gagal mengambil data payment methods'
      })
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

            {/* Informasi Payment Channel */}
            <div className="row">
              <div className="col-12 mb-4">
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">
                      <i className="ti ti-credit-card text-primary me-2"></i>
                      Informasi Payment Channel
                    </h5>
                  </div>
                  <div className="card-body">
                    {paymentMethods.length === 0 ? (
                      <div className="text-center py-4">
                        <i className="ti ti-credit-card text-muted" style={{ fontSize: '3rem' }}></i>
                        <p className="text-muted mt-3">Belum ada payment channel yang dikonfigurasi</p>
                      </div>
                    ) : (
                      <div className="row">
                        {paymentMethods.map((method) => (
                          <div key={method.id} className="col-12">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <span className="text-muted">Payment Method ID</span>
                              <span className="fw-semibold">{method.payment_method_id}</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <span className="text-muted">Fee Type</span>
                              <span className={`badge ${method.fee_type === 'percent' ? 'bg-label-info' : 'bg-label-warning'}`}>
                                {method.fee_type === 'percent' ? 'Percent' : 'Flat'}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <span className="text-muted">Fee Value</span>
                              <span className="fw-semibold">
                                {method.fee_type === 'percent' ? `${method.fee_value}%` : `Rp ${method.fee_value.toLocaleString()}`}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <span className="text-muted">Status</span>
                              <span className={`badge ${method.status === 'active' ? 'bg-label-success' : 'bg-label-danger'}`}>
                                {method.status === 'active' ? 'Aktif' : 'Nonaktif'}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <span className="text-muted">Tanggal Dibuat</span>
                              <span className="fw-semibold">{new Date(method.createdAt).toLocaleDateString('id-ID')}</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <span className="text-muted">ID</span>
                              <span className="fw-semibold text-muted">{method.id.substring(0, 8)}...</span>
                            </div>
                            <hr className="my-4" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>


        </DashboardLayout>
      </SecureGuard>
    </>
  )
} 