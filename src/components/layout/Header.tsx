'use client'

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface HeaderProps {
  onToggleSidebar?: () => void
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { isDarkMode, toggleDarkMode } = useTheme()
  const { logout, user } = useAuth()
  const router = useRouter()
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [isNotificationsDropdownOpen, setIsNotificationsDropdownOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const userDropdownRef = React.useRef<HTMLLIElement>(null)
  const notificationsDropdownRef = React.useRef<HTMLLIElement>(null)

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

  const toggleUserDropdown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsUserDropdownOpen(!isUserDropdownOpen)
    setIsNotificationsDropdownOpen(false)
  }

  const toggleNotificationsDropdown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsNotificationsDropdownOpen(!isNotificationsDropdownOpen)
    setIsUserDropdownOpen(false)
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      setIsUserDropdownOpen(false)
      
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
      // Fallback: clear local storage dan redirect manual
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      router.push('/login')
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return 'A'
    const name = user.fullName || user.email || 'Admin'
    return name.charAt(0).toUpperCase()
  }

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return 'Admin User'
    return user.fullName || user.email || 'Admin User'
  }

  // Get user role
  const getUserRole = () => {
    if (!user) return 'Admin'
    return user.role || 'Admin'
  }

  return (
    <nav
      className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
      id="layout-navbar">
      
      {/* Menu Toggle for Mobile */}
      <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
        <button 
          className="nav-item nav-link px-0 me-xl-4" 
          onClick={onToggleSidebar}
          type="button"
        >
          <i className="ti ti-menu-2 ti-sm"></i>
        </button>
      </div>

      <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
        {/* Search */}
        <div className="navbar-nav align-items-center">
          <div className="nav-item navbar-search-wrapper mb-0">
            <div className="nav-item nav-link d-flex align-items-center px-0">
              <span className="app-brand-text demo d-inline-block menu-text fw-bold text-primary">Innovia - Tenant App</span>
            </div>
          </div>
        </div>

        <ul className="navbar-nav flex-row align-items-center ms-auto">
          {/* Style Switcher */}
          <li className="nav-item me-2 me-xl-0">
            <a 
              className="nav-link style-switcher-toggle hide-arrow" 
              href="javascript:void(0);"
              onClick={toggleDarkMode}
            >
              {isDarkMode ? (
                <i className="ti ti-sun ti-md"></i>
              ) : (
                <i className="ti ti-moon ti-md"></i>
              )}
            </a>
          </li>

          {/* Notifications */}
          <li className="nav-item dropdown-notifications navbar-dropdown dropdown me-3 me-xl-1" ref={notificationsDropdownRef}>
            <a
              className="nav-link dropdown-toggle hide-arrow"
              href="javascript:void(0);"
              onClick={toggleNotificationsDropdown}
            >
              <i className="ti ti-bell ti-md"></i>
              <span className="badge bg-danger rounded-pill badge-notifications">3</span>
            </a>

            {isNotificationsDropdownOpen && (
              <ul className="dropdown-menu dropdown-menu-end py-0 show" style={{ display: 'block', position: 'absolute', zIndex: 1000 }}>
                <li className="dropdown-menu-header border-bottom">
                  <div className="dropdown-header d-flex align-items-center py-3">
                    <h5 className="text-body mb-0 me-auto">Notifications</h5>
                    <a
                      href="javascript:void(0)"
                      className="dropdown-notifications-all text-body"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Mark all as read"
                    >
                      <i className="ti ti-mail-opened fs-4"></i>
                    </a>
                  </div>
                </li>
                <li className="dropdown-notifications-list scrollable-container">
                  <ul className="list-group list-group-flush">
                    {notifications.map((notification) => (
                      <li key={notification.id} className="list-group-item list-group-item-action dropdown-notifications-item">
                        <div className="d-flex">
                          <div className="flex-shrink-0 me-3">
                            <div className="avatar">
                              <span className="avatar-initial rounded-circle bg-label-primary">
                                {notification.type === 'user' && <i className="ti ti-user"></i>}
                                {notification.type === 'payment' && <i className="ti ti-credit-card"></i>}
                                {notification.type === 'system' && <i className="ti ti-settings"></i>}
                              </span>
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1">{notification.title}</h6>
                            <p className="mb-0">{notification.message}</p>
                            <small className="text-muted">{notification.time}</small>
                          </div>
                          <div className="flex-shrink-0 dropdown-notifications-actions">
                            <a href="javascript:void(0)" className="dropdown-notifications-read">
                              <span className="badge badge-dot"></span>
                            </a>
                            <a href="javascript:void(0)" className="dropdown-notifications-archive">
                              <span className="ti ti-x"></span>
                            </a>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="dropdown-menu-footer border-top">
                  <a
                    href="javascript:void(0);"
                    className="dropdown-item d-flex justify-content-center text-primary p-2 h-px-40 mb-1 align-items-center">
                    View all notifications
                  </a>
                </li>
              </ul>
            )}
          </li>

          {/* User Dropdown */}
          <li className="nav-item navbar-dropdown dropdown-user dropdown" ref={userDropdownRef}>
            <a 
              className="nav-link dropdown-toggle hide-arrow" 
              href="javascript:void(0);"
              onClick={toggleUserDropdown}
            >
              <div className="avatar avatar-online">
                <div className="avatar-initial rounded-circle bg-label-primary">
                  <span className="text-white text-sm font-medium">{getUserInitials()}</span>
                </div>
              </div>
            </a>

            {isUserDropdownOpen && (
              <ul className="dropdown-menu dropdown-menu-end show" style={{ display: 'block', position: 'absolute', zIndex: 1000 }}>
                <li>
                  <a className="dropdown-item" href="javascript:void(0);">
                    <div className="d-flex">
                      <div className="flex-shrink-0 me-3">
                        <div className="avatar avatar-online">
                          <div className="avatar-initial rounded-circle bg-label-primary">
                            <span className="text-white text-sm font-medium">{getUserInitials()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <span className="fw-semibold d-block">{getUserDisplayName()}</span>
                        <small className="text-muted">{getUserRole()}</small>
                      </div>
                    </div>
                  </a>
                </li>
                <li>
                  <div className="dropdown-divider"></div>
                </li>
                <li>
                  <a className="dropdown-item" href="/profile">
                    <i className="ti ti-user-check me-2 ti-sm"></i>
                    <span className="align-middle">My Profile</span>
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="/settings">
                    <i className="ti ti-settings me-2 ti-sm"></i>
                    <span className="align-middle">Settings</span>
                  </a>
                </li>
                <li>
                  <div className="dropdown-divider"></div>
                </li>
                <li>
                  <a 
                    className="dropdown-item" 
                    href="javascript:void(0);"
                    onClick={handleLogout}
                  >
                    <i className={cn("ti ti-logout me-2 ti-sm", isLoggingOut && "ti-spin")}></i>
                    <span className="align-middle">{isLoggingOut ? 'Logging out...' : 'Log Out'}</span>
                  </a>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>

      {/* Search Small Screens */}
      <div className="navbar-search-wrapper search-input-wrapper d-none">
        <input
          type="text"
          className="form-control search-input container-xxl border-0"
          placeholder="Search..."
          aria-label="Search..." />
        <i className="ti ti-x ti-sm search-toggler cursor-pointer"></i>
      </div>
    </nav>
  )
} 