import React, { useState, useEffect, createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api'
import { LoginUser, LoginResponse, AuthState, LoginCredentials } from '@/types/auth'
import { config } from '@/config'

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  updateUser: (user: LoginUser) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  })
  const router = useRouter()

  // Load user data from localStorage on mount
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const token = localStorage.getItem(config.auth.tokenKey)
        const userData = localStorage.getItem(config.auth.userKey)
        
        if (token && userData) {
          const user = JSON.parse(userData) as LoginUser
          setAuthState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }))
        }
      } catch (error) {
        console.error('Error loading user from storage:', error)
        setAuthState(prev => ({ ...prev, isLoading: false }))
      }
    }

    loadUserFromStorage()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }))
      
      const response = await authAPI.login(credentials)
      const loginData = response.data as LoginResponse
      
      const { user, token } = loginData.data
      
      // Save to localStorage
      localStorage.setItem(config.auth.tokenKey, token)
      localStorage.setItem(config.auth.userKey, JSON.stringify(user))
      
      // Update state
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      })
      
      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      setAuthState(prev => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem(config.auth.tokenKey)
    localStorage.removeItem(config.auth.userKey)
    localStorage.removeItem(config.auth.refreshTokenKey)
    
    // Update state
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    })
    
    // Redirect to login
    router.push('/login')
  }

  const updateUser = (user: LoginUser) => {
    // Update localStorage
    localStorage.setItem(config.auth.userKey, JSON.stringify(user))
    
    // Update state
    setAuthState(prev => ({
      ...prev,
      user,
    }))
  }

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 