'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    <div className="layout-wrapper">
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
      <div className={`layout-page ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <Header onToggleSidebar={toggleSidebar} />
        <div className="layout-content">
          {children}
        </div>
      </div>
    </div>
  )
} 