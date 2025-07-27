'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Search, 
  Bell, 
  Settings, 
  User,
  ChevronDown,
  Moon,
  Sun
} from 'lucide-react'

interface HeaderProps {
  sidebarCollapsed?: boolean
  onToggleSidebar?: () => void
}

export default function Header({ sidebarCollapsed = false, onToggleSidebar }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, logout } = useAuth()
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    // Implement dark mode toggle logic here
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search logic here
    console.log('Searching for:', searchQuery)
  }

  return (
    <header className={cn(
      "fixed top-0 right-0 z-30 h-16 bg-white border-b border-gray-200 transition-all duration-300",
      sidebarCollapsed ? "left-16" : "left-64"
    )}>
      <div className="flex items-center justify-between h-full px-6">
        {/* Left side - Menu toggle and search */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </form>
        </div>

        {/* Right side - Actions and user menu */}
        <div className="flex items-center space-x-4">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-gray-600" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-md hover:bg-gray-100">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Settings */}
          <button className="p-2 rounded-md hover:bg-gray-100">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>

          {/* User menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700">
                {user?.fullName || 'Admin User'}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {/* Dropdown menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                <a
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profil Saya
                </a>
                <a
                  href="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Pengaturan
                </a>
                <a
                  href="/billing"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Tagihan
                </a>
                <hr className="my-1" />
                <a
                  href="/help"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Bantuan
                </a>
                <button
                  onClick={() => {
                    logout()
                    setShowUserMenu(false)
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 