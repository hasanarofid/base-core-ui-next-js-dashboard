'use client'

import React from 'react';
import Head from 'next/head';
import DashboardLayout from '@/components/layout/DashboardLayout'
import SecureGuard from '@/components/auth/SecureGuard'
import { useAuth } from '@/contexts/AuthContext'
import { usePageTitle } from '@/hooks/usePageTitle';

export default function TransactionPage() {
  const { user } = useAuth()

  // Data transaksi dummy
  const transactions = [
    {
      id: 'TXN001',
      orderId: 'ORD-2024-001',
      amount: 150000,
      status: 'SUCCESS',
      paymentMethod: 'Bank Transfer',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      createdAt: '2024-01-15 10:30:00',
      updatedAt: '2024-01-15 10:32:00',
      fee: 4500,
      netAmount: 145500,
      bankCode: 'BCA',
      referenceNumber: 'REF123456789'
    },
    {
      id: 'TXN002',
      orderId: 'ORD-2024-002',
      amount: 75000,
      status: 'PENDING',
      paymentMethod: 'E-Wallet',
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      createdAt: '2024-01-15 11:15:00',
      updatedAt: '2024-01-15 11:15:00',
      fee: 2000,
      netAmount: 73000,
      provider: 'GoPay',
      referenceNumber: 'REF987654321'
    },
    {
      id: 'TXN003',
      orderId: 'ORD-2024-003',
      amount: 250000,
      status: 'FAILED',
      paymentMethod: 'Virtual Account',
      customerName: 'Bob Johnson',
      customerEmail: 'bob@example.com',
      createdAt: '2024-01-15 12:00:00',
      updatedAt: '2024-01-15 12:05:00',
      fee: 3000,
      netAmount: 247000,
      bankCode: 'BNI',
      referenceNumber: 'REF456789123',
      failureReason: 'Insufficient funds'
    },
    {
      id: 'TXN004',
      orderId: 'ORD-2024-004',
      amount: 50000,
      status: 'SUCCESS',
      paymentMethod: 'QRIS',
      customerName: 'Alice Brown',
      customerEmail: 'alice@example.com',
      createdAt: '2024-01-15 13:45:00',
      updatedAt: '2024-01-15 13:46:00',
      fee: 1000,
      netAmount: 49000,
      provider: 'OVO',
      referenceNumber: 'REF789123456'
    },
    {
      id: 'TXN005',
      orderId: 'ORD-2024-005',
      amount: 300000,
      status: 'EXPIRED',
      paymentMethod: 'Bank Transfer',
      customerName: 'Charlie Wilson',
      customerEmail: 'charlie@example.com',
      createdAt: '2024-01-15 14:20:00',
      updatedAt: '2024-01-15 15:20:00',
      fee: 4500,
      netAmount: 295500,
      bankCode: 'BRI',
      referenceNumber: 'REF321654987'
    }
  ]

  // Dynamic title management using custom hook
  const { fullTitle, pageTitle, pageSubtitle } = usePageTitle({
    title: 'Transaction',
    subtitle: 'Kelola dan monitor transaksi pembayaran',
    description: 'Kelola dan monitor transaksi pembayaran dalam sistem.',
    keywords: 'transaction, payment monitoring, transaction management, payment history'
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <span className="badge bg-label-success">Berhasil</span>
      case 'PENDING':
        return <span className="badge bg-label-warning">Menunggu</span>
      case 'FAILED':
        return <span className="badge bg-label-danger">Gagal</span>
      case 'EXPIRED':
        return <span className="badge bg-label-info">Kadaluarsa</span>
      default:
        return <span className="badge bg-label-secondary">{status}</span>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={`${pageSubtitle}. Kelola dan monitor transaksi pembayaran dalam sistem.`} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={`${pageSubtitle}. Kelola transaksi pembayaran.`} />
        <meta name="keywords" content="transaction, payment monitoring, transaction management, payment history" />
      </Head>
      
      <SecureGuard requireAuth={true}>
        <DashboardLayout>
          <div className="container-xxl flex-grow-1 container-p-y">
            {/* Page Header - Matching Dashboard Style */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h4 className="fw-bold mb-1 text-primary">
                  <i className="ti ti-receipt me-2"></i>
                  {pageTitle}
                </h4>
                <p className="text-muted mb-0">{pageSubtitle}</p>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-label-primary">
                  <i className="ti ti-download me-1"></i>
                  <span>Export</span>
                </button>
                <button className="btn btn-primary">
                  <i className="ti ti-plus me-1"></i>
                  <span>Buat Transaksi</span>
                </button>
              </div>
            </div>

            {/* Statistik */}
            <div className="row mb-4">
              <div className="col-lg-3 col-md-6 mb-3">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <p className="text-muted mb-1">Total Transaksi</p>
                        <h4 className="fw-bold mb-0">{transactions.length}</h4>
                      </div>
                      <div className="avatar">
                        <div className="avatar-initial rounded bg-label-primary">
                          <i className="ti ti-receipt"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 mb-3">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <p className="text-muted mb-1">Total Volume</p>
                        <h4 className="fw-bold mb-0 text-success">
                          {formatCurrency(transactions.reduce((sum, t) => sum + t.amount, 0))}
                        </h4>
                      </div>
                      <div className="avatar">
                        <div className="avatar-initial rounded bg-label-success">
                          <i className="ti ti-chart-bar"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 mb-3">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <p className="text-muted mb-1">Success Rate</p>
                        <h4 className="fw-bold mb-0 text-info">
                          {Math.round((transactions.filter(t => t.status === 'SUCCESS').length / transactions.length) * 100)}%
                        </h4>
                      </div>
                      <div className="avatar">
                        <div className="avatar-initial rounded bg-label-info">
                          <i className="ti ti-check"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 mb-3">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <p className="text-muted mb-1">Total Fee</p>
                        <h4 className="fw-bold mb-0 text-warning">
                          {formatCurrency(transactions.reduce((sum, t) => sum + t.fee, 0))}
                        </h4>
                      </div>
                      <div className="avatar">
                        <div className="avatar-initial rounded bg-label-warning">
                          <i className="ti ti-coins"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter dan Pencarian */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Status</label>
                    <select className="form-select">
                      <option value="">Semua Status</option>
                      <option value="SUCCESS">Berhasil</option>
                      <option value="PENDING">Menunggu</option>
                      <option value="FAILED">Gagal</option>
                      <option value="EXPIRED">Kadaluarsa</option>
                    </select>
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Payment Method</label>
                    <select className="form-select">
                      <option value="">Semua Method</option>
                      <option value="BANK_TRANSFER">Bank Transfer</option>
                      <option value="E_WALLET">E-Wallet</option>
                      <option value="VIRTUAL_ACCOUNT">Virtual Account</option>
                      <option value="QRIS">QRIS</option>
                    </select>
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Tanggal Mulai</label>
                    <input type="date" className="form-control" />
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label">Tanggal Akhir</label>
                    <input type="date" className="form-control" />
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-primary">
                    <i className="ti ti-filter me-1"></i>
                    Filter
                  </button>
                  <button className="btn btn-outline-secondary">
                    <i className="ti ti-refresh me-1"></i>
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Tabel Transaksi */}
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Daftar Transaksi</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>ID Transaksi</th>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Payment Method</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td>
                            <span className="fw-semibold">{transaction.id}</span>
                          </td>
                          <td>
                            <span className="fw-semibold">{transaction.orderId}</span>
                          </td>
                          <td>
                            <div>
                              <h6 className="mb-1">{transaction.customerName}</h6>
                              <small className="text-muted">{transaction.customerEmail}</small>
                            </div>
                          </td>
                          <td>
                            <div>
                              <h6 className="mb-1">{formatCurrency(transaction.amount)}</h6>
                              <small className="text-muted">Fee: {formatCurrency(transaction.fee)}</small>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <i className={`ti ${
                                transaction.paymentMethod === 'Bank Transfer' ? 'ti-building-bank' :
                                transaction.paymentMethod === 'E-Wallet' ? 'ti-device-mobile' :
                                transaction.paymentMethod === 'Virtual Account' ? 'ti-credit-card' :
                                'ti-qrcode'
                              } text-primary me-2`}></i>
                              <span>{transaction.paymentMethod}</span>
                            </div>
                          </td>
                          <td>{getStatusBadge(transaction.status)}</td>
                          <td>
                            <span className="text-muted">{formatDate(transaction.createdAt)}</span>
                          </td>
                          <td>
                            <div className="dropdown">
                              <button className="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                                <i className="ti ti-dots-vertical"></i>
                              </button>
                              <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="#"><i className="ti ti-eye me-2"></i>Detail</a></li>
                                <li><a className="dropdown-item" href="#"><i className="ti ti-bell me-2"></i>Resend Notification</a></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><a className="dropdown-item text-danger" href="#"><i className="ti ti-rotate me-2"></i>Refund</a></li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center">
              <p className="text-muted mb-0">
                Menampilkan 1-{transactions.length} dari {transactions.length} transaksi
              </p>
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-outline-secondary" disabled>
                  <i className="ti ti-chevron-left me-1"></i>
                  Previous
                </button>
                <button className="btn btn-sm btn-outline-secondary">
                  Next
                  <i className="ti ti-chevron-right ms-1"></i>
                </button>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </SecureGuard>
    </>
  )
} 