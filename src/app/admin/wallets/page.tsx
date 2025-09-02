'use client'

import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import DashboardLayout from '@/components/layout/DashboardLayout'
import AuthGuard from '@/components/auth/AuthGuard'
import { DataTable, Column } from '@/components/ui/DataTable'
import { WalletDetailModal } from '@/components/wallet/WalletDetailModal'
import { WalletLedgerModal } from '@/components/wallet/WalletLedgerModal'
import { WalletData, WalletLedgerItem } from '@/types/wallet'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function AdminWalletsPage() {
  const [wallets, setWallets] = useState<WalletData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [limit] = useState(20)
  
  // Modal states
  const [selectedWallet, setSelectedWallet] = useState<WalletData | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showLedgerModal, setShowLedgerModal] = useState(false)
  const [ledgerData, setLedgerData] = useState<WalletLedgerItem[]>([])
  const [ledgerLoading, setLedgerLoading] = useState(false)

  // Dynamic title management using custom hook
  const { fullTitle, pageTitle, pageSubtitle } = usePageTitle({
    title: 'Manajemen Wallet',
    subtitle: `Kelola ${wallets.length} wallet tenant dalam sistem`,
    description: `Kelola ${wallets.length} wallet tenant dalam sistem. Platform manajemen wallet dengan monitoring saldo dan aktivitas yang komprehensif.`,
    keywords: 'wallet management, tenant wallet, balance monitoring, payout management, admin panel'
  })

  // Fetch wallets data
  const fetchWallets = async (page: number = 1) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/admin/wallets?page=${page}&limit=${limit}`)
      const data = await response.json()
      
      if (data.ok) {
        setWallets(data.items)
        setTotalItems(data.total)
        setTotalPages(Math.ceil(data.total / limit))
        setCurrentPage(page)
      } else {
        setError('Gagal memuat data wallet')
      }
    } catch (err) {
      setError('Terjadi kesalahan saat memuat data')
      console.error('Error fetching wallets:', err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch ledger data
  const fetchLedger = async (tenantId: string) => {
    try {
      setLedgerLoading(true)
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

  // Handle page change
  const handlePageChange = (page: number) => {
    fetchWallets(page)
  }

  // Handle wallet detail view
  const handleViewDetail = (wallet: WalletData) => {
    setSelectedWallet(wallet)
    setShowDetailModal(true)
  }

  // Handle ledger view
  const handleViewLedger = async (wallet: WalletData) => {
    setSelectedWallet(wallet)
    await fetchLedger(wallet.tenant_id)
    setShowLedgerModal(true)
  }

  // Close modals
  const closeDetailModal = () => {
    setShowDetailModal(false)
    setSelectedWallet(null)
  }

  const closeLedgerModal = () => {
    setShowLedgerModal(false)
    setSelectedWallet(null)
    setLedgerData([])
  }

  // Filter wallets based on search term
  const filteredWallets = wallets.filter(wallet =>
    wallet.tenant_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wallet.currency.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const paginatedWallets = filteredWallets.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  )

  // Initial load
  useEffect(() => {
    fetchWallets()
  }, [])

  // Columns definition for DataTable
  const columns: Column<WalletData>[] = [
    {
      key: 'tenant_id',
      header: 'INFORMASI TENANT',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="fw-semibold text-body">
            <code className="text-primary">{row.tenant_id}</code>
          </div>
          <div className="text-muted small">
            Currency: <span className="badge bg-label-primary">{row.currency}</span>
          </div>
        </div>
      )
    },
    {
      key: 'available_amount',
      header: 'SALDO TERSEDIA',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="text-success fw-semibold">
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: row.currency,
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(row.available_amount)}
          </div>
          <div className="text-muted small">Dana yang dapat ditarik</div>
        </div>
      )
    },
    {
      key: 'pending_amount',
      header: 'SALDO PENDING',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="text-warning fw-semibold">
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: row.currency,
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(row.pending_amount)}
          </div>
          <div className="text-muted small">Dana dalam proses settlement</div>
        </div>
      )
    },
    {
      key: 'total_balance',
      header: 'TOTAL SALDO',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="fw-bold text-primary">
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: row.currency,
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(row.available_amount + row.pending_amount)}
          </div>
          <div className="text-muted small">Total keseluruhan dana</div>
        </div>
      )
    },
    {
      key: 'updatedAt',
      header: 'TERAKHIR DIPERBARUI',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="text-body">
            {new Date(row.updatedAt).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
          <div className="text-muted small">Last updated</div>
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
            onClick={() => handleViewDetail(row)}
            title="Lihat Detail"
          >
            <i className="ti ti-eye"></i>
          </button>
          <button
            className="btn btn-sm btn-label-info"
            onClick={() => handleViewLedger(row)}
            title="Lihat Ledger"
          >
            <i className="ti ti-list"></i>
          </button>
        </div>
      )
    }
  ]

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
        <meta name="description" content={`${pageSubtitle}. Platform manajemen wallet dengan monitoring saldo dan aktivitas yang komprehensif.`} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={`${pageSubtitle}. Kelola wallet tenant, monitoring saldo, dan aktivitas dalam sistem.`} />
        <meta name="keywords" content="wallet management, tenant wallet, balance monitoring, payout management, admin panel" />
      </Head>

      <AuthGuard requireAuth={true}>
        <DashboardLayout>
          <div className="container-xxl flex-grow-1 container-p-y">
            {/* Page Header - Matching Dashboard Style */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h4 className="fw-bold mb-1 text-primary">
                  <i className="ti ti-wallet me-2"></i>
                  {pageTitle}
                </h4>
                <p className="text-muted mb-0">{pageSubtitle}</p>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-label-primary">
                  <i className="ti ti-download me-1"></i>
                  <span>Ekspor Data</span>
                </button>
                <button className="btn btn-primary">
                  <i className="ti ti-plus me-1"></i>
                  <span>Buat Wallet Baru</span>
                </button>
              </div>
            </div>

            {/* DataTable Card */}
            <div className="card">
              <div className="card-header">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="card-title mb-1 text-primary">Daftar Semua Wallet Tenant</h5>
                    <p className="text-muted mb-0">
                      {loading ? 'Memuat data...' : `${wallets.length || 0} wallet ditemukan`}
                    </p>
                  </div>
                  <div className="d-flex align-items-center gap-6">
                    <div className="flex-1" style={{ minWidth: '300px' }}>
                      <input
                        type="text"
                        placeholder="Cari berdasarkan tenant ID atau currency..."
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
                  data={paginatedWallets}
                  columns={columns}
                  loading={loading}
                  searchable={false}
                  filterable={false}
                  actions={false}
                  pagination={{
                    currentPage,
                    totalPages,
                    totalItems: filteredWallets.length,
                    itemsPerPage: limit,
                    onPageChange: handlePageChange
                  }}
                  className="border-0 shadow-none"
                />
              </div>
            </div>
          </div>

          {/* Wallet Detail Modal */}
          {showDetailModal && selectedWallet && (
            <WalletDetailModal
              wallet={selectedWallet}
              onClose={closeDetailModal}
              onViewLedger={() => {
                closeDetailModal()
                handleViewLedger(selectedWallet)
              }}
            />
          )}

          {/* Wallet Ledger Modal */}
          {showLedgerModal && selectedWallet && (
            <WalletLedgerModal
              wallet={selectedWallet}
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
