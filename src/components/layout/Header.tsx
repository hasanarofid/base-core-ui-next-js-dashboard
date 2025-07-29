'use client'

import { useState, useEffect, useRef } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { 
  Search,
  Settings,
  Bell,
  Grid3X3,
  Sun,
  Moon,
  ChevronDown,
  User,
  LogOut,
  Mail,
  MessageSquare
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface HeaderProps {
  sidebarCollapsed?: boolean
  onToggleSidebar?: () => void
}

export default function Header({ sidebarCollapsed, onToggleSidebar }: HeaderProps) {
  const { isDarkMode, toggleDarkMode } = useTheme()
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [isNotificationsDropdownOpen, setIsNotificationsDropdownOpen] = useState(false)
  const userDropdownRef = useRef<HTMLDivElement>(null)
  const notificationsDropdownRef = useRef<HTMLDivElement>(null)

  const notifications = [
    {
      id: 1,
      title: 'New user registered',
      message: 'John Doe has registered as a new tenant',
      time: '2 minutes ago',
      type: 'user'
    },
    {
      id: 2,
      title: 'Payment received',
      message: 'Payment of $299 has been received from Tenant ABC',
      time: '1 hour ago',
      type: 'payment'
    },
    {
      id: 3,
      title: 'System update',
      message: 'System maintenance completed successfully',
      time: '3 hours ago',
      type: 'system'
    }
  ]

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false)
      }
      if (notificationsDropdownRef.current && !notificationsDropdownRef.current.contains(event.target as Node)) {
        setIsNotificationsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen)
    setIsNotificationsDropdownOpen(false)
  }

  const toggleNotificationsDropdown = () => {
    setIsNotificationsDropdownOpen(!isNotificationsDropdownOpen)
    setIsUserDropdownOpen(false)
  }

  return (
    <header className="layout-navbar bg-navbar-theme">
      <div className="container-fluid">
        <div className="navbar-nav align-items-center">
          {/* Left side - Menu Toggle */}
          <div className="nav-item d-flex align-items-center">
            <button
              onClick={onToggleSidebar}
              className="btn-icon me-3 hover:bg-menu-hover transition-all duration-300"
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
          </div>

          {/* Right side */}
          <div className="navbar-nav align-items-center ms-auto">
        

            {/* Theme Toggle */}
            <div className="nav-item me-2">
              <button
                onClick={toggleDarkMode}
                className="btn-icon hover:bg-menu-hover transition-all duration-300"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 transition-transform duration-300 hover:rotate-12" />
                ) : (
                  <Moon className="w-5 h-5 transition-transform duration-300 hover:rotate-12" />
                )}
              </button>
            </div>

            {/* Notifications */}
            <div className="nav-item dropdown me-2" ref={notificationsDropdownRef}>
              <button
                onClick={toggleNotificationsDropdown}
                className="btn-icon position-relative hover:bg-menu-hover transition-all duration-300"
              >
                <Bell className="w-5 h-5" />
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  3
                </span>
              </button>

              {isNotificationsDropdownOpen && (
                <div className="dropdown-menu dropdown-menu-end show" style={{ width: '320px' }}>
                  <div className="dropdown-menu-header d-flex align-items-center justify-content-between">
                    <h6 className="dropdown-menu-title mb-0">Notifications</h6>
                    <button className="btn-icon btn-sm hover:bg-menu-hover transition-all duration-300">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="dropdown-menu-body">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="dropdown-notifications-item hover:bg-menu-hover transition-colors duration-300">
                        <div className="d-flex">
                          <div className="flex-shrink-0">
                            <div className="avatar avatar-sm">
                              <div className="avatar-initial rounded-circle bg-label-primary">
                                {notification.type === 'user' && <User className="w-4 h-4" />}
                                {notification.type === 'payment' && <Mail className="w-4 h-4" />}
                                {notification.type === 'system' && <Settings className="w-4 h-4" />}
                              </div>
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1">{notification.title}</h6>
                            <p className="mb-0">{notification.message}</p>
                            <small className="text-muted">{notification.time}</small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="dropdown-menu-footer">
                    <button className="btn btn-primary btn-sm w-100 hover:bg-brand-blue-4 transition-colors duration-300">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Dropdown */}
            <div className="nav-item dropdown" ref={userDropdownRef}>
              <button
                onClick={toggleUserDropdown}
                className="nav-link d-flex align-items-center dropdown-toggle hide-arrow hover:bg-menu-hover transition-colors duration-300"
              >
                <div className="avatar avatar-sm position-relative">
                  <div className="avatar-initial rounded-circle bg-brand-blue-3 hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-sm font-medium">A</span>
                  </div>
                </div>
                <ChevronDown className={cn(
                  "w-4 h-4 ms-1 transition-transform duration-300",
                  isUserDropdownOpen && "rotate-180"
                )} />
              </button>

              {isUserDropdownOpen && (
                <div className="dropdown-menu dropdown-menu-end show">
                  <div className="dropdown-item">
                    <div className="d-flex">
                      <div className="flex-shrink-0 me-3">
                        <div className="avatar avatar-sm position-relative">
                          <div className="avatar-initial rounded-circle bg-brand-blue-3">
                            <span className="text-white text-sm font-medium">A</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <span className="fw-semibold d-block">Admin User</span>
                        <small className="text-muted">Admin</small>
                      </div>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item hover:bg-menu-hover transition-colors duration-300" href="/profile">
                    <User className="w-4 h-4 me-2" />
                    <span>My Profile</span>
                  </a>
                  <a className="dropdown-item hover:bg-menu-hover transition-colors duration-300" href="/settings">
                    <Settings className="w-4 h-4 me-2" />
                    <span>Settings</span>
                  </a>
                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item hover:bg-red-50 hover:text-red-600 transition-colors duration-300" href="/logout">
                    <LogOut className="w-4 h-4 me-2" />
                    <span>Logout</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
} 