'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LoginUser, LoginResponse } from '@/types/auth'
import { authAPI } from '@/lib/api'
import { config } from '@/config'

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
  const router = useRouter()

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem(config.auth.tokenKey)
      const userData = localStorage.getItem(config.auth.userKey)
      
      if (!token) {
        setIsLoading(false)
        return
      }

      // Jika ada user data di localStorage, gunakan itu
      if (userData) {
        try {
          const user = JSON.parse(userData) as LoginUser
          setUser(user)
          setIsLoading(false)
          return
        } catch (parseError) {
          console.error('Failed to parse user data:', parseError)
        }
      }

      // Jika tidak ada user data, coba ambil dari API
      try {
        const response = await authAPI.me()
        const userData = response.data as LoginResponse
        setUser(userData.data.user)
      } catch (apiError) {
        console.error('Auth API check failed:', apiError)
        // Jika API gagal, hapus token dan user data
        localStorage.removeItem(config.auth.tokenKey)
        localStorage.removeItem(config.auth.refreshTokenKey)
        localStorage.removeItem(config.auth.userKey)
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem(config.auth.tokenKey)
      localStorage.removeItem(config.auth.refreshTokenKey)
      localStorage.removeItem(config.auth.userKey)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password })
      
      // Handle response structure sesuai dengan Postman
      // Response: { message: "User logged in successfully", data: { user: {...}, token: "..." } }
      const loginData = response.data as LoginResponse
      
      if (!loginData.data || !loginData.data.token || !loginData.data.user) {
        throw new Error('Response tidak valid dari server')
      }

      const { token, user } = loginData.data

      localStorage.setItem(config.auth.tokenKey, token)
      localStorage.setItem(config.auth.userKey, JSON.stringify(user))
      setUser(user)
      
      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error: unknown) {
      console.error('Login error:', error)
      
      // Handle specific error messages from API
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } }
        if (apiError.response?.data?.message) {
          throw new Error(apiError.response.data.message)
        }
      }
      
      if (error instanceof Error) {
        throw new Error(error.message)
      } else {
        throw new Error('Terjadi kesalahan saat login')
      }
    }
  }

  const logout = async () => {
    try {
      // Call logout API terlebih dahulu
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      // Clear local storage dan state
      localStorage.removeItem(config.auth.tokenKey)
      localStorage.removeItem(config.auth.refreshTokenKey)
      localStorage.removeItem(config.auth.userKey)
      setUser(null)
      
      // Redirect ke login
      router.push('/login')
    }
  }

  const updateUser = (user: LoginUser) => {
    // Update localStorage
    localStorage.setItem(config.auth.userKey, JSON.stringify(user))
    
    // Update state
    setUser(user)
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