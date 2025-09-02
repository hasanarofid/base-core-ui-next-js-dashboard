import React from 'react'
import { WalletData, WalletLedgerItem, getEventTypeLabel, getEventTypeColor } from '@/types/wallet'

interface WalletLedgerModalProps {
  wallet: WalletData
  ledgerData: WalletLedgerItem[]
  loading: boolean
  onClose: () => void
}

export function WalletLedgerModal({
  wallet,
  ledgerData,
  loading,
  onClose
}: WalletLedgerModalProps) {
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

  const getDeltaIcon = (delta: number) => {
    if (delta > 0) return <i className="ti ti-arrow-up text-success" />
    if (delta < 0) return <i className="ti ti-arrow-down text-danger" />
    return <i className="ti ti-minus text-muted" />
  }

  const getDeltaClass = (delta: number) => {
    if (delta > 0) return 'text-success'
    if (delta < 0) return 'text-danger'
    return 'text-muted'
  }

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="ti ti-list me-2 text-info" />
              Ledger Aktivitas Wallet
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            />
          </div>
          
          <div className="modal-body">
            {/* Wallet Info Header */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="alert alert-info">
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <strong>Tenant ID:</strong> <code className="text-primary">{wallet.tenant_id}</code>
                    </div>
                    <div className="col-md-3">
                      <strong>Currency:</strong> <span className="badge bg-label-primary">{wallet.currency}</span>
                    </div>
                    <div className="col-md-3">
                      <strong>Total Balance:</strong> <span className="fw-bold">{formatCurrency(wallet.available_amount + wallet.pending_amount, wallet.currency)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ledger Table */}
            <div className="card">
              <div className="card-header">
                <h6 className="card-title mb-0">Riwayat Aktivitas</h6>
              </div>
              <div className="card-body">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Memuat data ledger...</p>
                  </div>
                ) : ledgerData.length === 0 ? (
                  <div className="text-center py-4">
                    <i className="ti ti-list-off text-muted" style={{ fontSize: '3rem' }} />
                    <p className="mt-2 text-muted">Tidak ada aktivitas wallet</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Event Type</th>
                          <th>Description</th>
                          <th>Available Change</th>
                          <th>Pending Change</th>
                          <th>Amount</th>
                          <th>Available Before</th>
                          <th>Available After</th>
                          <th>Pending Before</th>
                          <th>Pending After</th>
                          <th>Transaction ID</th>
                          <th>Payout ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ledgerData.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <span className={`badge bg-${getEventTypeColor(item.event_type)}`}>
                                {getEventTypeLabel(item.event_type)}
                              </span>
                            </td>
                            <td>
                              <small className="text-muted">{item.description}</small>
                            </td>
                            <td>
                              <span className={`d-flex align-items-center ${getDeltaClass(item.delta_available)}`}>
                                {getDeltaIcon(item.delta_available)}
                                <span className="ms-1">
                                  {formatCurrency(Math.abs(item.delta_available), item.currency)}
                                </span>
                              </span>
                            </td>
                            <td>
                              <span className={`d-flex align-items-center ${getDeltaClass(item.delta_pending)}`}>
                                {getDeltaIcon(item.delta_pending)}
                                <span className="ms-1">
                                  {formatCurrency(Math.abs(item.delta_pending), item.currency)}
                                </span>
                              </span>
                            </td>
                            <td>
                              <span className="fw-semibold">
                                {formatCurrency(item.amount_abs, item.currency)}
                              </span>
                            </td>
                            <td>
                              <small className="text-muted">
                                {formatCurrency(item.available_before, item.currency)}
                              </small>
                            </td>
                            <td>
                              <small className="text-muted">
                                {formatCurrency(item.available_after, item.currency)}
                              </small>
                            </td>
                            <td>
                              <small className="text-muted">
                                {formatCurrency(item.pending_before, item.currency)}
                              </small>
                            </td>
                            <td>
                              <small className="text-muted">
                                {formatCurrency(item.pending_after, item.currency)}
                              </small>
                            </td>
                            <td>
                              {item.transaction_id ? (
                                <code className="text-primary" style={{ fontSize: '0.75rem' }}>
                                  {item.transaction_id.substring(0, 8)}...
                                </code>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            <td>
                              {item.payout_id ? (
                                <code className="text-warning" style={{ fontSize: '0.75rem' }}>
                                  {item.payout_id.substring(0, 8)}...
                                </code>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
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
