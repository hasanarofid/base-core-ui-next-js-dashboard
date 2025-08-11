'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export default function AuthGuard({ children, requireAuth = true, redirectTo }: AuthGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !user) {
        // Jika memerlukan auth tapi tidak terautentikasi, redirect ke login
        router.push('/login')
      } else if (!requireAuth && user) {
        // Jika tidak memerlukan auth tapi sudah terautentikasi, redirect ke halaman yang ditentukan atau dashboard
        router.push(redirectTo || '/dashboard')
      }
    }
  }, [user, isLoading, requireAuth, redirectTo, router])

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading...</p>
        </div>
      </div>
    )
  }

  // Jika memerlukan auth dan tidak ada user, tampilkan loading (akan redirect)
  if (requireAuth && !user) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Redirecting...</span>
          </div>
          <p className="mt-2 text-muted">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  // Jika tidak memerlukan auth dan ada user, tampilkan loading (akan redirect)
  if (!requireAuth && user) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Redirecting...</span>
          </div>
          <p className="mt-2 text-muted">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 