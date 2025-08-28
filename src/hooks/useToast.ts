import { useState, useCallback } from 'react'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id }
    setToasts(prev => [...prev, newToast])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const showSuccess = useCallback((title: string, message: string, duration: number = 10000) => {
    addToast({ type: 'success', title, message, duration })
  }, [addToast])

  const showError = useCallback((title: string, message: string, duration: number = 10000) => {
    addToast({ type: 'error', title, message, duration })
  }, [addToast])

  const showWarning = useCallback((title: string, message: string, duration: number = 10000) => {
    addToast({ type: 'warning', title, message, duration })
  }, [addToast])

  const showInfo = useCallback((title: string, message: string, duration: number = 10000) => {
    addToast({ type: 'info', title, message, duration })
  }, [addToast])

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }
}
