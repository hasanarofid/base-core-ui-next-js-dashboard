import React from 'react'
import { WalletData } from '@/types/wallet'

interface WalletDetailModalProps {
  wallet: WalletData
  onClose: () => void
  onViewLedger: () => void
}

export function WalletDetailModal({
  wallet,
  onClose,
  onViewLedger
}: WalletDetailModalProps) {
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
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const totalBalance = wallet.available_amount + wallet.pending_amount

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="ti ti-wallet me-2 text-primary" />
              Detail Wallet Tenant
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            />
          </div>
          
          <div className="modal-body">
            <div className="row mb-4">
              <div className="col-12">
                <div className="alert alert-info">
                  <i className="ti ti-info-circle me-2" />
                  <strong>Tenant ID:</strong> <code className="text-primary">{wallet.tenant_id}</code>
                </div>
              </div>
            </div>

            {/* Balance Cards */}
            <div className="row mb-4">
              <div className="col-md-4">
                <div className="card border-success">
                  <div className="card-body text-center">
                    <div className="d-flex align-items-center justify-content-center mb-2">
                      <i className="ti ti-wallet text-success" style={{ fontSize: '2rem' }} />
                    </div>
                    <h4 className="text-success mb-1">
                      {formatCurrency(wallet.available_amount, wallet.currency)}
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
                      {formatCurrency(wallet.pending_amount, wallet.currency)}
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
                      {formatCurrency(totalBalance, wallet.currency)}
                    </h4>
                    <p className="text-muted mb-0">Total Balance</p>
                    <small className="text-muted">Total keseluruhan dana</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h6 className="card-title mb-0">Informasi Tambahan</h6>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label fw-semibold">Currency</label>
                          <div>
                            <span className="badge bg-label-primary fs-6">{wallet.currency}</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label fw-semibold">Last Updated</label>
                          <div>
                            <span className="text-muted">{formatDate(wallet.updatedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-info"
              onClick={onViewLedger}
            >
              <i className="ti ti-list me-2" />
              Lihat Ledger
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
