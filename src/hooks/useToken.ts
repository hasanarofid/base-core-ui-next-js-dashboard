'use client'

import { useEffect, useState } from 'react'

export function useToken() {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // Get token from localStorage
    const getToken = () => {
      if (typeof window !== 'undefined') {
        // Try localStorage first
        let token = localStorage.getItem('auth_token')
        
        // If not in localStorage, try to get from cookies
        if (!token) {
          const cookies = document.cookie.split(';')
          const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='))
          if (tokenCookie) {
            token = tokenCookie.split('=')[1]
            // Save to localStorage for future use
            if (token) {
              localStorage.setItem('auth_token', token)
            }
          }
        }
        
        return token
      }
      return null
    }

    setToken(getToken())

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token') {
        setToken(e.newValue)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const saveToken = (newToken: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', newToken)
      setToken(newToken)
    }
  }

  const removeToken = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      setToken(null)
    }
  }

  return { token, saveToken, removeToken }
}
