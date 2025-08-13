'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { LoginUser } from '@/types/auth'

interface AuthContextType {
  user: LoginUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  updateUser: (user: LoginUser) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LoginUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = async () => {
    try {
      setIsLoading(true)
      console.log('🔍 Checking authentication...')
      
      const response = await fetch('/api/auth/me', {
        credentials: 'include', // Penting: untuk mengirim cookies
      })

      if (response.ok) {
        const data = await response.json()
        console.log('🔍 CheckAuth response:', data)
        
        if (data.user) {
          // Map user data untuk memastikan struktur yang benar
          const userData = {
            id: data.user.id,
            fullName: data.user.fullName || data.user.full_name,
            email: data.user.email,
            role: data.user.role,
            tenantId: data.user.tenantId || data.user.tenant_id,
            force_password_change: data.user.forcePasswordChange || data.user.force_password_change || false
          };
          
          console.log('🔍 User data from checkAuth:', userData)
          console.log('🔍 User role:', userData.role)
          console.log('🔍 Force password change:', userData.force_password_change)
          setUser(userData)
        }
      } else {
        // Jika tidak ada session yang valid, clear data
        console.log('❌ CheckAuth failed, clearing user data')
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      
      // Simulate API call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.message || `Login failed with status: ${response.status}`
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log('✅ Login API response:', data)
      
      // API response structure: { message: string, data: { user: User, token: string } }
      if (data.data && data.data.user) {
        // Map user data untuk memastikan struktur yang benar
        const userData = {
          id: data.data.user.id,
          fullName: data.data.user.fullName || data.data.user.full_name,
          email: data.data.user.email,
          role: data.data.user.role,
          tenantId: data.data.user.tenantId || data.data.user.tenant_id,
          force_password_change: data.data.user.forcePasswordChange || data.data.user.force_password_change || false
        };
        
        // Set user data (token disimpan dalam cookies oleh API)
        setUser(userData)
        console.log('🎯 User set successfully:', userData)
        
        // Jangan langsung redirect, biarkan ForcePasswordChangeGuard mengecek kondisi
        // Jika user adalah admin_tenant dan force_password_change = true, modal akan muncul
        // Jika tidak, user akan diarahkan ke dashboard oleh ForcePasswordChangeGuard
        console.log('🔍 User role:', userData.role)
        console.log('🔍 Force password change:', userData.force_password_change)
        
        // Redirect ke dashboard setelah delay singkat untuk memastikan state ter-update
        // ForcePasswordChangeGuard akan mengecek kondisi sebelum redirect
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 100)
      } else {
        throw new Error('Invalid response structure from login API')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    console.log('🔄 Starting logout process...')
    try {
      // Call logout API
      console.log('📡 Calling logout API...')
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Penting: untuk mengirim cookies
      })
      console.log('✅ Logout API completed')
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      console.log('🧹 Clearing user data and redirecting...')
      // Clear user data
      setUser(null)
      
      // Redirect to login page
      console.log('🔄 Redirecting to /login...')
      window.location.href = '/login'
    }
  }

  const updateUser = (updatedUser: LoginUser) => {
    setUser(updatedUser);
  };

  useEffect(() => {
    checkAuth()
  }, [])

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth,
    updateUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 