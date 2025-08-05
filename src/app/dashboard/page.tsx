'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import CRMStats from '@/components/dashboard/CRMStats'
import UserInfo from '@/components/dashboard/UserInfo'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign,
  ArrowUpRight,
  Bell,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Activity,
  ShoppingCart,
  Download,
  Plus,
  MoreVertical,
  Building,
  CreditCard,
  FileText,
  Key,
  Settings,
  Globe,
  RefreshCw,
  BookOpen
} from 'lucide-react'
// Use the safe CSS version that doesn't affect header and sidebar
import './crm-template-safe.css'

export default function DashboardPage() {
  const { user } = useAuth()

  const websiteAnalytics = {
    conversionRate: '28.5%',
    sessions: '28%',
    pageViews: '3.1k',
    leads: '1.2k',
    conversions: '12%'
  }



  const earningReports = {
    weekly: '$468',
    change: '+4.2%',
    earnings: '$545.69',
    profit: '$256.34',
    expense: '$74.19'
  }

  const supportTracker = {
    totalTickets: '164',
    newTickets: '142',
    openTickets: '28',
    responseTime: '1 Day',
    completedTask: '85%'
  }

  const crmStatsData = {
    revenue: {
      value: '$42.5k',
      change: '+18.2%',
      isPositive: true
    },
    leads: {
      value: '1.2k',
      change: '+12.5%',
      isPositive: true
    },
    orders: {
      value: '6,440',
      change: '+8.7%',
      isPositive: true
    },
    conversion: {
      value: '28.5%',
      change: '+2.1%',
      isPositive: true
    }
  }

  return (
    <DashboardLayout>
      <div className="container-xxl flex-grow-1 container-p-y crm-dashboard">
        {/* Page Header */}
        

        {/* CRM Statistics Cards */}
        <CRMStats data={crmStatsData} />

        {/* Quick Access Menu berdasarkan Role */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  {user?.role === 'superadmin' ? 'Superadmin Modules' : 'Tenant Modules'}
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {user?.role === 'superadmin' ? (
                    // Superadmin Quick Access
                    <>
                      <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
                        <div className="d-flex align-items-center p-3 border rounded hover:bg-gray-50 transition-colors duration-200">
                          <Building className="w-8 h-8 text-brand-blue-3 me-3" />
                          <div>
                            <h6 className="mb-1">Tenant Management</h6>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
                        <div className="d-flex align-items-center p-3 border rounded hover:bg-gray-50 transition-colors duration-200">
                          <Users className="w-8 h-8 text-brand-blue-3 me-3" />
                          <div>
                            <h6 className="mb-1">User Management</h6>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
                        <div className="d-flex align-items-center p-3 border rounded hover:bg-gray-50 transition-colors duration-200">
                          <Key className="w-8 h-8 text-brand-blue-3 me-3" />
                          <div>
                            <h6 className="mb-1">Client Credentials</h6>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
                        <div className="d-flex align-items-center p-3 border rounded hover:bg-gray-50 transition-colors duration-200">
                          <Settings className="w-8 h-8 text-brand-blue-3 me-3" />
                          <div>
                            <h6 className="mb-1">Global Config</h6>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
                        <div className="d-flex align-items-center p-3 border rounded hover:bg-gray-50 transition-colors duration-200">
                          <CreditCard className="w-8 h-8 text-brand-blue-3 me-3" />
                          <div>
                            <h6 className="mb-1">Payment Method Master</h6>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
                        <div className="d-flex align-items-center p-3 border rounded hover:bg-gray-50 transition-colors duration-200">
                          <BarChart3 className="w-8 h-8 text-brand-blue-3 me-3" />
                          <div>
                            <h6 className="mb-1">Transaction Monitoring</h6>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
                        <div className="d-flex align-items-center p-3 border rounded hover:bg-gray-50 transition-colors duration-200">
                          <FileText className="w-8 h-8 text-brand-blue-3 me-3" />
                          <div>
                            <h6 className="mb-1">Logs & Notifications</h6>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
                        <div className="d-flex align-items-center p-3 border rounded hover:bg-gray-50 transition-colors duration-200">
                          <BarChart3 className="w-8 h-8 text-brand-blue-3 me-3" />
                          <div>
                            <h6 className="mb-1">Reports</h6>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
                        <div className="d-flex align-items-center p-3 border rounded hover:bg-gray-50 transition-colors duration-200">
                          <Settings className="w-8 h-8 text-brand-blue-3 me-3" />
                          <div>
                            <h6 className="mb-1">System Settings</h6>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    // Tenant Admin Quick Access
                    <>
                      <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
                        <div className="d-flex align-items-center p-3 border rounded hover:bg-gray-50 transition-colors duration-200">
                          <Users className="w-8 h-8 text-brand-blue-3 me-3" />
                          <div>
                            <h6 className="mb-1">User Management</h6>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
                        <div className="d-flex align-items-center p-3 border rounded hover:bg-gray-50 transition-colors duration-200">
                          <CreditCard className="w-8 h-8 text-brand-blue-3 me-3" />
                          <div>
                            <h6 className="mb-1">Payment Config</h6>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
                        <div className="d-flex align-items-center p-3 border rounded hover:bg-gray-50 transition-colors duration-200">
                          <DollarSign className="w-8 h-8 text-brand-blue-3 me-3" />
                          <div>
                            <h6 className="mb-1">Fee Rules</h6>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
                        <div className="d-flex align-items-center p-3 border rounded hover:bg-gray-50 transition-colors duration-200">
                          <RefreshCw className="w-8 h-8 text-brand-blue-3 me-3" />
                          <div>
                            <h6 className="mb-1">Callback Config</h6>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
                        <div className="d-flex align-items-center p-3 border rounded hover:bg-gray-50 transition-colors duration-200">
                          <Key className="w-8 h-8 text-brand-blue-3 me-3" />
                          <div>
                            <h6 className="mb-1">API Credential</h6>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
                        <div className="d-flex align-items-center p-3 border rounded hover:bg-gray-50 transition-colors duration-200">
                          <FileText className="w-8 h-8 text-brand-blue-3 me-3" />
                          <div>
                            <h6 className="mb-1">Transaction Logs</h6>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
                        <div className="d-flex align-items-center p-3 border rounded hover:bg-gray-50 transition-colors duration-200">
                          <Bell className="w-8 h-8 text-brand-blue-3 me-3" />
                          <div>
                            <h6 className="mb-1">Notifications</h6>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-4 col-sm-6 mb-3">
                        <div className="d-flex align-items-center p-3 border rounded hover:bg-gray-50 transition-colors duration-200">
                          <BookOpen className="w-8 h-8 text-brand-blue-3 me-3" />
                          <div>
                            <h6 className="mb-1">Integration Guide</h6>
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

        <div className="row">
          {/* Website Analytics */}
          <div className="col-lg-8 mb-4">
            <div className="card analytics-card gradient">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <div className="d-flex justify-content-between align-items-start mb-4">
                      <div>
                        <h5 className="text-white mb-1">Website Analytics</h5>
                        <small className="text-white opacity-80">Total {websiteAnalytics.conversionRate} Conversion Rate</small>
                      </div>
                      <div className="dropdown">
                        <button className="btn-icon btn-sm">
                          <MoreVertical className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-8 col-md-8 col-12 order-2 order-md-1">
                      <div className="row">
                        <div className="col-12 mb-3">
                          <h6 className="text-white mb-3">Traffic Overview</h6>
                        </div>
                        <div className="col-6 mb-3">
                          <div className="d-flex align-items-center justify-content-between p-3 bg-white bg-opacity-10 rounded-lg">
                            <div>
                              <p className="text-white opacity-80 mb-1 text-sm">Sessions</p>
                              <h6 className="text-white mb-0 fw-bold">{websiteAnalytics.sessions}</h6>
                            </div>
                            <div className="icon-container w-10 h-10">
                              <Activity className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        </div>
                        <div className="col-6 mb-3">
                          <div className="d-flex align-items-center justify-content-between p-3 bg-white bg-opacity-10 rounded-lg">
                            <div>
                              <p className="text-white opacity-80 mb-1 text-sm">Page Views</p>
                              <h6 className="text-white mb-0 fw-bold">{websiteAnalytics.pageViews}</h6>
                            </div>
                            <div className="icon-container w-10 h-10">
                              <BarChart3 className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        </div>
                        <div className="col-6 mb-3">
                          <div className="d-flex align-items-center justify-content-between p-3 bg-white bg-opacity-10 rounded-lg">
                            <div>
                              <p className="text-white opacity-80 mb-1 text-sm">Leads</p>
                              <h6 className="text-white mb-0 fw-bold">{websiteAnalytics.leads}</h6>
                            </div>
                            <div className="icon-container w-10 h-10">
                              <Users className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        </div>
                        <div className="col-6 mb-3">
                          <div className="d-flex align-items-center justify-content-between p-3 bg-white bg-opacity-10 rounded-lg">
                            <div>
                              <p className="text-white opacity-80 mb-1 text-sm">Conversions</p>
                              <h6 className="text-white mb-0 fw-bold">{websiteAnalytics.conversions}</h6>
                            </div>
                            <div className="icon-container w-10 h-10">
                              <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-12 order-1 order-md-2 my-4 my-md-0 text-center">
                      <div className="w-24 h-24 mx-auto bg-white bg-opacity-20 rounded-lg d-flex align-items-center justify-content-center mb-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-brand-blue-1 to-brand-blue-3 rounded-lg transform rotate-12"></div>
                      </div>
                      <div className="text-center">
                        <h6 className="text-white mb-2">Performance</h6>
                        <div className="progress-bar-container progress-bar-white mb-2">
                          <div className="progress-bar-fill" style={{ width: '75%' }}></div>
                        </div>
                        <small className="text-white opacity-80">75% Target Achieved</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sales Overview */}
          <div className="col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-header">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <small className="d-block mb-1 text-muted">Sales Overview</small>
                    <h4 className="card-title mb-1">$42.5k</h4>
                  </div>
                  <div className="d-flex align-items-center text-success">
                    <ArrowUpRight className="w-4 h-4 me-1" />
                    <span className="text-sm fw-medium">+18.2%</span>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-6">
                    <div className="d-flex gap-2 align-items-center mb-2">
                      <div className="icon-container w-8 h-8">
                        <ShoppingCart className="w-3 h-3 text-brand-blue-3" />
                      </div>
                      <p className="mb-0 text-sm">Order</p>
                    </div>
                    <h5 className="mb-0 pt-1 text-nowrap">62.2%</h5>
                    <small className="text-muted">6,440</small>
                  </div>
                  <div className="col-6">
                    <div className="d-flex gap-2 align-items-center mb-2">
                      <div className="icon-container w-8 h-8">
                        <Users className="w-3 h-3 text-brand-yellow" />
                      </div>
                      <p className="mb-0 text-sm">Visits</p>
                    </div>
                    <h5 className="mb-0 pt-1 text-nowrap">25.5%</h5>
                    <small className="text-muted">12,749</small>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-sm text-muted">Progress</span>
                    <span className="text-sm fw-medium">85%</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div className="row">
          {/* Average Daily Sales */}
          <div className="col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-header">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <small className="d-block mb-1 text-muted">Average Daily Sales</small>
                    <h4 className="card-title mb-1">$28,450</h4>
                  </div>
                  <div className="icon-container w-10 h-10">
                    <DollarSign className="w-5 h-5 text-brand-blue-3" />
                  </div>
                </div>
                <small className="text-muted">Total Sales This Month</small>
              </div>
              <div className="card-body">
                <div className="h-20 bg-gradient-to-r from-brand-blue-1 to-brand-blue-3 rounded-lg position-relative overflow-hidden">
                  <div className="position-absolute inset-0 bg-white bg-opacity-20"></div>
                  <div className="position-absolute bottom-0 left-0 w-100 h-1 bg-white bg-opacity-30"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Earning Reports */}
          <div className="col-lg-5 mb-4">
            <div className="card h-100">
              <div className="card-header">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="card-title mb-1">Earning Reports</h5>
                    <p className="text-muted mb-0">Weekly Earnings Overview</p>
                  </div>
                  <div className="icon-container w-10 h-10">
                    <TrendingUp className="w-5 h-5 text-brand-blue-3" />
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center mb-4">
                  <h4 className="card-title mb-0 me-2">$468</h4>
                  <div className="d-flex align-items-center text-success">
                    <ArrowUpRight className="w-4 h-4 me-1" />
                    <span className="text-sm fw-medium">+4.2%</span>
                  </div>
                </div>
                <p className="text-muted mb-4">You informed of this week compared to last week</p>
                
                {/* Chart Placeholder */}
                <div className="h-32 mb-6 d-flex align-items-end justify-content-between">
                  {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day, index) => (
                    <div key={day} className="d-flex flex-column align-items-center">
                      <div 
                        className={`w-8 rounded-sm transition-all duration-300 ${
                          index === 4 ? 'bg-brand-blue-3 h-20' : 'bg-gray-300 dark:bg-gray-600 h-12'
                        }`}
                      ></div>
                      <span className="text-xs text-muted mt-2">{day}</span>
                    </div>
                  ))}
                </div>
                
                <div className="row">
                  <div className="col-4 text-center">
                    <div className="text-lg fw-semibold text-gray-900 dark:text-white">{earningReports.earnings}</div>
                    <div className="text-xs text-muted">Earnings</div>
                    <div className="w-8 h-1 bg-brand-blue-3 mx-auto mt-1 rounded"></div>
                  </div>
                  <div className="col-4 text-center">
                    <div className="text-lg fw-semibold text-gray-900 dark:text-white">{earningReports.profit}</div>
                    <div className="text-xs text-muted">Profit</div>
                    <div className="w-8 h-1 bg-success mx-auto mt-1 rounded"></div>
                  </div>
                  <div className="col-4 text-center">
                    <div className="text-lg fw-semibold text-gray-900 dark:text-white">{earningReports.expense}</div>
                    <div className="text-xs text-muted">Expense</div>
                    <div className="w-8 h-1 bg-danger mx-auto mt-1 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Support Tracker */}
          <div className="col-lg-3 mb-4">
            <div className="card h-100">
              <div className="card-header">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="card-title mb-1">Support Tracker</h5>
                    <p className="text-muted mb-0">Last 7 Days</p>
                  </div>
                  <div className="icon-container w-10 h-10">
                    <Bell className="w-5 h-5 text-brand-yellow" />
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center mb-4">
                  <h4 className="card-title mb-0">{supportTracker.totalTickets} Total Tickets</h4>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <div className="icon-container w-8 h-8">
                        <CheckCircle className="w-4 h-4 text-success" />
                      </div>
                      <span className="text-sm fw-medium text-gray-900 dark:text-white ms-3">New Tickets</span>
                    </div>
                    <span className="text-sm fw-semibold text-gray-900 dark:text-white">{supportTracker.newTickets}</span>
                  </div>
                  
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <div className="icon-container w-8 h-8">
                        <AlertCircle className="w-4 h-4 text-brand-blue-3" />
                      </div>
                      <span className="text-sm fw-medium text-gray-900 dark:text-white ms-3">Open Tickets</span>
                    </div>
                    <span className="text-sm fw-semibold text-gray-900 dark:text-white">{supportTracker.openTickets}</span>
                  </div>
                  
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <div className="icon-container w-8 h-8">
                        <Clock className="w-4 h-4 text-brand-blue-2" />
                      </div>
                      <span className="text-sm fw-medium text-gray-900 dark:text-white ms-3">Response Time</span>
                    </div>
                    <span className="text-sm fw-semibold text-gray-900 dark:text-white">{supportTracker.responseTime}</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg fw-semibold text-gray-900 dark:text-white mb-3">Completed Task {supportTracker.completedTask}</div>
                  <div className="progress-circle mx-auto">
                    <svg className="w-16 h-16" viewBox="0 0 36 36">
                      <path
                        className="progress-bg"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="3"
                      />
                      <path
                        className="progress-fill"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="var(--brand-blue-3)"
                        strokeWidth="3"
                        strokeDasharray="85, 100"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="position-absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <span className="text-sm fw-bold text-brand-blue-3">85%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 