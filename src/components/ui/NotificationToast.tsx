'use client'

import React, { useEffect, useState } from 'react'
import { useSocket } from '@/contexts/SocketContext'

interface NotificationToastProps {
  autoHideDuration?: number
  maxNotifications?: number
}

export function NotificationToast({ 
  autoHideDuration = 5000, 
  maxNotifications = 3 
}: NotificationToastProps) {
  const { notifications } = useSocket()
  const [visibleNotifications, setVisibleNotifications] = useState<string[]>([])

  useEffect(() => {
    // Show new notifications
    const newNotifications = notifications
      .filter(notification => !visibleNotifications.includes(notification.id))
      .slice(0, maxNotifications)

    if (newNotifications.length > 0) {
      setVisibleNotifications(prev => [
        ...prev,
        ...newNotifications.map(n => n.id)
      ])

      // Auto hide notifications after duration
      newNotifications.forEach(notification => {
        setTimeout(() => {
          setVisibleNotifications(prev => 
            prev.filter(id => id !== notification.id)
          )
        }, autoHideDuration)
      })
    }
  }, [notifications, visibleNotifications, autoHideDuration, maxNotifications])

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

  const formatTime = (timestamp: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(timestamp)
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications
        .filter(notification => visibleNotifications.includes(notification.id))
        .map(notification => (
          <div
            key={notification.id}
            className={`
              ${getBackgroundColor(notification.type)}
              border rounded-lg shadow-lg p-4 max-w-sm w-full
              transform transition-all duration-300 ease-in-out
              hover:scale-105
            `}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {getIcon(notification.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </h4>
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600"
                  >
                    <i className="ti ti-x w-4 h-4" />
                  </button>
                </div>
                
                <p className="mt-1 text-sm text-gray-600">
                  {notification.message}
                </p>
                
                <p className="mt-1 text-xs text-gray-400">
                  {formatTime(notification.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}
