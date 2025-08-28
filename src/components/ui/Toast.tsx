'use client'

import React, { useEffect, useState } from 'react'

interface ToastProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  onClose: (id: string) => void
}

export function Toast({ id, type, title, message, duration = 10000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show toast with animation
    const showTimer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    // Auto hide toast
    const hideTimer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose(id), 300) // Wait for animation to complete
    }, duration)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [id, duration, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <i className="ti ti-check-circle ti-xs me-2 text-success" />
      case 'error':
        return <i className="ti ti-alert-circle ti-xs me-2 text-danger" />
      case 'warning':
        return <i className="ti ti-alert-triangle ti-xs me-2 text-warning" />
      case 'info':
      default:
        return <i className="ti ti-info-circle ti-xs me-2 text-info" />
    }
  }

  const getToastClass = () => {
    const baseClass = 'bs-toast toast fade'
    const animationClass = isVisible ? 'show' : ''
    return `${baseClass} ${animationClass}`
  }

  return (
    <div
      className={getToastClass()}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{
        transition: 'all 0.3s ease-in-out',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
        backgroundColor: '#ffffff',
        border: '1px solid #dee2e6',
        boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)'
      }}
    >
      <div className="toast-header">
        {getIcon()}
        <div className="me-auto fw-semibold">{title}</div>
        <small className="text-muted">Baru saja</small>
        <button
          type="button"
          className="btn-close"
          onClick={() => {
            setIsVisible(false)
            setTimeout(() => onClose(id), 300)
          }}
          aria-label="Close"
        />
      </div>
      <div className="toast-body">{message}</div>
    </div>
  )
}

interface ToastContainerProps {
  children: React.ReactNode
}

export function ToastContainer({ children }: ToastContainerProps) {
  return (
    <div
      className="toast-container position-fixed top-0 end-0 p-3"
      style={{ zIndex: 9999 }}
    >
      {children}
    </div>
  )
} 