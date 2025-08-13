'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import AuthGuard from '@/components/auth/AuthGuard'
import { useAuth } from '@/contexts/AuthContext'

export default function NotificationsPage() {
  const { user } = useAuth()

  return (
    <AuthGuard requireAuth={true}>
      <DashboardLayout>
        <div className="container-xxl flex-grow-1 container-p-y">
          <h4 className="fw-bold py-3 mb-4">
            <span className="text-muted fw-light">Notifikasi /</span> Riwayat Notifikasi
          </h4>

          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    <i className="ti ti-bell me-2 text-primary"></i>
                    Riwayat Notifikasi
                  </h5>
                  <p className="card-subtitle text-muted mb-0">
                    Riwayat callback, notifikasi yang gagal
                  </p>
                </div>
                <div className="card-body">
                  {/* Filter Section */}
                  <div className="row mb-4">
                    <div className="col-md-3">
                      <label className="form-label">Status Notifikasi</label>
                      <select className="form-select">
                        <option value="">Semua Status</option>
                        <option value="sent">Sent</option>
                        <option value="delivered">Delivered</option>
                        <option value="failed">Failed</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Tipe Notifikasi</label>
                      <select className="form-select">
                        <option value="">Semua Tipe</option>
                        <option value="callback">Callback</option>
                        <option value="email">Email</option>
                        <option value="sms">SMS</option>
                        <option value="webhook">Webhook</option>
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
                          placeholder="Cari berdasarkan Transaction ID atau URL..."
                        />
                        <button className="btn btn-primary" type="button">
                          <i className="ti ti-search"></i>
                        </button>
                      </div>
                    </div>
                    <div className="col-md-6 text-end">
                      <button className="btn btn-outline-warning me-2">
                        <i className="ti ti-refresh me-2"></i>
                        Retry Failed
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
                          <h4 className="text-primary mb-1">2,456</h4>
                          <p className="text-muted mb-0">Total Notifikasi</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card border-success">
                        <div className="card-body text-center">
                          <h4 className="text-success mb-1">2,200</h4>
                          <p className="text-muted mb-0">Delivered</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card border-warning">
                        <div className="card-body text-center">
                          <h4 className="text-warning mb-1">156</h4>
                          <p className="text-muted mb-0">Pending</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="card border-danger">
                        <div className="card-body text-center">
                          <h4 className="text-danger mb-1">100</h4>
                          <p className="text-muted mb-0">Failed</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notifications Table */}
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Transaction ID</th>
                          <th>Tipe</th>
                          <th>URL/Target</th>
                          <th>Status</th>
                          <th>Response</th>
                          <th>Retry Count</th>
                          <th>Created At</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <span className="fw-bold text-primary">TRX-001</span>
                          </td>
                          <td>
                            <span className="badge bg-info">Callback</span>
                          </td>
                          <td>
                            <small className="text-muted">https://solusicodekata.com/callback</small>
                          </td>
                          <td>
                            <span className="badge bg-success">Delivered</span>
                          </td>
                          <td>
                            <span className="text-success">200 OK</span>
                          </td>
                          <td>1</td>
                          <td>2024-01-15 10:30:00</td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary me-1">
                              <i className="ti ti-eye"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-info">
                              <i className="ti ti-refresh"></i>
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span className="fw-bold text-primary">TRX-002</span>
                          </td>
                          <td>
                            <span className="badge bg-primary">Webhook</span>
                          </td>
                          <td>
                            <small className="text-muted">https://api.merchant.com/webhook</small>
                          </td>
                          <td>
                            <span className="badge bg-warning">Pending</span>
                          </td>
                          <td>
                            <span className="text-warning">-</span>
                          </td>
                          <td>0</td>
                          <td>2024-01-15 11:15:00</td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary me-1">
                              <i className="ti ti-eye"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-info">
                              <i className="ti ti-refresh"></i>
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span className="fw-bold text-primary">TRX-003</span>
                          </td>
                          <td>
                            <span className="badge bg-info">Callback</span>
                          </td>
                          <td>
                            <small className="text-muted">https://solusicodekata.com/callback</small>
                          </td>
                          <td>
                            <span className="badge bg-danger">Failed</span>
                          </td>
                          <td>
                            <span className="text-danger">500 Error</span>
                          </td>
                          <td>3/3</td>
                          <td>2024-01-15 12:00:00</td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary me-1">
                              <i className="ti ti-eye"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-warning">
                              <i className="ti ti-refresh"></i>
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span className="fw-bold text-primary">TRX-004</span>
                          </td>
                          <td>
                            <span className="badge bg-success">Email</span>
                          </td>
                          <td>
                            <small className="text-muted">customer@example.com</small>
                          </td>
                          <td>
                            <span className="badge bg-success">Delivered</span>
                          </td>
                          <td>
                            <span className="text-success">250 OK</span>
                          </td>
                          <td>1</td>
                          <td>2024-01-15 09:45:00</td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary me-1">
                              <i className="ti ti-eye"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-info">
                              <i className="ti ti-refresh"></i>
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
                        Menampilkan 1-10 dari 2,456 notifikasi
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