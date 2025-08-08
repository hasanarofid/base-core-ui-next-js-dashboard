'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import UserInfo from '@/components/dashboard/UserInfo'
import { useAuth } from '@/contexts/AuthContext'
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
  MoreVertical,
  Building,
  CreditCard,
  FileText,
  Key,
  Settings,
  RefreshCw,
  BookOpen
} from 'lucide-react'
// Use the safe CSS version that doesn't affect header and sidebar

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
      <div className="container-xxl flex-grow-1 container-p-y">
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

      </div>
    </DashboardLayout>
  )
} 