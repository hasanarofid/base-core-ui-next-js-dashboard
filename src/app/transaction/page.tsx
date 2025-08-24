'use client'

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import DashboardLayout from '@/components/layout/DashboardLayout'
import SecureGuard from '@/components/auth/SecureGuard'
import { useAuth } from '@/contexts/AuthContext'
import { usePageTitle } from '@/hooks/usePageTitle';
import { useToast } from '@/contexts/ToastContext';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Interface untuk response API transactions
interface Transaction {
  id: string;
  transaction_code: string;
  reference_code: string;
  status: string;
  total_amount: string;
  amount: string;
  fee_amount: string;
  createdAt: string;
  updatedAt: string;
  tenantPaymentMethod: {
    id: string;
    fee_type: string;
    fee_value: number;
    paymentMethod: {
      id: string;
      code: string;
      type: string;
      logo_url: string;
    };
  };
  user: {
    id: string;
    email: string;
  };
  tenant: {
    id: string;
    name: string;
  };
}

// Interface untuk detail transaction (dengan logs)
interface TransactionDetail extends Transaction {
  logs: Array<{
    id: string;
    action: string;
    message: string;
    status: string;
    metadata: {
      isStatic?: boolean;
      expiredAt?: string;
      qrContent?: string | null;
      contractId?: string;
      terminalId?: string | null;
      description?: string;
      customer_name?: string;
      partnerReferenceNo?: string;
      gateway_response_code?: string;
      gateway_response_message?: string;
      paidAt?: string;
      paidAmount?: string;
      referenceCode?: string;
    };
    created_at: string;
  }>;
}

interface TransactionResponse {
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    transactions: Transaction[];
  };
}

// Schema untuk form add transaction
const addTransactionSchema = z.object({
  tenant_payment_method_id: z.string().min(1, 'Payment method harus dipilih'),
  amount: z.number().min(1000, 'Amount minimal Rp 1.000'),
  description: z.string().optional(),
  customer_name: z.string().min(1, 'Customer name harus diisi'),
});

type AddTransactionForm = z.infer<typeof addTransactionSchema>;

export default function TransactionPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingTable, setLoadingTable] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionDetail | null>(null)
  const [tenantId, setTenantId] = useState<string | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [loadingAdd, setLoadingAdd] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState<{id: string, payment_method_id: string, fee_type: string, fee_value: number, status: string, paymentMethod?: {code: string, type: string}}[]>([])
  const [userData, setUserData] = useState<{fullName: string, email: string} | null>(null)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  // Form hook untuk add transaction
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<AddTransactionForm>({
    resolver: zodResolver(addTransactionSchema),
    defaultValues: {
      tenant_payment_method_id: '',
      amount: 50000,
      description: '',
      customer_name: ''
    }
  });

  // Dynamic title management using custom hook
  const { fullTitle, pageTitle, pageSubtitle } = usePageTitle({
    title: 'Transaction',
    subtitle: 'Kelola dan monitor transaksi pembayaran',
    description: 'Kelola dan monitor transaksi pembayaran dalam sistem.',
    keywords: 'transaction, payment monitoring, transaction management, payment history'
  });

  // Fetch user data to get tenant ID (for tenant_admin role)
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
          setUserData(data.user)
          console.log('✅ Tenant ID set:', data.user.tenantId)
          console.log('✅ User data set:', data.user)
          
          // Fetch transactions and payment methods after getting tenant ID
          await Promise.all([
            fetchTransactions(data.user.tenantId, currentPage, itemsPerPage),
            fetchPaymentMethods(data.user.tenantId)
          ])
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

  // Effect untuk memantau perubahan filter dan search
  useEffect(() => {
    if (tenantId && !loading) {
      fetchTransactions(tenantId, currentPage, itemsPerPage)
    }
  }, [currentPage, itemsPerPage, searchTerm, statusFilter, dateFilter])

  // Fetch transactions data from API
  const fetchTransactions = async (tenantId: string, page: number = 1, limit: number = 10) => {
    try {
      setLoadingTable(true)
      console.log('🔍 Fetching transactions for tenant:', tenantId, 'page:', page, 'limit:', limit)
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      })
      
      if (searchTerm) {
        params.append('search', searchTerm)
      }
      
      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }
      
      if (dateFilter !== 'all') {
        params.append('date', dateFilter)
      }
      
      const response = await fetch(`/api/tenants/${tenantId}/transactions?${params.toString()}`, {
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error('Gagal mengambil data transaksi')
      }
      
      const data: TransactionResponse = await response.json()
      console.log('📦 Transactions data received:', data)
      
      if (data.data) {
        setTransactions(data.data.transactions)
        setTotalItems(data.data.total)
        setTotalPages(Math.ceil(data.data.total / limit))
        setCurrentPage(data.data.page)
        console.log('✅ Transactions data set successfully')
      }
    } catch (error) {
      console.error('❌ Error fetching transactions:', error)
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Gagal mengambil data transaksi'
      })
    } finally {
      setLoadingTable(false)
    }
  }

  // Fetch payment methods for the form (using payment channel endpoint)
  const fetchPaymentMethods = async (tenantId: string) => {
    try {
      console.log('🔍 Fetching payment methods for tenant:', tenantId)
      
      const response = await fetch(`/api/tenants/${tenantId}/payment-methods`, {
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error('Gagal mengambil data payment methods')
      }
      
      const data = await response.json()
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

  // Handle add transaction
  const handleAddTransaction = () => {
    // Set customer name from logged-in user
    if (userData) {
      reset({
        tenant_payment_method_id: '',
        amount: 50000,
        description: '',
        customer_name: userData.fullName || userData.email || ''
      })
    }
    setShowAddModal(true)
  }

  // Handle submit add transaction form
  const onSubmitAddTransaction = async (data: AddTransactionForm) => {
    if (!tenantId) return

    try {
      setLoadingAdd(true)
      console.log('🔄 Creating new transaction...')
      
      const payload = {
        tenant_payment_method_id: data.tenant_payment_method_id,
        amount: data.amount,
        meta_json: {
          description: data.description || '',
          customer_name: data.customer_name
        }
      }

      console.log('📦 Transaction payload:', payload)

      const response = await fetch(`/api/tenants/${tenantId}/qris-generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error('Gagal membuat transaksi')
      }

      const result = await response.json()
      console.log('✅ Transaction created successfully:', result)

      // Show success message
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Transaksi berhasil dibuat',
        confirmButtonText: 'OK',
        confirmButtonColor: '#696cff',
        timer: 3000,
        timerProgressBar: true
      })

      // Close modal and reset form
      setShowAddModal(false)
      reset()
      
      // Refresh transactions list
      await fetchTransactions(tenantId, currentPage, itemsPerPage)

      // Show toast notification
      showToast({
        type: 'success',
        title: 'Berhasil',
        message: 'Transaksi berhasil dibuat'
      })
    } catch (error) {
      console.error('❌ Error creating transaction:', error)
      
      await Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error instanceof Error ? error.message : 'Gagal membuat transaksi',
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc3545'
      })
      
      showToast({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Gagal membuat transaksi'
      })
    } finally {
      setLoadingAdd(false)
    }
  }

  // Handle view transaction detail
  const handleViewDetail = async (transaction: Transaction) => {
    try {
      setLoadingDetail(true)
      console.log('🔍 Fetching transaction detail for ID:', transaction.id)
      
      const response = await fetch(`/api/transactions/${transaction.id}`, {
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error('Gagal mengambil detail transaksi')
      }
      
      const data = await response.json()
      console.log('📦 Transaction detail received:', data)
      
      if (data.data) {
        setSelectedTransaction(data.data)
        setShowDetailModal(true)
      } else {
        throw new Error('Data transaksi tidak ditemukan')
      }
    } catch (error) {
      console.error('❌ Error fetching transaction detail:', error)
      showToast({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Gagal mengambil detail transaksi'
      })
    } finally {
      setLoadingDetail(false)
    }
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    if (tenantId) {
      fetchTransactions(tenantId, page, itemsPerPage)
    }
  }

  // Handle items per page change
  const handleItemsPerPageChange = (limit: number) => {
    setItemsPerPage(limit)
    setCurrentPage(1)
    if (tenantId) {
      fetchTransactions(tenantId, 1, limit)
    }
  }

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1)
  }

  // Handle filter changes
  const handleFilterChange = () => {
    setCurrentPage(1)
  }

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setDateFilter('all')
    setCurrentPage(1)
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return <span className="badge bg-label-success">Berhasil</span>
      case 'pending':
        return <span className="badge bg-label-warning">Menunggu</span>
      case 'failed':
        return <span className="badge bg-label-danger">Gagal</span>
      case 'expired':
        return <span className="badge bg-label-info">Kadaluarsa</span>
      case 'cancelled':
        return <span className="badge bg-label-secondary">Dibatalkan</span>
      default:
        return <span className="badge bg-label-secondary">{status}</span>
    }
  }

  const formatCurrency = (amount: string) => {
    const numAmount = parseFloat(amount)
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(numAmount)
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
        <meta name="description" content={`${pageSubtitle}. Kelola dan monitor transaksi pembayaran dalam sistem.`} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={`${pageSubtitle}. Kelola transaksi pembayaran.`} />
        <meta name="keywords" content="transaction, payment monitoring, transaction management, payment history" />
      </Head>
      
      <SecureGuard requireAuth={true}>
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
                <button className="btn btn-label-primary">
                  <i className="ti ti-download me-1"></i>
                  <span>Export</span>
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleAddTransaction}
                >
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
                          {formatCurrency(transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0).toString())}
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
                          {transactions.length > 0 ? Math.round((transactions.filter(t => t.status === 'paid').length / transactions.length) * 100) : 0}%
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
                          {formatCurrency(transactions.reduce((sum, t) => sum + parseFloat(t.fee_amount), 0).toString())}
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

            {/* Tabel Transaksi */}
            <div className="card">
              <div className="card-header">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">Daftar Transaksi</h5>
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-sm btn-outline-secondary"
                      onClick={clearFilters}
                      disabled={loadingTable}
                    >
                      {loadingTable ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                          Clearing...
                        </>
                      ) : (
                        <>
                          <i className="ti ti-refresh me-1"></i>
                          Clear Filters
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Search and Filter Section */}
              <div className={`card-body border-bottom ${loadingTable ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="ti ti-search"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search transaction code, reference code, or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        disabled={loadingTable}
                      />
                      <button 
                        className="btn btn-primary"
                        onClick={handleSearch}
                        disabled={loadingTable}
                      >
                        {loadingTable ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                            Searching...
                          </>
                        ) : (
                          'Search'
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <select
                      className="form-select"
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value)
                        handleFilterChange()
                      }}
                      disabled={loadingTable}
                    >
                      <option value="all">All Status</option>
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <select
                      className="form-select"
                      value={dateFilter}
                      onChange={(e) => {
                        setDateFilter(e.target.value)
                        handleFilterChange()
                      }}
                      disabled={loadingTable}
                    >
                      <option value="all">All Dates</option>
                      <option value="today">Today</option>
                      <option value="yesterday">Yesterday</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                    </select>
                  </div>
                  <div className="col-md-2">
                    <select
                      className="form-select"
                      value={itemsPerPage}
                      onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                      disabled={loadingTable}
                    >
                      <option value={5}>5 per page</option>
                      <option value={10}>10 per page</option>
                      <option value={20}>20 per page</option>
                      <option value={50}>50 per page</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="card-body">
                {loadingTable ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted mt-3">Memuat data transaksi...</p>
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-4">
                    <i className="ti ti-receipt text-muted" style={{ fontSize: '3rem' }}></i>
                    <p className="text-muted mt-3">Belum ada transaksi</p>
                  </div>
                ) : (
                  <>
                    <div className="table-responsive">
                      <table className={`table table-striped table-hover ${loadingTable ? 'opacity-50 pointer-events-none' : ''}`}>
                        <thead>
                          <tr>
                            <th>Transaction Code</th>
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
                            <tr key={transaction.id} className={loadingTable ? 'opacity-50 pointer-events-none' : ''}>
                              <td>
                                <span className="fw-semibold">{transaction.transaction_code}</span>
                                <br />
                                <small className="text-muted">{transaction.reference_code}</small>
                              </td>
                              <td>
                                <div>
                                  <h6 className="mb-1">{transaction.user.email}</h6>
                                  <small className="text-muted">User ID: {transaction.user.id.substring(0, 8)}...</small>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <h6 className="mb-1">{formatCurrency(transaction.amount)}</h6>
                                  <small className="text-muted">Fee: {formatCurrency(transaction.fee_amount)}</small>
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  {transaction.tenantPaymentMethod?.paymentMethod?.logo_url && (
                                    <img 
                                      src={transaction.tenantPaymentMethod.paymentMethod.logo_url} 
                                      alt={transaction.tenantPaymentMethod.paymentMethod.code}
                                      style={{ width: '24px', height: '24px', marginRight: '8px' }}
                                    />
                                  )}
                                  <div>
                                    <div className="fw-semibold">{transaction.tenantPaymentMethod?.paymentMethod?.code || 'N/A'}</div>
                                    <small className="text-muted">{transaction.tenantPaymentMethod?.paymentMethod?.type || 'N/A'}</small>
                                  </div>
                                </div>
                              </td>
                              <td>{getStatusBadge(transaction.status)}</td>
                              <td>
                                <span className="text-muted">{formatDate(transaction.createdAt)}</span>
                              </td>
                              <td>
                                                               <button 
                                 className="btn btn-sm btn-outline-primary"
                                 onClick={() => handleViewDetail(transaction)}
                                 disabled={loadingDetail || loadingTable}
                               >
                                  {loadingDetail ? (
                                    <>
                                      <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                                      Loading...
                                    </>
                                  ) : (
                                    <>
                                      <i className="ti ti-eye me-1"></i>
                                      Detail
                                    </>
                                  )}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className={`d-flex justify-content-between align-items-center mt-4 ${loadingTable ? 'opacity-50 pointer-events-none' : ''}`}>
                        <div className="text-muted">
                          {loadingTable ? (
                            <span className="d-flex align-items-center">
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Loading...
                            </span>
                          ) : (
                            `Showing ${((currentPage - 1) * itemsPerPage) + 1} to ${Math.min(currentPage * itemsPerPage, totalItems)} of ${totalItems} entries`
                          )}
                        </div>
                        <nav aria-label="Transaction pagination" className={loadingTable ? 'opacity-50 pointer-events-none' : ''}>
                          <ul className="pagination pagination-sm mb-0">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                              <button 
                                className="page-link"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1 || loadingTable}
                              >
                                <i className="ti ti-chevron-left"></i>
                              </button>
                            </li>
                            
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                              let pageNum
                              if (totalPages <= 5) {
                                pageNum = i + 1
                              } else if (currentPage <= 3) {
                                pageNum = i + 1
                              } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i
                              } else {
                                pageNum = currentPage - 2 + i
                              }
                              
                              return (
                                <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                                  <button 
                                    className="page-link"
                                    onClick={() => handlePageChange(pageNum)}
                                    disabled={loadingTable}
                                  >
                                    {pageNum}
                                  </button>
                                </li>
                              )
                            })}
                            
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                              <button 
                                className="page-link"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages || loadingTable}
                              >
                                <i className="ti ti-chevron-right"></i>
                              </button>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Modal Detail Transaksi */}
          {showDetailModal && selectedTransaction && (
            <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Detail Transaksi</h5>
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => {
                        setShowDetailModal(false)
                        setSelectedTransaction(null)
                      }}
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-md-6">
                        <h6 className="mb-3">Informasi Transaksi</h6>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-muted">Transaction Code</span>
                          <span className="fw-semibold">{selectedTransaction.transaction_code}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-muted">Reference Code</span>
                          <span className="fw-semibold">{selectedTransaction.reference_code}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-muted">Status</span>
                          {getStatusBadge(selectedTransaction.status)}
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-muted">Amount</span>
                          <span className="fw-semibold">{formatCurrency(selectedTransaction.amount)}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-muted">Fee Amount</span>
                          <span className="fw-semibold">{formatCurrency(selectedTransaction.fee_amount)}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-muted">Total Amount</span>
                          <span className="fw-semibold">{formatCurrency(selectedTransaction.total_amount)}</span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <h6 className="mb-3">Informasi Customer</h6>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-muted">Customer Email</span>
                          <span className="fw-semibold">{selectedTransaction.user.email || 'N/A'}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-muted">Email</span>
                          <span className="fw-semibold">{selectedTransaction.user.email}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-muted">Payment Method</span>
                          <span className="fw-semibold">{selectedTransaction.tenantPaymentMethod?.paymentMethod?.code || 'N/A'}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-muted">Payment Method Type</span>
                          <span className="fw-semibold">{selectedTransaction.tenantPaymentMethod?.paymentMethod?.type || 'N/A'}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-muted">Created At</span>
                          <span className="fw-semibold">{formatDate(selectedTransaction.createdAt)}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-muted">Updated At</span>
                          <span className="fw-semibold">{formatDate(selectedTransaction.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Transaction Logs */}
                    {selectedTransaction.logs && selectedTransaction.logs.length > 0 && (
                      <div className="mt-4">
                        <h6 className="mb-3">Riwayat Transaksi</h6>
                        <div className="position-relative">
                          {selectedTransaction.logs.map((log, index) => (
                            <div key={log.id} className="d-flex mb-3">
                              <div className="flex-shrink-0 me-3">
                                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px'}}>
                                  <i className="ti ti-clock text-white" style={{fontSize: '14px'}}></i>
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <div className="d-flex justify-content-between align-items-start mb-1">
                                  <h6 className="mb-0">{log.message}</h6>
                                  <small className="text-muted">{formatDate(log.created_at)}</small>
                                </div>
                                <p className="text-muted mb-1">Status: {getStatusBadge(log.status)}</p>
                                {log.metadata?.description && (
                                  <p className="text-muted mb-1">Deskripsi: {log.metadata.description}</p>
                                )}
                                {log.metadata?.customer_name && (
                                  <p className="text-muted mb-1">Customer: {log.metadata.customer_name}</p>
                                )}
                                {log.metadata?.gateway_response_message && (
                                  <p className="text-muted mb-0">Response: {log.metadata.gateway_response_message}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={() => {
                        setShowDetailModal(false)
                        setSelectedTransaction(null)
                      }}
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Add Transaction */}
          {showAddModal && (
            <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Buat Transaksi Baru</h5>
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => {
                        setShowAddModal(false)
                        reset()
                      }}
                      aria-label="Close"
                    ></button>
                  </div>
                  <form onSubmit={handleSubmit(onSubmitAddTransaction)}>
                    <div className="modal-body">
                      <div className="row g-3">
                        <div className="col-12">
                          <div className="form-group">
                            <label className="form-label">
                              Payment Method <span className="text-danger">*</span>
                            </label>
                            <select
                              className={`form-select ${errors.tenant_payment_method_id ? 'is-invalid' : ''}`}
                              {...register('tenant_payment_method_id')}
                            >
                              <option value="">Pilih Payment Method</option>
                              {paymentMethods.map((method) => (
                                <option key={method.id} value={method.id}>
                                  Payment Method ID: {method.payment_method_id.substring(0, 8)}... - Fee: {method.fee_value}{method.fee_type === 'percent' ? '%' : ' Rp'} ({method.status})
                                </option>
                              ))}
                            </select>
                            {errors.tenant_payment_method_id && (
                              <div className="invalid-feedback">{errors.tenant_payment_method_id.message}</div>
                            )}
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="form-group">
                            <label className="form-label">
                              Amount (Rp) <span className="text-danger">*</span>
                            </label>
                            <input
                              type="number"
                              className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                              placeholder="50000"
                              {...register('amount', { valueAsNumber: true })}
                            />
                            {errors.amount && (
                              <div className="invalid-feedback">{errors.amount.message}</div>
                            )}
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="form-group">
                            <label className="form-label">
                              Description
                            </label>
                            <input
                              type="text"
                              className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                              placeholder="Masukkan deskripsi transaksi (opsional)"
                              {...register('description')}
                            />
                            {errors.description && (
                              <div className="invalid-feedback">{errors.description.message}</div>
                            )}
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="form-group">
                            <label className="form-label">
                              Customer Name <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control ${errors.customer_name ? 'is-invalid' : ''}`}
                              placeholder="Nama customer"
                              {...register('customer_name')}
                            />
                            {errors.customer_name && (
                              <div className="invalid-feedback">{errors.customer_name.message}</div>
                            )}
                            <div className="form-text">Nama customer akan diisi otomatis dari data user login</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={() => {
                          setShowAddModal(false)
                          reset()
                        }}
                        disabled={loadingAdd}
                      >
                        Batal
                      </button>
                      <button 
                        type="submit" 
                        className="btn btn-primary" 
                        disabled={loadingAdd}
                      >
                        {loadingAdd ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Membuat Transaksi...
                          </>
                        ) : (
                          <>
                            <i className="ti ti-plus me-1"></i>
                            Buat Transaksi
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </DashboardLayout>
      </SecureGuard>
    </>
  )
} 