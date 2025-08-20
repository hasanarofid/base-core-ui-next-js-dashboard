'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Head from 'next/head';
import DashboardLayout from '@/components/layout/DashboardLayout'
import AuthGuard from '@/components/auth/AuthGuard'
import { Transaction } from '@/types/transaction';
import Badge from '@/components/ui/Badge';
import { getTransactionByIdWithCookies } from '@/lib/api';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useSweetAlert } from '@/lib/sweetalert-config';

/**
 * Transaction Detail Page
 * 
 * Fitur yang tersedia:
 * 1. Detail lengkap transaksi
 * 2. Informasi tenant dan user
 * 3. Informasi payment method
 * 4. Status dan timeline transaksi
 */

export default function TransactionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hook untuk SweetAlert dengan tema dinamis (unused for now)
  // const sweetAlert = useSweetAlert();

  // Dynamic title management using custom hook
  const { fullTitle, pageTitle, pageSubtitle } = usePageTitle({
    title: 'Detail Transaksi',
    subtitle: transaction ? `Transaksi ${transaction.transaction_code}` : 'Memuat detail transaksi...',
    description: transaction ? `Detail lengkap transaksi ${transaction.transaction_code}. Informasi tenant, user, payment method, dan status transaksi.` : 'Halaman detail transaksi.',
    keywords: 'transaction detail, payment information, transaction status, payment method'
  });

  // Fetch transaction detail
  const fetchTransactionDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const transactionId = params.id as string;
      const response = await getTransactionByIdWithCookies(transactionId);
      
      if (response && response.data) {
        setTransaction(response.data);
      } else {
        throw new Error('Data transaksi tidak ditemukan');
      }
      
    } catch (err) {
      console.error('❌ Error fetching transaction detail:', err);
      setError('Gagal mengambil detail transaksi. Silakan coba lagi.');
      setTransaction(null);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      fetchTransactionDetail();
    }
  }, [params.id, fetchTransactionDetail]);

  const getStatusBadgeVariant = (status: unknown) => {
    const statusStr = String(status);
    switch (statusStr) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'danger';
      case 'expired': return 'info';
      default: return 'default';
    }
  };

  const getStatusText = (status: unknown) => {
    const statusStr = String(status);
    switch (statusStr) {
      case 'paid': return 'Dibayar';
      case 'pending': return 'Menunggu';
      case 'failed': return 'Gagal';
      case 'expired': return 'Kadaluarsa';
      default: return statusStr;
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(parseFloat(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (error) {
    return (
      <AuthGuard requireAuth={true}>
        <DashboardLayout>
          <div className="container-xxl flex-grow-1 container-p-y">
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Error!</h4>
              <p>{error}</p>
              <button 
                className="btn btn-outline-danger me-2"
                onClick={() => window.location.reload()}
              >
                Coba Lagi
              </button>
              <button 
                className="btn btn-outline-secondary"
                onClick={() => router.push('/transaction-monitoring')}
              >
                Kembali ke Daftar
              </button>
            </div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  if (loading) {
    return (
      <AuthGuard requireAuth={true}>
        <DashboardLayout>
          <div className="container-xxl flex-grow-1 container-p-y">
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  if (!transaction) {
    return (
      <AuthGuard requireAuth={true}>
        <DashboardLayout>
          <div className="container-xxl flex-grow-1 container-p-y">
            <div className="alert alert-warning" role="alert">
              <h4 className="alert-heading">Transaksi Tidak Ditemukan!</h4>
              <p>Transaksi yang Anda cari tidak ditemukan atau telah dihapus.</p>
              <button 
                className="btn btn-outline-secondary"
                onClick={() => router.push('/transaction-monitoring')}
              >
                Kembali ke Daftar
              </button>
            </div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={`${pageSubtitle}. Informasi lengkap transaksi, tenant, user, dan payment method.`} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={`${pageSubtitle}. Detail lengkap transaksi dengan informasi komprehensif.`} />
        <meta name="keywords" content="transaction detail, payment information, transaction status, payment method" />
      </Head>
      
      <AuthGuard requireAuth={true}>
        <DashboardLayout>
          <div className="container-xxl flex-grow-1 container-p-y">
            {/* Page Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h4 className="fw-bold mb-1 text-primary">
                  <i className="ti ti-receipt me-2"></i>
                  {pageTitle}
                </h4>
                <p className="text-muted mb-0">{pageSubtitle}</p>
              </div>
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => router.push('/transaction-monitoring')}
                >
                  <i className="ti ti-arrow-left me-1"></i>
                  <span>Kembali ke Daftar</span>
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => fetchTransactionDetail()}
                >
                  <i className="ti ti-refresh me-1"></i>
                  <span>Refresh Data</span>
                </button>
              </div>
            </div>

            <div className="row">
              {/* Main Transaction Info */}
              <div className="col-lg-8">
                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="card-title mb-1 text-primary">Informasi Transaksi</h5>
                    <p className="text-muted mb-0">Detail lengkap transaksi pembayaran</p>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Transaction Code</label>
                        <p className="form-control-plaintext">{transaction.transaction_code}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Reference Code</label>
                        <p className="form-control-plaintext">{transaction.reference_code}</p>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Status Transaksi</label>
                        <div>
                          <Badge 
                            variant={getStatusBadgeVariant(transaction.status)}
                            className="badge"
                          >
                            {getStatusText(transaction.status)}
                          </Badge>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Tanggal Dibuat</label>
                        <p className="form-control-plaintext">{formatDate(transaction.createdAt)}</p>
                      </div>
                                             <div className="col-md-6">
                         <label className="form-label fw-semibold">Tanggal Diupdate</label>
                         <p className="form-control-plaintext">{formatDate(transaction.updatedAt)}</p>
                       </div>
                       {transaction.logs && transaction.logs[0]?.metadata && (
                         <>
                           {transaction.logs[0].metadata.description && (
                             <div className="col-md-12">
                               <label className="form-label fw-semibold">Deskripsi Transaksi</label>
                               <p className="form-control-plaintext">{transaction.logs[0].metadata.description}</p>
                             </div>
                           )}
                           {transaction.logs[0].metadata.customer_name && (
                             <div className="col-md-6">
                               <label className="form-label fw-semibold">Nama Customer</label>
                               <p className="form-control-plaintext">{transaction.logs[0].metadata.customer_name}</p>
                             </div>
                           )}
                           {transaction.logs[0].metadata.expiredAt && (
                             <div className="col-md-6">
                               <label className="form-label fw-semibold">Expired At</label>
                               <p className="form-control-plaintext">{formatDateTime(transaction.logs[0].metadata.expiredAt)}</p>
                             </div>
                           )}
                         </>
                       )}
                    </div>
                  </div>
                </div>

                {/* Amount Information */}
                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="card-title mb-1 text-primary">Informasi Nilai</h5>
                    <p className="text-muted mb-0">Rincian nilai transaksi dan biaya</p>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Total Amount</label>
                        <p className="form-control-plaintext fs-5 fw-bold text-success">
                          {formatCurrency(transaction.total_amount)}
                        </p>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Nilai Transaksi</label>
                        <p className="form-control-plaintext fs-6">
                          {formatCurrency(transaction.amount)}
                        </p>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Biaya (Fee)</label>
                        <p className="form-control-plaintext fs-6 text-muted">
                          {formatCurrency(transaction.fee_amount)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method Information */}
                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="card-title mb-1 text-primary">Metode Pembayaran</h5>
                    <p className="text-muted mb-0">Informasi payment method yang digunakan</p>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Payment Method</label>
                        <div className="d-flex align-items-center">
                          {transaction.tenantPaymentMethod.paymentMethod.logo_url && (
                            <img 
                              src={transaction.tenantPaymentMethod.paymentMethod.logo_url} 
                              alt={transaction.tenantPaymentMethod.paymentMethod.name}
                              className="me-3"
                              style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                            />
                          )}
                          <div>
                            <p className="form-control-plaintext fw-semibold mb-0">
                              {transaction.tenantPaymentMethod.paymentMethod.name}
                            </p>
                            <p className="form-control-plaintext text-muted small mb-0">
                              {transaction.tenantPaymentMethod.paymentMethod.type} - {transaction.tenantPaymentMethod.paymentMethod.code}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Tipe Fee</label>
                        <p className="form-control-plaintext">
                          {transaction.tenantPaymentMethod.fee_type === 'flat' ? 'Flat' : 'Percentage'}
                        </p>
                      </div>
                                             <div className="col-md-6">
                         <label className="form-label fw-semibold">Nilai Fee</label>
                         <p className="form-control-plaintext">
                           {transaction.tenantPaymentMethod.fee_value}
                           {transaction.tenantPaymentMethod.fee_type === 'percentage' ? '%' : ''}
                         </p>
                       </div>
                       {transaction.logs && transaction.logs[0]?.metadata && (
                         <>
                           {transaction.logs[0].metadata.gateway_response_code && (
                             <div className="col-md-6">
                               <label className="form-label fw-semibold">Gateway Response Code</label>
                               <p className="form-control-plaintext">
                                 <Badge 
                                   variant={transaction.logs[0].metadata.gateway_response_code === '2004700' ? 'success' : 'warning'}
                                   className="badge"
                                 >
                                   {transaction.logs[0].metadata.gateway_response_code}
                                 </Badge>
                               </p>
                             </div>
                           )}
                           {transaction.logs[0].metadata.gateway_response_message && (
                             <div className="col-md-6">
                               <label className="form-label fw-semibold">Gateway Response Message</label>
                               <p className="form-control-plaintext">{transaction.logs[0].metadata.gateway_response_message}</p>
                             </div>
                           )}
                         </>
                       )}
                    </div>
                  </div>
                </div>

                {/* Transaction Logs */}
                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="card-title mb-1 text-primary">Log Aktivitas Transaksi</h5>
                    <p className="text-muted mb-0">Riwayat aktivitas dan perubahan status transaksi</p>
                  </div>
                  <div className="card-body">
                    {transaction.logs && transaction.logs.length > 0 ? (
                      <div className="timeline">
                        {transaction.logs.map((log) => (
                          <div key={log.id} className="timeline-item">
                            <div className={`timeline-marker bg-${getStatusBadgeVariant(log.status)}`}></div>
                            <div className="timeline-content">
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <h6 className="mb-1 text-capitalize">{log.action}</h6>
                                  <p className="text-muted small mb-1">{log.message}</p>
                                  {log.metadata && (
                                    <div className="mt-2">
                                      {log.metadata.description && (
                                        <p className="text-muted small mb-1">
                                          <strong>Deskripsi:</strong> {log.metadata.description}
                                        </p>
                                      )}
                                      {log.metadata.customer_name && (
                                        <p className="text-muted small mb-1">
                                          <strong>Customer:</strong> {log.metadata.customer_name}
                                        </p>
                                      )}
                                      {log.metadata.partnerReferenceNo && (
                                        <p className="text-muted small mb-1">
                                          <strong>Reference:</strong> {log.metadata.partnerReferenceNo}
                                        </p>
                                      )}
                                      {log.metadata.gateway_response_code && (
                                        <p className="text-muted small mb-1">
                                          <strong>Gateway Code:</strong> {log.metadata.gateway_response_code}
                                        </p>
                                      )}
                                      {log.metadata.gateway_response_message && (
                                        <p className="text-muted small mb-1">
                                          <strong>Gateway Message:</strong> {log.metadata.gateway_response_message}
                                        </p>
                                      )}
                                      {log.metadata.expiredAt && (
                                        <p className="text-muted small mb-1">
                                          <strong>Expired At:</strong> {formatDateTime(log.metadata.expiredAt)}
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <Badge 
                                  variant={getStatusBadgeVariant(log.status)}
                                  className="badge"
                                >
                                  {getStatusText(log.status)}
                                </Badge>
                              </div>
                              <p className="text-muted small mb-0 mt-2">
                                {formatDateTime(log.created_at)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <i className="ti ti-file-text text-muted" style={{ fontSize: '3rem' }}></i>
                        <p className="text-muted mt-2">Tidak ada log aktivitas</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar Information */}
              <div className="col-lg-4">
                {/* Tenant Information */}
                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="card-title mb-1 text-primary">Informasi Tenant</h5>
                    <p className="text-muted mb-0">Data tenant yang melakukan transaksi</p>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Nama Tenant</label>
                      <p className="form-control-plaintext">{transaction.tenant.name}</p>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Tenant ID</label>
                      <p className="form-control-plaintext text-muted small">{transaction.tenant.id}</p>
                    </div>
                  </div>
                </div>

                {/* User Information */}
                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="card-title mb-1 text-primary">Informasi User</h5>
                    <p className="text-muted mb-0">Data user yang melakukan transaksi</p>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Nama Lengkap</label>
                      <p className="form-control-plaintext fw-medium">{transaction.user.full_name || 'Tidak tersedia'}</p>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Email User</label>
                      <p className="form-control-plaintext">{transaction.user.email}</p>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">User ID</label>
                      <p className="form-control-plaintext text-muted small">{transaction.user.id}</p>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                {transaction.logs && transaction.logs[0]?.metadata && (
                  <div className="card mb-4">
                    <div className="card-header">
                      <h5 className="card-title mb-1 text-primary">Informasi Tambahan</h5>
                      <p className="text-muted mb-0">Data tambahan transaksi</p>
                    </div>
                    <div className="card-body">
                      {transaction.logs[0].metadata.contractId && (
                        <div className="mb-3">
                          <label className="form-label fw-semibold">Contract ID</label>
                          <p className="form-control-plaintext text-muted small">{transaction.logs[0].metadata.contractId}</p>
                        </div>
                      )}
                      {transaction.logs[0].metadata.partnerReferenceNo && (
                        <div className="mb-3">
                          <label className="form-label fw-semibold">Partner Reference</label>
                          <p className="form-control-plaintext text-muted small">{transaction.logs[0].metadata.partnerReferenceNo}</p>
                        </div>
                      )}
                      {transaction.logs[0].metadata.terminalId && (
                        <div className="mb-3">
                          <label className="form-label fw-semibold">Terminal ID</label>
                          <p className="form-control-plaintext text-muted small">{transaction.logs[0].metadata.terminalId}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Transaction Timeline */}
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-1 text-primary">Timeline Transaksi</h5>
                    <p className="text-muted mb-0">Riwayat status transaksi</p>
                  </div>
                  <div className="card-body">
                    <div className="timeline">
                      <div className="timeline-item">
                        <div className="timeline-marker bg-primary"></div>
                        <div className="timeline-content">
                          <h6 className="mb-1">Transaksi Dibuat</h6>
                          <p className="text-muted small mb-0">{formatDate(transaction.createdAt)}</p>
                        </div>
                      </div>
                      {transaction.logs && transaction.logs.length > 0 ? (
                        transaction.logs.map((log) => (
                          <div key={log.id} className="timeline-item">
                            <div className={`timeline-marker bg-${getStatusBadgeVariant(log.status)}`}></div>
                            <div className="timeline-content">
                              <h6 className="mb-1 text-capitalize">{log.action}</h6>
                              <p className="text-muted small mb-0">{log.message}</p>
                              <p className="text-muted small mb-0">{formatDateTime(log.created_at)}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="timeline-item">
                          <div className={`timeline-marker bg-${getStatusBadgeVariant(transaction.status)}`}></div>
                          <div className="timeline-content">
                            <h6 className="mb-1">Status: {getStatusText(transaction.status)}</h6>
                            <p className="text-muted small mb-0">{formatDate(transaction.updatedAt)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    </>
  )
} 