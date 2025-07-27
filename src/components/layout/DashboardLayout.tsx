'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import { useSessionTimeout } from '@/hooks/useSessionTimeout'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
  // Initialize session timeout
  useSessionTimeout()

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={toggleSidebar} 
      />
      <Header 
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
      />
      
      <main className={`
        pt-16 transition-all duration-300
        ${sidebarCollapsed ? 'ml-16' : 'ml-64'}
      `}>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
} 