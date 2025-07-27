'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import AuthGuard from '@/components/auth/AuthGuard'
import StatsCard from '@/components/dashboard/StatsCard'
import { Users, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react'
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
            />
            <StatsCard
              title="Total Pendapatan"
              value={formatCurrency(stats?.total_revenue || 0)}
              change={{ value: 12.5, type: 'increase' }}
              icon={DollarSign}
              iconColor="text-green-600"
            />
            <StatsCard
              title="Total Pesanan"
              value={stats?.total_orders.toLocaleString() || '0'}
              change={{ value: 3.1, type: 'decrease' }}
              icon={ShoppingCart}
              iconColor="text-orange-600"
            />
            <StatsCard
              title="Pertumbuhan"
              value={`${stats?.growth_percentage || 0}%`}
              change={{ value: 5.7, type: 'increase' }}
              icon={TrendingUp}
              iconColor="text-purple-600"
            />
          </div>

          {/* Charts and Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h3>
              <div className="space-y-4">
                {[
                  { id: 1, user: 'John Doe', action: 'membuat pesanan baru', time: '2 menit yang lalu' },
                  { id: 2, user: 'Jane Smith', action: 'mengupdate profil', time: '5 menit yang lalu' },
                  { id: 3, user: 'Bob Johnson', action: 'menyelesaikan pembayaran', time: '10 menit yang lalu' },
                  { id: 4, user: 'Alice Brown', action: 'mengirim pesan', time: '15 menit yang lalu' },
                ].map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
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
                      <ShoppingCart className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">Buat Pesanan</p>
                  </div>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <DollarSign className="w-4 h-4 text-orange-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">Laporan Keuangan</p>
                  </div>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">Analitik</p>
                  </div>
                </button>
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