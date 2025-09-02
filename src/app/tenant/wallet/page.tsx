'use client'

import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import DashboardLayout from '@/components/layout/DashboardLayout'
import AuthGuard from '@/components/auth/AuthGuard'
import { WalletData, WalletLedgerItem } from '@/types/wallet'
import { usePageTitle } from '@/hooks/usePageTitle'
import { PayoutRequestModal } from '@/components/wallet/PayoutRequestModal'
import { WalletLedgerModal } from '@/components/wallet/WalletLedgerModal'

export default function TenantWalletPage() {
  const [walletData, setWalletData] = useState<WalletData | null>(null)
  const [ledgerData, setLedgerData] = useState<WalletLedgerItem[]>([])
  const [userData, setUserData] = useState<{
    id: string
    fullName: string
    email: string
    role: string
    forcePasswordChange: boolean
    isVerified: boolean
    tenantId: string
    tenant: {
      id: string
      name: string
      status: string
      domain: string
    }
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [ledgerLoading, setLedgerLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Modal states
  const [showPayoutModal, setShowPayoutModal] = useState(false)
  const [showLedgerModal, setShowLedgerModal] = useState(false)

  // Dynamic title management using custom hook
  const { fullTitle, pageTitle, pageSubtitle } = usePageTitle({
    title: 'Wallet Management',
    subtitle: 'Kelola saldo dan aktivitas wallet Anda',
    description: 'Kelola saldo dan aktivitas wallet Anda. Monitor saldo, lihat riwayat transaksi, dan lakukan penarikan dana.',
    keywords: 'wallet, saldo, payout, penarikan dana, aktivitas wallet'
  })

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const userResponse = await fetch('/api/user')
      const userDataResponse = await userResponse.json()
      
      if (!userDataResponse.user || !userDataResponse.user.tenantId) {
        setError('Gagal mendapatkan data tenant')
        return null
      }
      
      setUserData(userDataResponse.user)
      return userDataResponse.user
    } catch (err) {
      console.error('Error fetching user data:', err)
      setError('Gagal mendapatkan data user')
      return null
    }
  }

  // Fetch wallet data
  const fetchWalletData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Get user data first to get tenantId
      const user = await fetchUserData()
      if (!user) return
      
      const tenantId = user.tenantId
      
      const response = await fetch(`/api/tenants/${tenantId}/wallet`)
      const data = await response.json()
      
      if (data.ok) {
        setWalletData(data.data)
      } else {
        setError('Gagal memuat data wallet')
      }
    } catch (err) {
      setError('Terjadi kesalahan saat memuat data wallet')
      console.error('Error fetching wallet:', err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch ledger data
  const fetchLedgerData = async () => {
    try {
      setLedgerLoading(true)
      
      // Use existing user data if available, otherwise fetch it
      let user = userData
      if (!user) {
        user = await fetchUserData()
        if (!user) return
      }
      
      const tenantId = user.tenantId
      
      const response = await fetch(`/api/tenants/${tenantId}/wallet/ledger`)
      const data = await response.json()
      
      if (data.ok) {
        setLedgerData(data.items)
      } else {
        setError('Gagal memuat data ledger')
      }
    } catch (err) {
      setError('Terjadi kesalahan saat memuat data ledger')
      console.error('Error fetching ledger:', err)
    } finally {
      setLedgerLoading(false)
    }
  }

  // Handle payout request
  const handlePayoutRequest = async (payoutData: {
    amount: number
    bank: {
      code: string
      accountNo: string
      accountName: string
    }
    notes: string
  }) => {
    try {
      // Use existing user data if available, otherwise fetch it
      let user = userData
      if (!user) {
        user = await fetchUserData()
        if (!user) {
          alert('Gagal mendapatkan data tenant')
          return
        }
      }
      
      const tenantId = user.tenantId
      
      const response = await fetch(`/api/tenants/${tenantId}/payouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payoutData),
      })
      
      const data = await response.json()
      
      if (data.ok) {
        // Refresh wallet data after successful payout request
        await fetchWalletData()
        setShowPayoutModal(false)
        // Show success message
        alert('Permintaan payout berhasil dikirim!')
      } else {
        throw new Error(data.error || 'Gagal mengirim permintaan payout')
      }
    } catch (err) {
      console.error('Error requesting payout:', err)
      alert('Gagal mengirim permintaan payout: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  // Handle view ledger
  const handleViewLedger = async () => {
    await fetchLedgerData()
    setShowLedgerModal(true)
  }

  // Close modals
  const closePayoutModal = () => setShowPayoutModal(false)
  const closeLedgerModal = () => setShowLedgerModal(false)

  // Initial load
  useEffect(() => {
    fetchWalletData()
  }, [])

  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Loading state
  if (loading) {
    return (
      <AuthGuard requireAuth={true}>
        <DashboardLayout>
          <div className="container-xxl flex-grow-1 container-p-y">
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Memuat data wallet...</p>
            </div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  // Error state
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
    )
  }

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={`${pageSubtitle}. Monitor saldo, lihat riwayat transaksi, dan lakukan penarikan dana.`} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={`${pageSubtitle}. Kelola saldo dan aktivitas wallet Anda.`} />
        <meta name="keywords" content="wallet, saldo, payout, penarikan dana, aktivitas wallet" />
      </Head>

      <AuthGuard requireAuth={true}>
        <DashboardLayout>
          <div className="container-xxl flex-grow-1 container-p-y">
            {/* Page Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h4 className="fw-bold mb-1 text-primary">
                  <i className="ti ti-wallet me-2"></i>
                  {pageTitle}
                </h4>
                <p className="text-muted mb-0">
                  {pageSubtitle}
                  {userData?.tenant?.name && (
                    <span className="ms-2">
                      • <strong>Tenant:</strong> {userData.tenant.name}
                    </span>
                  )}
                </p>
              </div>
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-label-info"
                  onClick={handleViewLedger}
                >
                  <i className="ti ti-list me-1"></i>
                  <span>Lihat Ledger</span>
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowPayoutModal(true)}
                  disabled={!walletData || walletData.available_amount <= 0}
                >
                  <i className="ti ti-cash me-1"></i>
                  <span>Request Payout</span>
                </button>
              </div>
            </div>

            {/* Wallet Balance Cards */}
            {walletData && (
              <div className="row mb-4">
                <div className="col-md-4">
                  <div className="card border-success">
                    <div className="card-body text-center">
                      <div className="d-flex align-items-center justify-content-center mb-2">
                        <i className="ti ti-wallet text-success" style={{ fontSize: '2rem' }} />
                      </div>
                      <h4 className="text-success mb-1">
                        {formatCurrency(walletData.available_amount, walletData.currency)}
                      </h4>
                      <p className="text-muted mb-0">Available Amount</p>
                      <small className="text-muted">Dana yang dapat ditarik</small>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-4">
                  <div className="card border-warning">
                    <div className="card-body text-center">
                      <div className="d-flex align-items-center justify-content-center mb-2">
                        <i className="ti ti-clock text-warning" style={{ fontSize: '2rem' }} />
                      </div>
                      <h4 className="text-warning mb-1">
                        {formatCurrency(walletData.pending_amount, walletData.currency)}
                      </h4>
                      <p className="text-muted mb-0">Pending Amount</p>
                      <small className="text-muted">Dana dalam proses settlement</small>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-4">
                  <div className="card border-primary">
                    <div className="card-body text-center">
                      <div className="d-flex align-items-center justify-content-center mb-2">
                        <i className="ti ti-calculator text-primary" style={{ fontSize: '2rem' }} />
                      </div>
                      <h4 className="text-primary mb-1">
                        {formatCurrency(walletData.available_amount + walletData.pending_amount, walletData.currency)}
                      </h4>
                      <p className="text-muted mb-0">Total Balance</p>
                      <small className="text-muted">Total keseluruhan dana</small>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Wallet Info Card */}
            {walletData && (
              <div className="row mb-4">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <h6 className="card-title mb-0">Informasi Wallet</h6>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-semibold">Tenant ID</label>
                            <div>
                              <code className="text-primary">{walletData.tenant_id}</code>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-semibold">Currency</label>
                            <div>
                              <span className="badge bg-label-primary fs-6">{walletData.currency}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-semibold">Last Updated</label>
                            <div>
                              <span className="text-muted">
                                {new Date(walletData.updatedAt).toLocaleDateString('id-ID', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  second: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-semibold">Status</label>
                            <div>
                              <span className="badge bg-label-success">Active</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h6 className="card-title mb-0">Quick Actions</h6>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-4">
                        <button 
                          className="btn btn-outline-primary w-100"
                          onClick={handleViewLedger}
                        >
                          <i className="ti ti-list me-2"></i>
                          Lihat Riwayat Aktivitas
                        </button>
                      </div>
                      <div className="col-md-4">
                        <button 
                          className="btn btn-outline-success w-100"
                          onClick={() => setShowPayoutModal(true)}
                          disabled={!walletData || walletData.available_amount <= 0}
                        >
                          <i className="ti ti-cash me-2"></i>
                          Request Payout
                        </button>
                      </div>
                      <div className="col-md-4">
                        <button 
                          className="btn btn-outline-info w-100"
                          onClick={() => fetchWalletData()}
                        >
                          <i className="ti ti-refresh me-2"></i>
                          Refresh Data
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payout Request Modal */}
          {showPayoutModal && walletData && (
            <PayoutRequestModal
              walletData={walletData}
              onClose={closePayoutModal}
              onSubmit={handlePayoutRequest}
            />
          )}

          {/* Wallet Ledger Modal */}
          {showLedgerModal && walletData && (
            <WalletLedgerModal
              wallet={walletData}
              ledgerData={ledgerData}
              loading={ledgerLoading}
              onClose={closeLedgerModal}
            />
          )}
        </DashboardLayout>
      </AuthGuard>
    </>
  )
}
