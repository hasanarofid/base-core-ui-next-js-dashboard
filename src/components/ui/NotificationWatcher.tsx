'use client'

import React from 'react'
import { useOptimizedNotifications } from '@/hooks/useOptimizedNotifications'
import { useSocket } from '@/contexts/SocketContext'

export function NotificationWatcher() {
  // This component doesn't render anything, it just watches for notifications
  const { notifications: apiNotifications, unreadCount } = useOptimizedNotifications()
  const { notifications: socketNotifications } = useSocket()
  
  // Combine notifications for watching
  const combinedNotifications = [...socketNotifications, ...apiNotifications]
  
  // Log for debugging (can be removed in production)
  React.useEffect(() => {
    console.log('👀 NotificationWatcher: Total notifications:', combinedNotifications.length, 'Unread:', unreadCount)
  }, [combinedNotifications.length, unreadCount])
  
  return null
}
