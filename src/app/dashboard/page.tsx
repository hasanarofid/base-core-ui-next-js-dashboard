'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import UserInfo from '@/components/dashboard/UserInfo'
import { useAuth } from '@/contexts/AuthContext'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <>
      <style jsx>{`
        .hover-shadow-sm:hover {
          box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
          transform: translateY(-1px);
          transition: all 0.2s ease-in-out;
        }
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
      <DashboardLayout>
        <div className="container-xxl flex-grow-1 container-p-y">
          <h4 className="fw-bold py-3 mb-4">
            <span className="text-muted fw-light">Dashboard /</span> {user?.role}
          </h4>

          {/* Main Statistics Cards */}
        
          {/* Quick Access Menu berdasarkan Role */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0 text-primary">
                    <i className="ti ti-apps me-2 text-primary"></i>
                    {user?.role === 'superadmin' ? 'Superadmin Modules' : 'Tenant Modules'}
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    {user?.role === 'superadmin' ? (
                      // Superadmin Quick Access
                      <>
                        <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
                          <div className="d-flex align-items-center p-3 border rounded bg-light-subtle hover-shadow-sm cursor-pointer">
                            <div className="badge rounded-pill bg-primary me-3 p-2">
                              <i className="ti ti-building ti-sm"></i>
                            </div>
                            <div>
                              <h6 className="mb-1 text-primary">Tenant Management</h6>
                              <small className="text-muted">Manage all tenants</small>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
                          <div className="d-flex align-items-center p-3 border rounded bg-light-subtle hover-shadow-sm cursor-pointer">
                            <div className="badge rounded-pill bg-info me-3 p-2">
                              <i className="ti ti-users ti-sm"></i>
                            </div>
                            <div>
                              <h6 className="mb-1 text-primary">User Management</h6>
                              <small className="text-muted">Control user access</small>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
                          <div className="d-flex align-items-center p-3 border rounded bg-light-subtle hover-shadow-sm cursor-pointer">
                            <div className="badge rounded-pill bg-warning me-3 p-2">
                              <i className="ti ti-key ti-sm"></i>
                            </div>
                            <div>
                              <h6 className="mb-1 text-primary">Client Credentials</h6>
                              <small className="text-muted">API access control</small>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
                          <div className="d-flex align-items-center p-3 border rounded bg-light-subtle hover-shadow-sm cursor-pointer">
                            <div className="badge rounded-pill bg-success me-3 p-2">
                              <i className="ti ti-settings ti-sm"></i>
                            </div>
                            <div>
                              <h6 className="mb-1 text-primary">Global Config</h6>
                              <small className="text-muted">System settings</small>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
                          <div className="d-flex align-items-center p-3 border rounded bg-light-subtle hover-shadow-sm cursor-pointer">
                            <div className="badge rounded-pill bg-danger me-3 p-2">
                              <i className="ti ti-credit-card ti-sm"></i>
                            </div>
                            <div>
                              <h6 className="mb-1 text-primary">Payment Method</h6>
                              <small className="text-muted">Payment configuration</small>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
                          <div className="d-flex align-items-center p-3 border rounded bg-light-subtle hover-shadow-sm cursor-pointer">
                            <div className="badge rounded-pill bg-primary me-3 p-2">
                              <i className="ti ti-chart-bar ti-sm"></i>
                            </div>
                            <div>
                              <h6 className="mb-1 text-primary">Transaction Monitor</h6>
                              <small className="text-muted">Real-time monitoring</small>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
                          <div className="d-flex align-items-center p-3 border rounded bg-light-subtle hover-shadow-sm cursor-pointer">
                            <div className="badge rounded-pill bg-info me-3 p-2">
                              <i className="ti ti-file-text ti-sm"></i>
                            </div>
                            <div>
                              <h6 className="mb-1 text-primary">Logs & Notifications</h6>
                              <small className="text-muted">System logs</small>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
                          <div className="d-flex align-items-center p-3 border rounded bg-light-subtle hover-shadow-sm cursor-pointer">
                            <div className="badge rounded-pill bg-success me-3 p-2">
                              <i className="ti ti-report ti-sm"></i>
                            </div>
                            <div>
                              <h6 className="mb-1 text-primary">Reports</h6>
                              <small className="text-muted">Analytics & reports</small>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      // Tenant Admin Quick Access
                      <>
                        <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
                          <div className="d-flex align-items-center p-3 border rounded bg-light-subtle hover-shadow-sm cursor-pointer">
                            <div className="badge rounded-pill bg-info me-3 p-2">
                              <i className="ti ti-users ti-sm"></i>
                            </div>
                            <div>
                              <h6 className="mb-1 text-primary">User Management</h6>
                              <small className="text-muted">Manage team users</small>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
                          <div className="d-flex align-items-center p-3 border rounded bg-light-subtle hover-shadow-sm cursor-pointer">
                            <div className="badge rounded-pill bg-danger me-3 p-2">
                              <i className="ti ti-credit-card ti-sm"></i>
                            </div>
                            <div>
                              <h6 className="mb-1 text-primary">Payment Config</h6>
                              <small className="text-muted">Payment setup</small>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
                          <div className="d-flex align-items-center p-3 border rounded bg-light-subtle hover-shadow-sm cursor-pointer">
                            <div className="badge rounded-pill bg-warning me-3 p-2">
                              <i className="ti ti-currency-dollar ti-sm"></i>
                            </div>
                            <div>
                              <h6 className="mb-1 text-primary">Fee Rules</h6>
                              <small className="text-muted">Transaction fees</small>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
                          <div className="d-flex align-items-center p-3 border rounded bg-light-subtle hover-shadow-sm cursor-pointer">
                            <div className="badge rounded-pill bg-success me-3 p-2">
                              <i className="ti ti-refresh ti-sm"></i>
                            </div>
                            <div>
                              <h6 className="mb-1 text-primary">Callback Config</h6>
                              <small className="text-muted">API callbacks</small>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
                          <div className="d-flex align-items-center p-3 border rounded bg-light-subtle hover-shadow-sm cursor-pointer">
                            <div className="badge rounded-pill bg-primary me-3 p-2">
                              <i className="ti ti-key ti-sm"></i>
                            </div>
                            <div>
                              <h6 className="mb-1 text-primary">API Credentials</h6>
                              <small className="text-muted">Integration keys</small>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
                          <div className="d-flex align-items-center p-3 border rounded bg-light-subtle hover-shadow-sm cursor-pointer">
                            <div className="badge rounded-pill bg-info me-3 p-2">
                              <i className="ti ti-file-text ti-sm"></i>
                            </div>
                            <div>
                              <h6 className="mb-1 text-primary">Transaction Logs</h6>
                              <small className="text-muted">Activity history</small>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
                          <div className="d-flex align-items-center p-3 border rounded bg-light-subtle hover-shadow-sm cursor-pointer">
                            <div className="badge rounded-pill bg-warning me-3 p-2">
                              <i className="ti ti-bell ti-sm"></i>
                            </div>
                            <div>
                              <h6 className="mb-1 text-primary">Notifications</h6>
                              <small className="text-muted">Alert settings</small>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
                          <div className="d-flex align-items-center p-3 border rounded bg-light-subtle hover-shadow-sm cursor-pointer">
                            <div className="badge rounded-pill bg-success me-3 p-2">
                              <i className="ti ti-book ti-sm"></i>
                            </div>
                            <div>
                              <h6 className="mb-1 text-primary">Integration Guide</h6>
                              <small className="text-muted">Documentation</small>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="row mb-4">
            <div className="col-12">
              <UserInfo />
            </div>
          </div>

        </div>
      </DashboardLayout>
    </>
  )
} 