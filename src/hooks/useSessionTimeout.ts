import { useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { config } from '@/config'

export function useSessionTimeout() {
  const { logout } = useAuth()
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      logout()
    }, config.auth.sessionTimeout)
  }

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    
    const handleActivity = () => {
      resetTimeout()
    }

    // Set initial timeout
    resetTimeout()

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true)
    })

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true)
      })
    }
  }, [logout])

  return { resetTimeout }
} 