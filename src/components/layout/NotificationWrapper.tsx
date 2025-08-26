'use client'

import React from 'react'
import { NotificationToast } from '@/components/ui/NotificationToast'

interface NotificationWrapperProps {
  children: React.ReactNode
}

export function NotificationWrapper({ children }: NotificationWrapperProps) {
  return (
    <>
      {children}
      <NotificationToast />
    </>
  )
}
