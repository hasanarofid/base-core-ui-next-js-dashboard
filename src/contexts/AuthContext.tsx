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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LoginUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = async () => {
    try {
      // Coba ambil data user dari API menggunakan cookies
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Penting: untuk mengirim cookies
      })

      if (response.ok) {
        const data = await response.json()
        if (data.user) {
          setUser(data.user)
        }
      } else {
        // Jika tidak ada session yang valid, clear data
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
        // Set user data (token disimpan dalam cookies oleh API)
        setUser(data.data.user)
        console.log('🎯 User set successfully:', data.data.user)
        
        // Redirect to dashboard after successful login
        window.location.href = '/dashboard'
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