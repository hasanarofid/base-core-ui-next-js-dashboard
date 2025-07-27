'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Home, 
  Users, 
  FileText, 
  BarChart3, 
  Calendar,
  Mail,
  MessageSquare,
  Kanban,
  CreditCard,
  Shield,
  HelpCircle,
  LogOut
} from 'lucide-react'

const menuItems = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    id: 'users',
    title: 'Pengguna',
    href: '/users',
    icon: Users,
  },
  {
    id: 'reports',
    title: 'Laporan',
    href: '/reports',
    icon: FileText,
  },
  {
    id: 'analytics',
    title: 'Analitik',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    id: 'calendar',
    title: 'Kalender',
    href: '/calendar',
    icon: Calendar,
  },
  {
    id: 'email',
    title: 'Email',
    href: '/email',
    icon: Mail,
  },
  {
    id: 'chat',
    title: 'Chat',
    href: '/chat',
    icon: MessageSquare,
  },
  {
    id: 'kanban',
    title: 'Kanban',
    href: '/kanban',
    icon: Kanban,
  },
  {
    id: 'invoices',
    title: 'Invoice',
    href: '/invoices',
    icon: CreditCard,
  },
  {
    id: 'roles',
    title: 'Roles & Permissions',
    href: '/roles',
    icon: Shield,
  },
  {
    id: 'help',
    title: 'Bantuan',
    href: '/help',
    icon: HelpCircle,
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
        "fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
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
      <nav className="mt-4 px-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {(!isCollapsed || isHovered) && (
                    <span className="ml-3">{item.title}</span>
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
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {(!isCollapsed || isHovered) && (
            <span className="ml-3">Keluar</span>
          )}
        </button>
      </div>
    </aside>
  )
} 