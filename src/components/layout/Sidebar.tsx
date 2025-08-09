'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()

  const menuItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: 'ti ti-layout-dashboard'
    },
    {
      title: 'Tenant Management',
      href: '/tenant-management',
      icon: 'ti ti-building'
    },
    {
      title: 'User Management',
      href: '/user-management',
      icon: 'ti ti-users'
    },
    {
      title: 'Payment Methods',
      href: '/payment-methods',
      icon: 'ti ti-credit-card'
    },
    {
      title: 'Products',
      href: '/products',
      icon: 'ti ti-package'
    },
    {
      title: 'Client Credentials',
      href: '/client-credentials',
      icon: 'ti ti-key'
    },
    {
      title: 'Reports',
      href: '/reports',
      icon: 'ti ti-chart-bar'
    },
    {
      title: 'Transaction Monitoring',
      href: '/transaction-monitoring',
      icon: 'ti ti-chart-line'
    },
    {
      title: 'Logs & Notifications',
      href: '/logs-notifications',
      icon: 'ti ti-bell'
    },
    {
      title: 'System Settings',
      href: '/system-settings',
      icon: 'ti ti-settings'
    }
  ]

  const handleToggleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onToggle()
  }

  return (
    <aside id="layout-menu" className={`layout-menu menu-vertical menu bg-menu-theme ${isCollapsed ? 'layout-menu-collapsed' : ''}`}>
      {/* App Brand */}
      <div className="app-brand demo">
        <Link href="/dashboard" className="app-brand-link">
          <span className="app-brand-logo demo">
          <img src="/logo.jpeg" alt="Logo" width="32" height="32" style={{ borderRadius: '4px' }} />
          </span>
          {!isCollapsed && <span className="app-brand-text demo menu-text fw-bold text-primary">Tenant</span>}
        </Link>

       
        <button 
          type="button"
          onClick={handleToggleClick} 
          className="layout-menu-toggle menu-link text-large ms-auto"
          style={{ border: 'none', background: 'none' }}
        >
          <i className="ti menu-toggle-icon d-none d-xl-block ti-sm align-middle"></i>
          <i className="ti ti-x d-block d-xl-none ti-sm align-middle"></i>
        </button>
      </div>

      <div className="menu-inner-shadow"></div>

      {/* Menu Items */}
      <ul className="menu-inner py-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <li key={item.href} className={`menu-item ${isActive ? 'active' : ''}`}>
              <Link href={item.href} className="menu-link">
                <i className={`menu-icon tf-icons ${item.icon} ${isActive ? 'text-white' : 'text-body'}`}></i>
                <div data-i18n={item.title} className={isActive ? 'text-white' : 'text-body'}>{item.title}</div>
              </Link>
            </li>
          )
        })}
      </ul>
    </aside>
  )
} 