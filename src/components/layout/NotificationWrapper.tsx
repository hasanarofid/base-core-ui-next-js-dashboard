'use client'

import React from 'react'
import { NotificationWatcher } from '@/components/ui/NotificationWatcher'

interface NotificationWrapperProps {
  children: React.ReactNode
}

export function NotificationWrapper({ children }: NotificationWrapperProps) {
  return (
    <>
      {children}
      <NotificationWatcher />
    </>
  )
}
