import React from 'react'
import { WalletData } from '@/types/wallet'

interface WalletListProps {
  wallets: WalletData[]
  loading: boolean
  onViewDetail: (wallet: WalletData) => void
  onViewLedger: (wallet: WalletData) => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function WalletList({
  wallets,
  loading,
  onViewDetail,
  onViewLedger,
  currentPage,
  totalPages,
  onPageChange
}: WalletListProps) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
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

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Memuat data wallet...</p>
      </div>
    )
  }

  if (wallets.length === 0) {
    return (
      <div className="text-center py-4">
        <i className="ti ti-wallet-off text-muted" style={{ fontSize: '3rem' }} />
        <p className="mt-2 text-muted">Tidak ada data wallet</p>
      </div>
    )
  }

  return (
    <div>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Tenant ID</th>
              <th>Currency</th>
              <th>Available Amount</th>
              <th>Pending Amount</th>
              <th>Total Balance</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {wallets.map((wallet) => (
              <tr key={wallet.tenant_id}>
                <td>
                  <code className="text-primary">{wallet.tenant_id}</code>
                </td>
                <td>
                  <span className="badge bg-label-primary">{wallet.currency}</span>
                </td>
                <td>
                  <span className="text-success fw-semibold">
                    {formatCurrency(wallet.available_amount, wallet.currency)}
                  </span>
                </td>
                <td>
                  <span className="text-warning fw-semibold">
                    {formatCurrency(wallet.pending_amount, wallet.currency)}
                  </span>
                </td>
                <td>
                  <span className="fw-bold">
                    {formatCurrency(wallet.available_amount + wallet.pending_amount, wallet.currency)}
                  </span>
                </td>
                <td>
                  <small className="text-muted">
                    {formatDate(wallet.updatedAt)}
                  </small>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => onViewDetail(wallet)}
                      title="Lihat Detail"
                    >
                      <i className="ti ti-eye me-1" />
                      Detail
                    </button>
                    <button
                      className="btn btn-sm btn-outline-info"
                      onClick={() => onViewLedger(wallet)}
                      title="Lihat Ledger"
                    >
                      <i className="ti ti-list me-1" />
                      Ledger
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav aria-label="Wallet pagination" className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <i className="ti ti-chevron-left" />
              </button>
            </li>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              </li>
            ))}
            
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <i className="ti ti-chevron-right" />
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  )
}
