'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import AuthGuard from '@/components/auth/AuthGuard'
import StatsCard from '@/components/dashboard/StatsCard'
import ModuleCard from '@/components/dashboard/ModuleCard'
import AnalyticsCard from '@/components/dashboard/AnalyticsCard'
import ActivityFeed from '@/components/dashboard/ActivityFeed'
import { 
  Users, 
  DollarSign, 
  ShoppingCart, 
  TrendingUp,
  Building,
  Key,
  Settings,
  CreditCard,
  BarChart3,
  FileText,
  Bell,
  Database
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { DashboardStats } from '@/types'
import { useState, useEffect } from 'react'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const fetchStats = async () => {
      try {
        // Replace with actual API call
        // const response = await dashboardAPI.getStats()
        
        // Mock data
        const mockStats: DashboardStats = {
          total_users: 1245,
          total_revenue: 45678900,
          total_orders: 892,
          growth_percentage: 12.5
        }
        
        setStats(mockStats)
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const modules = [
    {
      title: 'Tenant Management',
      description: 'Approve / Suspend / Update tenant',
      icon: Building,
      href: '/tenant-management',
      color: 'bg-blue-500'
    },
    {
      title: 'User Management',
      description: 'Lihat semua user tenant, buat akun admin tenant',
      icon: Users,
      href: '/user-management',
      color: 'bg-green-500'
    },
    {
      title: 'Client Credentials',
      description: 'Lihat/generate ulang client ID & key',
      icon: Key,
      href: '/client-credentials',
      color: 'bg-purple-500'
    },
    {
      title: 'Global Config',
      description: 'Default fee config, global payment provider keys',
      icon: Settings,
      href: '/global-config',
      color: 'bg-orange-500'
    },
    {
      title: 'Payment Method Master',
      description: 'Buat dan kelola metode pembayaran global',
      icon: CreditCard,
      href: '/payment-methods',
      color: 'bg-indigo-500'
    },
    {
      title: 'Transaction Monitoring',
      description: 'Lihat seluruh transaksi lintas tenant',
      icon: BarChart3,
      href: '/transaction-monitoring',
      color: 'bg-teal-500'
    },
    {
      title: 'Logs & Notifications',
      description: 'Lihat log callback, email notifikasi',
      icon: Bell,
      href: '/logs-notifications',
      color: 'bg-red-500',
      badge: '5'
    },
    {
      title: 'Reports',
      description: 'Ringkasan performa tiap tenant, transaksi per metode',
      icon: FileText,
      href: '/reports',
      color: 'bg-yellow-500'
    },
    {
      title: 'System Settings',
      description: 'Konfigurasi SMTP, integrasi eksternal',
      icon: Database,
      href: '/system-settings',
      color: 'bg-gray-500'
    }
  ]

  const activities = [
    { id: 1, user: 'John Doe', action: 'membuat pesanan baru', time: '2 menit yang lalu', type: 'order' as const },
    { id: 2, user: 'Jane Smith', action: 'mengupdate profil', time: '5 menit yang lalu', type: 'profile' as const },
    { id: 3, user: 'Bob Johnson', action: 'menyelesaikan pembayaran', time: '10 menit yang lalu', type: 'payment' as const },
    { id: 4, user: 'Alice Brown', action: 'mengirim pesan', time: '15 menit yang lalu', type: 'message' as const },
    { id: 5, user: 'Charlie Wilson', action: 'membuat tenant baru', time: '20 menit yang lalu', type: 'order' as const },
  ]

  const dashboardContent = (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Selamat datang kembali! Berikut adalah ringkasan aktivitas Anda.</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Pengguna"
              value={stats?.total_users.toLocaleString() || '0'}
              change={{ value: 8.2, type: 'increase' }}
              icon={Users}
              iconColor="text-blue-600"
              iconBgColor="bg-blue-100"
            />
            <StatsCard
              title="Total Pendapatan"
              value={formatCurrency(stats?.total_revenue || 0)}
              change={{ value: 12.5, type: 'increase' }}
              icon={DollarSign}
              iconColor="text-green-600"
              iconBgColor="bg-green-100"
            />
            <StatsCard
              title="Total Pesanan"
              value={stats?.total_orders.toLocaleString() || '0'}
              change={{ value: 3.1, type: 'decrease' }}
              icon={ShoppingCart}
              iconColor="text-orange-600"
              iconBgColor="bg-orange-100"
            />
            <StatsCard
              title="Pertumbuhan"
              value={`${stats?.growth_percentage || 0}%`}
              change={{ value: 5.7, type: 'increase' }}
              icon={TrendingUp}
              iconColor="text-purple-600"
              iconBgColor="bg-purple-100"
            />
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <AnalyticsCard
              title="Website Analytics"
              subtitle="Total 28.5% Conversion Rate"
              value="3.1k"
              change={{ value: 28, type: 'increase' }}
              bgColor="gradient"
              iconColor="text-white"
            >
              <div className="grid grid-cols-2 gap-4 mt-4 text-white">
                <div>
                  <p className="text-sm opacity-90">Sessions</p>
                  <p className="text-lg font-semibold">28%</p>
                </div>
                <div>
                  <p className="text-sm opacity-90">Page Views</p>
                  <p className="text-lg font-semibold">3.1k</p>
                </div>
                <div>
                  <p className="text-sm opacity-90">Leads</p>
                  <p className="text-lg font-semibold">1.2k</p>
                </div>
                <div>
                  <p className="text-sm opacity-90">Conversions</p>
                  <p className="text-lg font-semibold">12%</p>
                </div>
              </div>
            </AnalyticsCard>

            <AnalyticsCard
              title="Sales Overview"
              value="$42.5k"
              change={{ value: 18.2, type: 'increase' }}
              icon={ShoppingCart}
            >
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Order</span>
                  <span className="text-sm font-medium">62.2% (6,440)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Visits</span>
                  <span className="text-sm font-medium">25.5% (12,749)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: '62.2%' }}></div>
                </div>
              </div>
            </AnalyticsCard>

            <AnalyticsCard
              title="Revenue Generated"
              value="97.5k"
              change={{ value: 15.3, type: 'increase' }}
              icon={DollarSign}
              iconColor="text-green-600"
            >
              <div className="mt-4 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg opacity-20"></div>
            </AnalyticsCard>
          </div>

          {/* Modules Grid */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Modul Sistem</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module, index) => (
                <ModuleCard
                  key={index}
                  title={module.title}
                  description={module.description}
                  icon={module.icon}
                  href={module.href}
                  color={module.color}
                  badge={module.badge}
                />
              ))}
            </div>
          </div>

          {/* Activity and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActivityFeed activities={activities} />
            
            {/* Quick Actions */}
            <div className="card">
              <div className="card-body">
                <h3 className="card-title mb-4">Aksi Cepat</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <p className="text-sm font-medium text-gray-900">Tambah Pengguna</p>
                    </div>
                  </button>
                  <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Building className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-sm font-medium text-gray-900">Tambah Tenant</p>
                    </div>
                  </button>
                  <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <BarChart3 className="w-4 h-4 text-orange-600" />
                      </div>
                      <p className="text-sm font-medium text-gray-900">Laporan</p>
                    </div>
                  </button>
                  <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Settings className="w-4 h-4 text-purple-600" />
                      </div>
                      <p className="text-sm font-medium text-gray-900">Pengaturan</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )

  return (
    <AuthGuard requireAuth={true}>
      <DashboardLayout>
        {dashboardContent}
      </DashboardLayout>
    </AuthGuard>
  )
} 