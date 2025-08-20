'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import DashboardLayout from '@/components/layout/DashboardLayout'
import AuthGuard from '@/components/auth/AuthGuard'
import { DataTable, Column } from '@/components/ui/DataTable';
import { Transaction, TransactionFilters } from '@/types/transaction';
import Badge from '@/components/ui/Badge';
import { getTransactionsWithCookies } from '@/lib/api';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useSweetAlert } from '@/lib/sweetalert-config';

/**
 * Transaction Monitoring Page
 * 
 * Fitur yang tersedia:
 * 1. Monitoring semua transaksi dalam sistem
 * 2. Filter berdasarkan status, payment method, tenant, dll
 * 3. Pencarian berdasarkan transaction code, reference code
 * 4. Pagination untuk data yang besar
 * 5. Detail transaksi
 * 
 * API Methods:
 * - GET /api/transactions - Get all transactions with filters
 * - GET /api/transactions/[id] - Get transaction detail
 */

export default function TransactionMonitoringPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<TransactionFilters>({});
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 20;

  // Hook untuk SweetAlert dengan tema dinamis (unused for now)
  // const sweetAlert = useSweetAlert();

  // Dynamic title management using custom hook
  const { fullTitle, pageTitle, pageSubtitle } = usePageTitle({
    title: 'Monitoring Transaksi',
    subtitle: `Monitor ${totalItems} transaksi dalam sistem`,
    description: `Monitor ${totalItems} transaksi dalam sistem. Fitur lengkap untuk monitoring transaksi, status, dan aktivitas pembayaran.`,
    keywords: 'transaction monitoring, payment tracking, transaction status, payment activity'
  });

  // Fetch transactions data function
  const fetchTransactions = useCallback(async (page: number = 1, searchFilters?: TransactionFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      const currentFilters = {
        ...filters,
        ...searchFilters,
        page: page.toString(),
        limit: itemsPerPage.toString()
      };
      
      console.log('🔍 Fetching transactions with filters:', currentFilters);
      const response = await getTransactionsWithCookies(currentFilters);
      console.log('🔍 Full API Response:', JSON.stringify(response, null, 2));
      
      if (response && response.data) {
        setTransactions(response.data.transactions || []);
        setTotalItems(response.data.total || 0);
        setTotalPages(Math.ceil((response.data.total || 0) / itemsPerPage));
        setCurrentPage(response.data.page || 1);
      } else {
        setTransactions([]);
        setTotalItems(0);
        setTotalPages(0);
      }
      
    } catch (err) {
      console.error('❌ Error fetching transactions:', err);
      setError('Gagal mengambil data transaksi. Silakan coba lagi.');
      setTransactions([]);
      setTotalItems(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [filters, itemsPerPage]);

  // Fetch transactions data
  useEffect(() => {
    fetchTransactions(1, filters);
  }, [filters, fetchTransactions]);

  // Handle search
  const handleSearch = () => {
    const searchFilters: TransactionFilters = {};
    
    if (searchTerm) {
      // Check if search term looks like transaction code or reference code
      if (searchTerm.includes('-')) {
        searchFilters.transaction_code = searchTerm;
      } else {
        searchFilters.reference_code = searchTerm;
      }
    }
    
    setFilters(prev => ({ ...prev, ...searchFilters }));
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof TransactionFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const handleView = (transaction: Transaction) => {
    router.push(`/transaction-monitoring/${transaction.id}`);
  };

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

  const formatDate = (dateString: unknown) => {
    return new Date(String(dateString)).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const columns: Column<Transaction>[] = [
    {
      key: 'transaction_code',
      header: 'INFORMASI TRANSAKSI',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="fw-semibold text-body">
            {row.transaction_code}
          </div>
          <div className="text-muted small">
            Ref: {row.reference_code}
          </div>
        </div>
      )
    },
    {
      key: 'tenant',
      header: 'TENANT & USER',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="mb-1">
            <span className="text-body fw-medium">{row.tenant.name}</span>
            <div className="text-muted small">Tenant</div>
          </div>
          <div>
            <span className="text-body">{row.user.email}</span>
            <div className="text-muted small">User</div>
          </div>
        </div>
      )
    },
    {
      key: 'amount',
      header: 'NILAI TRANSAKSI',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="mb-1">
            <span className="text-body fw-semibold">{formatCurrency(row.total_amount)}</span>
            <div className="text-muted small">Total (termasuk fee)</div>
          </div>
          <div>
            <span className="text-body">{formatCurrency(row.amount)}</span>
            <div className="text-muted small">Nilai + {formatCurrency(row.fee_amount)} fee</div>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'STATUS TRANSAKSI',
      sortable: true,
      render: (value) => (
        <div>
          <Badge 
            variant={getStatusBadgeVariant(value)}
            className="badge"
          >
            {getStatusText(value)}
          </Badge>
        </div>
      )
    },
    {
      key: 'paymentMethod',
      header: 'METODE PEMBAYARAN',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="d-flex align-items-center">
            {row.tenantPaymentMethod.paymentMethod.logo_url && (
              <img 
                src={row.tenantPaymentMethod.paymentMethod.logo_url} 
                alt={row.tenantPaymentMethod.paymentMethod.name}
                className="me-2"
                style={{ width: '24px', height: '24px', objectFit: 'contain' }}
              />
            )}
            <div>
              <div className="text-body fw-medium">
                {row.tenantPaymentMethod.paymentMethod.name}
              </div>
              <div className="text-muted small">
                {row.tenantPaymentMethod.paymentMethod.type} - {row.tenantPaymentMethod.paymentMethod.code}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'createdAt',
      header: 'TANGGAL TRANSAKSI',
      sortable: true,
      render: (value) => (
        <div>
          <span className="text-body fw-medium">
            {formatDate(value)}
          </span>
          <div className="text-muted small">
            Dibuat
          </div>
        </div>
      )
    }
  ];

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
    );
  }

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={`${pageSubtitle}. Fitur lengkap untuk monitoring transaksi, status, dan aktivitas pembayaran.`} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={`${pageSubtitle}. Platform monitoring transaksi dengan fitur lengkap.`} />
        <meta name="keywords" content="transaction monitoring, payment tracking, transaction status, payment activity" />
      </Head>
      
      <AuthGuard requireAuth={true}>
        <DashboardLayout>
          <div className="container-xxl flex-grow-1 container-p-y">
            {/* Page Header - Matching Dashboard Style */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h4 className="fw-bold mb-1 text-primary">
                  <i className="ti ti-chart-line me-2"></i>
                  {pageTitle}
                </h4>
                <p className="text-muted mb-0">{pageSubtitle}</p>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-label-primary">
                  <i className="ti ti-download me-1"></i>
                  <span>Ekspor Data</span>
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => fetchTransactions(1, filters)}
                >
                  <i className="ti ti-refresh me-1"></i>
                  <span>Refresh Data</span>
                </button>
              </div>
            </div>

            {/* Filter Card */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title mb-1 text-primary">Filter Transaksi</h5>
                <p className="text-muted mb-0">Filter dan cari transaksi berdasarkan kriteria tertentu</p>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-3">
                    <label className="form-label">Status</label>
                    <select 
                      className="form-select"
                      value={filters.status || ''}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                      <option value="">Semua Status</option>
                      <option value="pending">Menunggu</option>
                      <option value="paid">Dibayar</option>
                      <option value="failed">Gagal</option>
                      <option value="expired">Kadaluarsa</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Tipe Payment Method</label>
                    <select 
                      className="form-select"
                      value={filters.payment_method_type || ''}
                      onChange={(e) => handleFilterChange('payment_method_type', e.target.value)}
                    >
                      <option value="">Semua Tipe</option>
                      <option value="VA">Virtual Account</option>
                      <option value="QRIS">QRIS</option>
                      <option value="EWALLET">E-Wallet</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Tanggal Mulai</label>
                    <input 
                      type="date" 
                      className="form-control"
                      value={filters.start_date || ''}
                      onChange={(e) => handleFilterChange('start_date', e.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Tanggal Akhir</label>
                    <input 
                      type="date" 
                      className="form-control"
                      value={filters.end_date || ''}
                      onChange={(e) => handleFilterChange('end_date', e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Cari Transaction/Reference Code</label>
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Masukkan transaction code atau reference code..."
                        className="form-control"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      />
                      <button 
                        className="btn btn-primary" 
                        type="button"
                        onClick={handleSearch}
                      >
                        <i className="ti ti-search"></i>
                      </button>
                    </div>
                  </div>
                  <div className="col-md-6 d-flex align-items-end">
                    <button 
                      className="btn btn-outline-secondary me-2"
                      onClick={clearFilters}
                    >
                      <i className="ti ti-x me-1"></i>
                      Clear Filter
                    </button>
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleSearch()}
                    >
                      <i className="ti ti-filter me-1"></i>
                      Terapkan Filter
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* DataTable Card */}
            <div className="card">
              <div className="card-header">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="card-title mb-1 text-primary">Daftar Semua Transaksi</h5>
                    <p className="text-muted mb-0">
                      {loading ? 'Memuat data...' : `${totalItems} transaksi ditemukan`}
                    </p>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-muted small">
                      Halaman {currentPage} dari {totalPages}
                    </span>
                  </div>
                </div>
              </div>
              <div className="card-body p-0">
                <DataTable
                  data={transactions}
                  columns={columns}
                  loading={loading}
                  searchable={false}
                  filterable={false}
                  onView={handleView}
                  pagination={{
                    currentPage,
                    totalPages,
                    totalItems,
                    itemsPerPage,
                    onPageChange: (page) => fetchTransactions(page, filters)
                  }}
                  className="border-0 shadow-none"
                />
              </div>
            </div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    </>
  )
} 