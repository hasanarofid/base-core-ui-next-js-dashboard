'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export default function AuthGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = '/dashboard' 
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        // Jika memerlukan auth tapi tidak terautentikasi, redirect ke login
        router.push('/login')
      } else if (!requireAuth && isAuthenticated) {
        // Jika tidak memerlukan auth tapi sudah terautentikasi, redirect ke dashboard
        router.push(redirectTo)
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router])

  // Tampilkan loading spinner saat mengecek autentikasi
  if (isLoading) {
    return (
      <LoadingSpinner 
        size="lg" 
        text="Loading..." 
        className="min-h-screen" 
      />
    )
  }

  // Jika sudah terautentikasi dan memerlukan auth, tampilkan children
  if (requireAuth && isAuthenticated) {
    return <>{children}</>
  }

  // Jika tidak memerlukan auth dan tidak terautentikasi, tampilkan children
  if (!requireAuth && !isAuthenticated) {
    return <>{children}</>
  }

  // Jika kondisi tidak sesuai, tampilkan loading (akan redirect)
  return (
    <LoadingSpinner 
      size="lg" 
      text="Redirecting..." 
      className="min-h-screen" 
    />
  )
} 