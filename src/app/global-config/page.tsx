'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import AuthGuard from '@/components/auth/AuthGuard'
import { Settings, Save } from 'lucide-react'

export default function GlobalConfigPage() {
  return (
    <AuthGuard requireAuth={true}>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Global Config</h1>
              <p className="text-gray-600">Default fee config, global payment provider keys</p>
            </div>
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2">
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Configuration</h3>
              <p className="text-gray-600 mb-4">Halaman untuk konfigurasi global akan segera hadir</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
} 