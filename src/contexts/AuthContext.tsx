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
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      }
    } catch (error) {
      console.error('Auth check error:', error)
      // Clear invalid data
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
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
      if (data.data && data.data.user && data.data.token) {
        // Store in localStorage (simulating cookies)
        localStorage.setItem('token', data.data.token)
        localStorage.setItem('user', JSON.stringify(data.data.user))
        
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
      const token = localStorage.getItem('token')
      if (token) {
        console.log('📡 Calling logout API...')
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        console.log('✅ Logout API completed')
      }
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      console.log('🧹 Clearing local storage and redirecting...')
      // Clear local storage
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
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