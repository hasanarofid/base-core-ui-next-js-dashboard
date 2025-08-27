'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { useSocket } from '@/contexts/SocketContext'
import { useOptimizedNotifications } from '@/hooks/useOptimizedNotifications'
import { useAudioNotification } from '@/hooks/useAudioNotification'
import { Notification, ApiNotification } from '@/types/notification'

interface NotificationToastProps {
  autoHideDuration?: number
  maxNotifications?: number
}

export function NotificationToast({ 
  autoHideDuration = 5000, 
  maxNotifications = 3 
}: NotificationToastProps) {
  const { notifications: socketNotifications } = useSocket()
  const { notifications: apiNotifications } = useOptimizedNotifications()

  const { playNotification } = useAudioNotification()
  const [visibleNotifications, setVisibleNotifications] = useState<string[]>([])

  // Combine socket and API notifications
  const combinedNotifications = useMemo(() => [...socketNotifications, ...apiNotifications], [socketNotifications, apiNotifications])

  useEffect(() => {
    // Show new notifications
    const newNotifications = combinedNotifications
      .filter((notification: Notification | ApiNotification) => !visibleNotifications.includes(notification.id))
      .slice(0, maxNotifications)

    if (newNotifications.length > 0) {
      console.log('🔔 Showing new notifications:', newNotifications.length)
      setVisibleNotifications(prev => [
        ...prev,
        ...newNotifications.map((n: Notification | ApiNotification) => n.id)
      ])

      // Play audio notification for new notifications
      newNotifications.forEach((notification: Notification | ApiNotification) => {
        // Get notification type for audio
        const notificationData = getNotificationData(notification)
        playNotification(notificationData.type)
      })

      // Auto hide notifications after duration
      newNotifications.forEach((notification: Notification | ApiNotification) => {
        setTimeout(() => {
          setVisibleNotifications(prev => 
            prev.filter(id => id !== notification.id)
          )
        }, autoHideDuration)
      })
    }
  }, [combinedNotifications, visibleNotifications, autoHideDuration, maxNotifications, playNotification])

  const removeNotification = (id: string) => {
    setVisibleNotifications(prev => prev.filter(notificationId => notificationId !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <i className="ti ti-check-circle w-5 h-5 text-green-500" />
      case 'error':
        return <i className="ti ti-alert-circle w-5 h-5 text-red-500" />
      case 'warning':
        return <i className="ti ti-alert-triangle w-5 h-5 text-yellow-500" />
      case 'info':
      default:
        return <i className="ti ti-info-circle w-5 h-5 text-blue-500" />
    }
  }

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200'
    }
  }

  const formatTime = (timestamp: Date | string) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date)
  }

  // Helper function to get notification data
  const getNotificationData = (notification: Notification | ApiNotification) => {
    // Check if it's an API notification
    const isApiNotification = 'notification' in notification
    
    if (isApiNotification) {
      const apiNotif = notification as ApiNotification
      return {
        type: apiNotif.notification.severity,
        title: apiNotif.notification.title,
        message: apiNotif.notification.body,
        timestamp: apiNotif.created_at
      }
    } else {
      const socketNotif = notification as Notification
      return {
        type: socketNotif.type,
        title: socketNotif.title,
        message: socketNotif.message,
        timestamp: socketNotif.timestamp
      }
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {combinedNotifications
        .filter(notification => visibleNotifications.includes(notification.id))
        .map(notification => {
          const notificationData = getNotificationData(notification)
          return (
            <div
              key={notification.id}
              className={`
                ${getBackgroundColor(notificationData.type)}
                border rounded-lg shadow-lg p-4 max-w-sm w-full
                transform transition-all duration-300 ease-in-out
                hover:scale-105
              `}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {getIcon(notificationData.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">
                      {notificationData.title}
                    </h4>
                    <button
                      onClick={() => removeNotification(notification.id)}
                      className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600"
                    >
                      <i className="ti ti-x w-4 h-4" />
                    </button>
                  </div>
                  
                  <p className="mt-1 text-sm text-gray-600">
                    {notificationData.message}
                  </p>
                  
                  <p className="mt-1 text-xs text-gray-400">
                    {formatTime(notificationData.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
    </div>
  )
}
