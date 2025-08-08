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
            <svg width="32" height="22" viewBox="0 0 32 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z"
                fill="#7367F0" />
              <path
                opacity="0.06"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z"
                fill="#161616" />
              <path
                opacity="0.06"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z"
                fill="#161616" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z"
                fill="#7367F0" />
            </svg>
          </span>
          {!isCollapsed && <span className="app-brand-text demo menu-text fw-bold">Tenant</span>}
        </Link>

        <button 
          className="layout-menu-toggle menu-link text-large ms-auto" 
          onClick={handleToggleClick}
          type="button"
        >
          <i className="ti menu-toggle-icon ti-md d-none d-xl-block align-middle"></i>
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