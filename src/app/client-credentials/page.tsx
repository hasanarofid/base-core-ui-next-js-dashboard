'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import AuthGuard from '@/components/auth/AuthGuard'
import { Key, RefreshCw, Eye, EyeOff } from 'lucide-react'

export default function ClientCredentialsPage() {
  return (
    <AuthGuard requireAuth={true}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Client Credentials</h1>
              <p className="text-gray-600">Lihat/generate ulang client ID & key</p>
            </div>
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>Generate New</span>
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <Key className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Client Credentials</h3>
              <p className="text-gray-600 mb-4">Halaman untuk mengelola client credentials akan segera hadir</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
} 