'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import AuthGuard from '@/components/auth/AuthGuard'
import { useAuth } from '@/contexts/AuthContext'

export default function FeeRulesPage() {
  const { user } = useAuth()

  return (
    <AuthGuard requireAuth={true}>
      <DashboardLayout>
        <div className="container-xxl flex-grow-1 container-p-y">
          <h4 className="fw-bold py-3 mb-4">
            <span className="text-muted fw-light">Fee Rules /</span> Atur Biaya Transaksi
          </h4>

          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    <i className="ti ti-diamond me-2 text-primary"></i>
                    Konfigurasi Fee Rules
                  </h5>
                  <p className="card-subtitle text-muted mb-0">
                    Atur flat vs percent fee, assign per metode pembayaran
                  </p>
                </div>
                <div className="card-body">
                  <div className="alert alert-info" role="alert">
                    <h6 className="alert-heading">
                      <i className="ti ti-info-circle me-2"></i>
                      Informasi Fee Rules
                    </h6>
                    <p className="mb-0">
                      Halaman ini akan menampilkan konfigurasi untuk mengatur biaya transaksi berdasarkan metode pembayaran.
                      Anda dapat mengatur biaya flat atau persentase untuk setiap metode pembayaran yang tersedia.
                    </p>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="card border-primary">
                        <div className="card-header bg-primary text-white">
                          <h6 className="card-title mb-0">
                            <i className="ti ti-percentage me-2"></i>
                            Fee Persentase
                          </h6>
                        </div>
                        <div className="card-body">
                          <p className="text-muted">
                            Atur biaya dalam bentuk persentase dari nilai transaksi.
                          </p>
                          <div className="d-grid">
                            <button className="btn btn-outline-primary">
                              <i className="ti ti-plus me-2"></i>
                              Tambah Fee Persentase
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="card border-success">
                        <div className="card-header bg-success text-white">
                          <h6 className="card-title mb-0">
                            <i className="ti ti-currency-dollar me-2"></i>
                            Fee Flat
                          </h6>
                        </div>
                        <div className="card-body">
                          <p className="text-muted">
                            Atur biaya dalam bentuk nominal tetap per transaksi.
                          </p>
                          <div className="d-grid">
                            <button className="btn btn-outline-success">
                              <i className="ti ti-plus me-2"></i>
                              Tambah Fee Flat
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h6 className="fw-bold mb-3">Metode Pembayaran yang Tersedia</h6>
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead className="table-light">
                          <tr>
                            <th>Metode Pembayaran</th>
                            <th>Jenis Fee</th>
                            <th>Nilai</th>
                            <th>Status</th>
                            <th>Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <div className="d-flex align-items-center">
                                <i className="ti ti-credit-card me-2 text-primary"></i>
                                Bank Transfer
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-primary">Persentase</span>
                            </td>
                            <td>2.5%</td>
                            <td>
                              <span className="badge bg-success">Aktif</span>
                            </td>
                            <td>
                              <button className="btn btn-sm btn-outline-primary me-1">
                                <i className="ti ti-edit"></i>
                              </button>
                              <button className="btn btn-sm btn-outline-danger">
                                <i className="ti ti-trash"></i>
                              </button>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <div className="d-flex align-items-center">
                                <i className="ti ti-wallet me-2 text-success"></i>
                                E-Wallet
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-success">Flat</span>
                            </td>
                            <td>Rp 5.000</td>
                            <td>
                              <span className="badge bg-success">Aktif</span>
                            </td>
                            <td>
                              <button className="btn btn-sm btn-outline-primary me-1">
                                <i className="ti ti-edit"></i>
                              </button>
                              <button className="btn btn-sm btn-outline-danger">
                                <i className="ti ti-trash"></i>
                              </button>
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