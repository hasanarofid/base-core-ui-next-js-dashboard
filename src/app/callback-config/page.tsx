'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import AuthGuard from '@/components/auth/AuthGuard'
import { useAuth } from '@/contexts/AuthContext'

export default function CallbackConfigPage() {
  const { user } = useAuth()

  return (
    <AuthGuard requireAuth={true}>
      <DashboardLayout>
        <div className="container-xxl flex-grow-1 container-p-y">
          <h4 className="fw-bold py-3 mb-4">
            <span className="text-muted fw-light">Callback Config /</span> Konfigurasi Callback
          </h4>

          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    <i className="ti ti-refresh me-2 text-primary"></i>
                    Konfigurasi Callback URL
                  </h5>
                  <p className="card-subtitle text-muted mb-0">
                    Atur URL callback, retry, sign method
                  </p>
                </div>
                <div className="card-body">
                  <div className="alert alert-info" role="alert">
                    <h6 className="alert-heading">
                      <i className="ti ti-info-circle me-2"></i>
                      Informasi Callback
                    </h6>
                    <p className="mb-0">
                      Konfigurasi callback untuk notifikasi status transaksi ke sistem merchant.
                      Pastikan URL callback dapat diakses dan menerima POST request.
                    </p>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="card border-primary">
                        <div className="card-header bg-primary text-white">
                          <h6 className="card-title mb-0">
                            <i className="ti ti-link me-2"></i>
                            Callback URL
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="mb-3">
                            <label className="form-label">URL Callback</label>
                            <input 
                              type="url" 
                              className="form-control" 
                              placeholder="https://your-domain.com/callback"
                              defaultValue="https://solusicodekata.com/callback"
                            />
                            <div className="form-text">
                              URL yang akan menerima notifikasi status transaksi
                            </div>
                          </div>
                          <div className="d-grid">
                            <button className="btn btn-outline-primary">
                              <i className="ti ti-check me-2"></i>
                              Test Callback URL
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="card border-success">
                        <div className="card-header bg-success text-white">
                          <h6 className="card-title mb-0">
                            <i className="ti ti-settings me-2"></i>
                            Konfigurasi Retry
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="mb-3">
                            <label className="form-label">Jumlah Retry</label>
                            <input 
                              type="number" 
                              className="form-control" 
                              placeholder="3"
                              defaultValue="3"
                              min="1"
                              max="10"
                            />
                            <div className="form-text">
                              Jumlah percobaan pengiriman callback jika gagal
                            </div>
                          </div>
                          <div className="mb-3">
                            <label className="form-label">Interval Retry (detik)</label>
                            <input 
                              type="number" 
                              className="form-control" 
                              placeholder="30"
                              defaultValue="30"
                              min="5"
                              max="300"
                            />
                            <div className="form-text">
                              Interval waktu antara percobaan retry
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
                            <i className="ti ti-shield me-2"></i>
                            Sign Method
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label">Metode Sign</label>
                                <select className="form-select">
                                  <option value="hmac-sha256">HMAC-SHA256</option>
                                  <option value="hmac-sha512">HMAC-SHA512</option>
                                  <option value="md5">MD5</option>
                                </select>
                                <div className="form-text">
                                  Metode enkripsi untuk signature callback
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label">Secret Key</label>
                                <input 
                                  type="password" 
                                  className="form-control" 
                                  placeholder="Masukkan secret key"
                                  defaultValue="your-secret-key-here"
                                />
                                <div className="form-text">
                                  Secret key untuk generate signature
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h6 className="fw-bold mb-3">Riwayat Callback</h6>
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead className="table-light">
                          <tr>
                            <th>Transaction ID</th>
                            <th>Status</th>
                            <th>URL Callback</th>
                            <th>Response</th>
                            <th>Retry Count</th>
                            <th>Timestamp</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>TRX-001</td>
                            <td>
                              <span className="badge bg-success">Success</span>
                            </td>
                            <td>https://solusicodekata.com/callback</td>
                            <td>200 OK</td>
                            <td>1</td>
                            <td>2024-01-15 10:30:00</td>
                          </tr>
                          <tr>
                            <td>TRX-002</td>
                            <td>
                              <span className="badge bg-warning">Retrying</span>
                            </td>
                            <td>https://solusicodekata.com/callback</td>
                            <td>500 Error</td>
                            <td>2/3</td>
                            <td>2024-01-15 10:25:00</td>
                          </tr>
                          <tr>
                            <td>TRX-003</td>
                            <td>
                              <span className="badge bg-danger">Failed</span>
                            </td>
                            <td>https://solusicodekata.com/callback</td>
                            <td>Timeout</td>
                            <td>3/3</td>
                            <td>2024-01-15 10:20:00</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end mt-4">
                    <button className="btn btn-primary">
                      <i className="ti ti-device-floppy me-2"></i>
                      Simpan Konfigurasi
                    </button>
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