'use client'

import React from 'react'
import { useTransactionList } from '@/hooks/useTransactionList'

interface TransactionListProps {
  className?: string
}

export function TransactionList({ className = '' }: TransactionListProps) {
  const { transactions, loading, error, refreshTransactions } = useTransactionList()

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
        return <span className="badge bg-success">Selesai</span>
      case 'pending':
        return <span className="badge bg-warning">Pending</span>
      case 'failed':
      case 'error':
        return <span className="badge bg-danger">Gagal</span>
      default:
        return <span className="badge bg-secondary">{status || 'Unknown'}</span>
    }
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount || 0)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className={`card ${className}`}>
        <div className="card-body text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 mb-0">Memuat data transaksi...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`card ${className}`}>
        <div className="card-body text-center py-4">
          <i className="ti ti-alert-circle text-danger mb-2" style={{ fontSize: '2rem' }}></i>
          <h6 className="text-danger">Error</h6>
          <p className="text-muted">{error}</p>
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={refreshTransactions}
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`card ${className}`}>
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">
          <i className="ti ti-credit-card me-2"></i>
          Daftar Transaksi
        </h5>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={refreshTransactions}
          disabled={loading}
        >
          <i className={`ti ti-refresh ${loading ? 'ti-spin' : ''}`}></i>
          Refresh
        </button>
      </div>
      <div className="card-body">
        {transactions.length === 0 ? (
          <div className="text-center py-4">
            <i className="ti ti-credit-card-off text-muted mb-2" style={{ fontSize: '2rem' }}></i>
            <h6 className="text-muted">Tidak ada transaksi</h6>
            <p className="text-muted">Transaksi baru akan muncul di sini</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID Transaksi</th>
                  <th>Jumlah</th>
                  <th>Status</th>
                  <th>Tanggal Dibuat</th>
                  <th>Terakhir Diperbarui</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>
                      <code className="text-primary">{transaction.transaction_id || transaction.id}</code>
                    </td>
                    <td>
                      <span className="fw-semibold">{formatAmount(transaction.amount || 0)}</span>
                    </td>
                    <td>
                      {getStatusBadge(transaction.status || 'unknown')}
                    </td>
                    <td>
                      <small className="text-muted">
                        {transaction.created_at ? formatDate(transaction.created_at) : '-'}
                      </small>
                    </td>
                    <td>
                      <small className="text-muted">
                        {transaction.updated_at ? formatDate(transaction.updated_at) : '-'}
                      </small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
