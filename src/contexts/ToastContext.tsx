'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useToast, Toast } from '@/hooks/useToast'
import { ToastContainer, Toast as ToastComponent } from '@/components/ui/Toast'

interface ToastContextType {
  showSuccess: (title: string, message: string, duration?: number) => void
  showError: (title: string, message: string, duration?: number) => void
  showWarning: (title: string, message: string, duration?: number) => void
  showInfo: (title: string, message: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const { toasts, removeToast, showSuccess, showError, showWarning, showInfo } = useToast()

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showWarning, showInfo }}>
      {children}
      <ToastContainer>
        {toasts.map((toast: Toast) => (
          <ToastComponent
            key={toast.id}
            id={toast.id}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            duration={toast.duration}
            onClose={removeToast}
          />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  )
}

export function useToastContext() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider')
  }
  return context
} 