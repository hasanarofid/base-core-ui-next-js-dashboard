'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeContext'
import { 
  Home, 
  Users, 
  Building,
  Key,
  Settings,
  CreditCard,
  BarChart3,
  FileText,
  LogOut,
  ChevronRight,
  Database,
  Bell,
  Menu,
  X,
  Palette,
  Search,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react'

const menuItems = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    active: true
  },
  {
    id: 'apps-pages',
    title: 'Apps & Pages',
    type: 'header'
  },
  {
    id: 'tenant-management',
    title: 'Tenant Management',
    href: '/tenant-management',
    icon: Building
  },
  {
    id: 'user-management',
    title: 'User Management',
    href: '/user-management',
    icon: Users
  },
  {
    id: 'client-credentials',
    title: 'Client Credentials',
    href: '/client-credentials',
    icon: Key
  },
  {
    id: 'global-config',
    title: 'Global Config',
    href: '/global-config',
    icon: Settings
  },
  {
    id: 'payment-methods',
    title: 'Payment Method Master',
    href: '/payment-methods',
    icon: CreditCard
  },
  {
    id: 'transaction-monitoring',
    title: 'Transaction Monitoring',
    href: '/transaction-monitoring',
    icon: BarChart3
  }
]

interface SidebarProps {
  isCollapsed?: boolean
  onToggle?: () => void
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "layout-menu bg-menu-theme transition-all duration-300 ease-in-out",
        isCollapsed && "collapsed",
        isMobileMenuOpen && "show"
      )}>
        {/* App Brand */}
        <div className="app-brand demo">
          <Link href="/dashboard" className="app-brand-link hover:opacity-80 transition-opacity duration-300">
            <span className="app-brand-logo demo">
              <svg width="32" height="32" viewBox="0 0 2000 2000" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <g>
                    <path fill="#0C4558" d="M1227.39,1664.96c-8.66,25.64-18.86,45.88-35.35,63.55c-36.18,38.79-105.25,36.3-138.85,20.88
                      c-62.12-28.5-76.16-102.18-60.89-147.99c19.83-59.46,75.59-93.21,140.74-83.92c39.27,5.6,71.02,22.97,94.72,55.85
                      c22.14,30.72,41.74,63.07,63.33,94.09c22.28,32.02,31.8,32.11,51.54-1.62c23.57-40.28,38.4-84.42,50.76-129.18
                      c3.79-13.73,9.67-19.4,23.48-16.96c2.78,0.49,5.72,0.06,8.59,0.04c34.85-0.18,34.19-0.4,23.01,34.2
                      c-9.84,30.45-21.55,60.01-34.78,89.14c-16.35,36-35.42,70.11-61.57,99.92c-17.4,19.84-54.8,19.47-70.64-1.52
                      C1263.32,1717.37,1246.57,1692.22,1227.39,1664.96z M1181,1638.02c0-37.59-30.97-68.13-69.39-68.44
                      c-39.91-0.32-70.47,29.32-70.64,68.53c-0.17,40.05,29.48,70.55,68.63,70.6C1148.99,1708.75,1181,1677.06,1181,1638.02z"/>
                    <path fill="#0C4558" d="M1789.71,1731.79c-62.36,40.59-125.8,34.79-166.48-13.02c-33.51-39.39-38.59-94.86-12.92-141.23
                      c23.49-42.44,74.62-66.73,125.7-59.72c62.34,8.55,102.81,55.14,104.89,117.68c1.18,35.44,0.25,121.87,0.25,121.87h-52.25
                      C1788.9,1757.37,1787.98,1742.35,1789.71,1731.79z M1716.56,1570.56c-37.47,0.05-68.23,30.38-68.34,67.37
                      c-0.11,39.65,30.43,70.81,69,70.38c38.48-0.43,69.67-30.15,69.61-66.33C1786.76,1601.54,1756.23,1570.5,1716.56,1570.56z"/>
                    <path fill="#0C4558" d="M348.93,1662.66c1.12-30.67-1.66-67.99,7.37-104.74c4.04-16.44,10.7-26.12,29.16-21.03
                      c7.85,2.17,13.92-1.03,20.73-4.91c53.43-30.41,124.54-14.62,158.87,35.72c11.58,16.99,17.07,37.03,19.36,57.4
                      c4.56,40.55,1.79,81.33,2.65,122c0.04,1.91,0.06,10.27,0.06,10.27H532.5c0,0-0.13-26.3-0.16-40.86
                      c-0.06-25.22,0.65-50.49-0.54-75.66c-2.63-55.58-54.33-85.99-98.73-58.3c-21.24,13.25-30.16,33.8-30.31,58.29
                      c-0.22,33.82,0,116.53,0,116.53h-53.82C348.93,1757.37,348.93,1685.77,348.93,1662.66z"/>
                    <path fill="#0C4558" d="M679.46,1662.66c1.12-30.67-1.66-67.99,7.37-104.74c4.04-16.44,10.7-26.12,29.16-21.03
                      c7.85,2.17,13.92-1.03,20.73-4.91c53.43-30.41,124.54-14.62,158.87,35.72c11.58,16.99,17.07,37.03,19.36,57.4
                      c4.56,40.55,1.79,81.33,2.65,122c0.04,1.91,0.06,10.27,0.06,10.27h-54.63c0,0-0.13-26.3-0.16-40.86
                      c-0.06-25.22,0.65-50.49-0.54-75.66c-2.63-55.58-54.33-85.99-98.73-58.3c-21.24,13.25-30.16,33.8-30.31,58.29
                      c-0.22,33.82,0,116.53,0,116.53h-53.82C679.45,1757.37,679.46,1685.77,679.46,1662.66z"/>
                    <polygon fill="#0C4558" points="260.54,1757.37 205.43,1757.37 204.5,1522.45 260.55,1522.45"/>
                    <polygon fill="#0C4558" points="1541.37,1757.37 1486.26,1757.37 1485.32,1522.45 1541.38,1522.45"/>
                  </g>
                  <g>
                    <polygon fill="#F6B80C" points="1023,621.05 1023.77,621.99 1152.7,459.68 1023.28,301.71 893.5,459.94 1022.23,621.99"/>
                  </g>
                </g>
              </svg>
            </span>
            <span className="app-brand-text demo menu-text fw-bold">
              {!isCollapsed && "Tenant System"}
            </span>
          </Link>

          <button 
            onClick={onToggle}
            className="layout-menu-toggle menu-link text-large ms-auto hover:bg-menu-hover transition-colors duration-300"
          >
            <X className="d-block d-xl-none ti-sm align-middle" />
            <ChevronRight className="d-none d-xl-block ti-sm align-middle" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 mb-4">
          <div className="input-group input-group-merge">
            <span className="input-group-text">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search [CTRL + K]"
            />
          </div>
        </div>

        {/* Menu Items */}
        <ul className="menu-inner py-1">
          {menuItems.map((item) => {
            if (item.type === 'header') {
              return (
                <li key={item.id} className="menu-header small text-uppercase">
                  <span className="menu-header-text">{item.title}</span>
                </li>
              )
            }

            const isActive = pathname === item.href
            const isHovered = hoveredItem === item.id
            const Icon = item.icon

            return (
              <li 
                key={item.id} 
                className={cn("menu-item", isActive && "active")}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Link href={item.href || '#'} className="menu-link">
                  {Icon && <Icon className={cn(
                    "menu-icon tf-icons transition-all duration-300",
                    isHovered && "scale-110"
                  )} />}
                  <div className="menu-text" data-i18n={item.title}>
                    {item.title}
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>

      </aside>

      {/* Mobile Menu Toggle */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-brand-blue-3 text-white rounded-md hover:bg-brand-blue-4 transition-colors duration-300 hover:scale-105"
      >
        <Menu className="w-5 h-5" />
      </button>
    </>
  )
} 