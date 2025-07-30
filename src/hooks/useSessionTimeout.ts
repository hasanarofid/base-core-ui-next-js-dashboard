import { useEffect, useRef, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { config } from '@/config'

export function useSessionTimeout() {
  const { logout, isAuthenticated } = useAuth()
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      logout()
    }, config.auth.sessionTimeout)
  }, [logout])

  useEffect(() => {
    if (isAuthenticated) {
      resetTimeout();
    }
  }, [isAuthenticated, resetTimeout]);

  return { resetTimeout }
} 