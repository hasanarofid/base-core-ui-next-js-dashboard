'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import AuthGuard from '@/components/auth/AuthGuard'
import { useAuth } from '@/contexts/AuthContext'

export default function ApiCredentialsPage() {
  const { user } = useAuth()

  return (
    <AuthGuard requireAuth={true}>
      <DashboardLayout>
        <div className="container-xxl flex-grow-1 container-p-y">
          <h4 className="fw-bold py-3 mb-4">
            <span className="text-muted fw-light">API Credential /</span> Kredensial API
          </h4>

          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    <i className="ti ti-folder me-2 text-primary"></i>
                    Kredensial API
                  </h5>
                  <p className="card-subtitle text-muted mb-0">
                    Lihat client_id & client_key
                  </p>
                </div>
                <div className="card-body">
                  <div className="alert alert-warning" role="alert">
                    <h6 className="alert-heading">
                      <i className="ti ti-alert-triangle me-2"></i>
                      Peringatan Keamanan
                    </h6>
                    <p className="mb-0">
                      Jangan bagikan kredensial API ini kepada siapapun. Kredensial ini digunakan untuk autentikasi ke API payment gateway.
                    </p>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="card border-primary">
                        <div className="card-header bg-primary text-white">
                          <h6 className="card-title mb-0">
                            <i className="ti ti-key me-2"></i>
                            Client ID
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="input-group">
                            <input 
                              type="text" 
                              className="form-control" 
                              value="client_1234567890abcdef"
                              readOnly
                            />
                            <button className="btn btn-outline-primary" type="button">
                              <i className="ti ti-copy"></i>
                            </button>
                          </div>
                          <div className="form-text mt-2">
                            Client ID untuk autentikasi API
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="card border-success">
                        <div className="card-header bg-success text-white">
                          <h6 className="card-title mb-0">
                            <i className="ti ti-lock me-2"></i>
                            Client Secret
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="input-group">
                            <input 
                              type="password" 
                              className="form-control" 
                              value="secret_abcdef1234567890"
                              readOnly
                            />
                            <button className="btn btn-outline-success" type="button">
                              <i className="ti ti-eye"></i>
                            </button>
                            <button className="btn btn-outline-primary" type="button">
                              <i className="ti ti-copy"></i>
                            </button>
                          </div>
                          <div className="form-text mt-2">
                            Client Secret untuk autentikasi API
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row mt-4">
                    <div className="col-12">
                      <div className="card border-info">
                        <div className="card-header bg-info text-white">
                          <h6 className="card-title mb-0">
                            <i className="ti ti-link me-2"></i>
                            Endpoint API
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label">Base URL</label>
                                <input 
                                  type="url" 
                                  className="form-control" 
                                  value="https://api.payment-gateway.com/v1"
                                  readOnly
                                />
                                <div className="form-text">
                                  Base URL untuk semua endpoint API
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label">Environment</label>
                                <select className="form-select" disabled>
                                  <option value="production">Production</option>
                                  <option value="sandbox">Sandbox</option>
                                </select>
                                <div className="form-text">
                                  Environment yang sedang digunakan
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row mt-4">
                    <div className="col-12">
                      <div className="card border-warning">
                        <div className="card-header bg-warning text-white">
                          <h6 className="card-title mb-0">
                            <i className="ti ti-refresh me-2"></i>
                            Regenerate Credentials
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="alert alert-danger" role="alert">
                            <h6 className="alert-heading">
                              <i className="ti ti-alert-circle me-2"></i>
                              Perhatian!
                            </h6>
                            <p className="mb-0">
                              Regenerasi kredensial akan membuat kredensial lama tidak valid. 
                              Pastikan Anda telah memperbarui kredensial di semua sistem yang terintegrasi.
                            </p>
                          </div>
                          <div className="d-flex gap-2">
                            <button className="btn btn-warning">
                              <i className="ti ti-refresh me-2"></i>
                              Regenerate Client Secret
                            </button>
                            <button className="btn btn-danger">
                              <i className="ti ti-refresh me-2"></i>
                              Regenerate All Credentials
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h6 className="fw-bold mb-3">Riwayat Regenerasi</h6>
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead className="table-light">
                          <tr>
                            <th>Tanggal</th>
                            <th>Tipe</th>
                            <th>User</th>
                            <th>IP Address</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>2024-01-15 10:30:00</td>
                            <td>
                              <span className="badge bg-warning">Client Secret</span>
                            </td>
                            <td>admin@solusicodekata.com</td>
                            <td>192.168.1.100</td>
                            <td>
                              <span className="badge bg-success">Success</span>
                            </td>
                          </tr>
                          <tr>
                            <td>2024-01-10 14:20:00</td>
                            <td>
                              <span className="badge bg-danger">All Credentials</span>
                            </td>
                            <td>admin@solusicodekata.com</td>
                            <td>192.168.1.100</td>
                            <td>
                              <span className="badge bg-success">Success</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
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