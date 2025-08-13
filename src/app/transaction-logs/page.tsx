'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import AuthGuard from '@/components/auth/AuthGuard'
import { useAuth } from '@/contexts/AuthContext'

export default function TransactionLogsPage() {
  const { user } = useAuth()

  return (
    <AuthGuard requireAuth={true}>
      <DashboardLayout>
        <div className="container-xxl flex-grow-1 container-p-y">
          <h4 className="fw-bold py-3 mb-4">
            <span className="text-muted fw-light">Transaction Logs /</span> Log Transaksi
          </h4>

          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    <i className="ti ti-file-text me-2 text-primary"></i>
                    Log Transaksi
                  </h5>
                  <p className="card-subtitle text-muted mb-0">
                    Lihat transaksi masuk (dengan filter & status)
                  </p>
                </div>
                <div className="card-body">
                  {/* Filter Section */}
                  <div className="row mb-4">
                    <div className="col-md-3">
                      <label className="form-label">Status Transaksi</label>
                      <select className="form-select">
                        <option value="">Semua Status</option>
                        <option value="pending">Pending</option>
                        <option value="success">Success</option>
                        <option value="failed">Failed</option>
                        <option value="expired">Expired</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Metode Pembayaran</label>
                      <select className="form-select">
                        <option value="">Semua Metode</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="e_wallet">E-Wallet</option>
                        <option value="credit_card">Credit Card</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Tanggal Mulai</label>
                      <input type="date" className="form-control" />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Tanggal Akhir</label>
                      <input type="date" className="form-control" />
                    </div>
                  </div>

                  <div className="row mb-4">
                    <div className="col-md-6">
                      <div className="input-group">
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Cari berdasarkan Transaction ID, Order ID, atau Customer Name..."
                        />
                        <button className="btn btn-primary" type="button">
                          <i className="ti ti-search"></i>
                        </button>
                      </div>
                    </div>
                    <div className="col-md-6 text-end">
                      <button className="btn btn-outline-primary me-2">
                        <i className="ti ti-download me-2"></i>
                        Export Excel
                      </button>
                      <button className="btn btn-outline-success">
                        <i className="ti ti-refresh me-2"></i>
                        Refresh
                      </button>
                    </div>
                  </div>

                  {/* Statistics Cards */}
                  <div className="row mb-4">
                    <div className="col-md-3">
                      <div className="card border-primary">
                        <div className="card-body text-center">
                          <h4 className="text-primary mb-1">1,234</h4>
                          <p className="text-muted mb-0">Total Transaksi</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card border-success">
                        <div className="card-body text-center">
                          <h4 className="text-success mb-1">1,100</h4>
                          <p className="text-muted mb-0">Success</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card border-warning">
                        <div className="card-body text-center">
                          <h4 className="text-warning mb-1">89</h4>
                          <p className="text-muted mb-0">Pending</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card border-danger">
                        <div className="card-body text-center">
                          <h4 className="text-danger mb-1">45</h4>
                          <p className="text-muted mb-0">Failed</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Transaction Table */}
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Transaction ID</th>
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
                        <tr>
                          <td>
                            <span className="fw-bold text-primary">TRX-001</span>
                          </td>
                          <td>ORD-2024-001</td>
                          <td>John Doe</td>
                          <td>Rp 500.000</td>
                          <td>
                            <span className="badge bg-info">Bank Transfer</span>
                          </td>
                          <td>
                            <span className="badge bg-success">Success</span>
                          </td>
                          <td>2024-01-15 10:30:00</td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary me-1">
                              <i className="ti ti-eye"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-info">
                              <i className="ti ti-download"></i>
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span className="fw-bold text-primary">TRX-002</span>
                          </td>
                          <td>ORD-2024-002</td>
                          <td>Jane Smith</td>
                          <td>Rp 750.000</td>
                          <td>
                            <span className="badge bg-success">E-Wallet</span>
                          </td>
                          <td>
                            <span className="badge bg-warning">Pending</span>
                          </td>
                          <td>2024-01-15 11:15:00</td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary me-1">
                              <i className="ti ti-eye"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-info">
                              <i className="ti ti-download"></i>
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span className="fw-bold text-primary">TRX-003</span>
                          </td>
                          <td>ORD-2024-003</td>
                          <td>Bob Johnson</td>
                          <td>Rp 1.000.000</td>
                          <td>
                            <span className="badge bg-primary">Credit Card</span>
                          </td>
                          <td>
                            <span className="badge bg-danger">Failed</span>
                          </td>
                          <td>2024-01-15 12:00:00</td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary me-1">
                              <i className="ti ti-eye"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-info">
                              <i className="ti ti-download"></i>
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span className="fw-bold text-primary">TRX-004</span>
                          </td>
                          <td>ORD-2024-004</td>
                          <td>Alice Brown</td>
                          <td>Rp 250.000</td>
                          <td>
                            <span className="badge bg-info">Bank Transfer</span>
                          </td>
                          <td>
                            <span className="badge bg-secondary">Expired</span>
                          </td>
                          <td>2024-01-15 09:45:00</td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary me-1">
                              <i className="ti ti-eye"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-info">
                              <i className="ti ti-download"></i>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <div>
                      <p className="text-muted mb-0">
                        Menampilkan 1-10 dari 1,234 transaksi
                      </p>
                    </div>
                    <nav>
                      <ul className="pagination pagination-sm mb-0">
                        <li className="page-item disabled">
                          <a className="page-link" href="#" tabIndex={-1}>Previous</a>
                        </li>
                        <li className="page-item active">
                          <a className="page-link" href="#">1</a>
                        </li>
                        <li className="page-item">
                          <a className="page-link" href="#">2</a>
                        </li>
                        <li className="page-item">
                          <a className="page-link" href="#">3</a>
                        </li>
                        <li className="page-item">
                          <a className="page-link" href="#">Next</a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
} 