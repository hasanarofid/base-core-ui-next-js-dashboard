'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Home, 
  Users, 
  Building,
  Key,
  Settings,
  CreditCard,
  BarChart3,
  FileText,
  Mail,
  LogOut,
  ChevronRight,
  Database,
  Shield,
  Bell
} from 'lucide-react'

const menuItems = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    id: 'tenant-management',
    title: 'Tenant Management',
    href: '/tenant-management',
    icon: Building,
    description: 'Approve / Suspend / Update tenant'
  },
  {
    id: 'user-management',
    title: 'User Management',
    href: '/user-management',
    icon: Users,
    description: 'Lihat semua user tenant, buat akun admin tenant'
  },
  {
    id: 'client-credentials',
    title: 'Client Credentials',
    href: '/client-credentials',
    icon: Key,
    description: 'Lihat/generate ulang client ID & key'
  },
  {
    id: 'global-config',
    title: 'Global Config',
    href: '/global-config',
    icon: Settings,
    description: 'Default fee config, global payment provider keys'
  },
  {
    id: 'payment-methods',
    title: 'Payment Method Master',
    href: '/payment-methods',
    icon: CreditCard,
    description: 'Buat dan kelola metode pembayaran global'
  },
  {
    id: 'transaction-monitoring',
    title: 'Transaction Monitoring',
    href: '/transaction-monitoring',
    icon: BarChart3,
    description: 'Lihat seluruh transaksi lintas tenant'
  },
  {
    id: 'logs-notifications',
    title: 'Logs & Notifications',
    href: '/logs-notifications',
    icon: Bell,
    description: 'Lihat log callback, email notifikasi'
  },
  {
    id: 'reports',
    title: 'Reports',
    href: '/reports',
    icon: FileText,
    description: 'Ringkasan performa tiap tenant, transaksi per metode'
  },
  {
    id: 'system-settings',
    title: 'System Settings',
    href: '/system-settings',
    icon: Database,
    description: 'Konfigurasi SMTP, integrasi eksternal'
  },
]

interface SidebarProps {
  isCollapsed?: boolean
  onToggle?: () => void
}

export default function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const [isHovered, setIsHovered] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  return (
    <aside 
      className={cn(
        "layout-menu",
        isCollapsed && "collapsed"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          {(!isCollapsed || isHovered) && (
            <span className="font-bold text-lg text-gray-900">TenantCore</span>
          )}
        </Link>
        {(!isCollapsed || isHovered) && (
          <button
            onClick={onToggle}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-4 px-2 pb-20">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={cn(
                    "menu-item",
                    isActive && "active"
                  )}
                >
                  <Icon className="menu-icon" />
                  {(!isCollapsed || isHovered) && (
                    <>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="menu-text">{item.title}</span>
                          {item.description && (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </div>
                        {item.description && (
                          <p className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="absolute bottom-4 left-0 right-0 px-2">
        <button
          onClick={handleLogout}
          className="menu-item w-full"
        >
          <LogOut className="menu-icon" />
          {(!isCollapsed || isHovered) && (
            <span className="menu-text">Keluar</span>
          )}
        </button>
      </div>
    </aside>
  )
} 