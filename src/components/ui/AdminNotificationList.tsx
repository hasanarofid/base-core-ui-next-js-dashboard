'use client'

import React, { useState, useEffect } from 'react'
import { useSocket } from '@/contexts/SocketContext'
import { useOptimizedNotifications } from '@/hooks/useOptimizedNotifications'
import { ApiNotification } from '@/types/notification'

export function AdminNotificationList() {
  const { notifications: socketNotifications } = useSocket()
  const { 
    notifications: apiNotifications, 
    unreadCount, 
    loading, 
    error,
    markAsRead, 
    markAllAsRead, 
    refreshNotifications 
  } = useOptimizedNotifications()
  const [isOpen, setIsOpen] = useState(false)

  // Listen for events from notification pages to sync icon bell
  useEffect(() => {
    const handleNotificationMarkedAsRead = (event: CustomEvent) => {
      console.log('📢 Received notificationMarkedAsRead event from notification page:', event.detail)
      // Refresh notifications to sync with notification page
      refreshNotifications()
    }

    const handleAllNotificationsMarkedAsRead = (event: CustomEvent) => {
      console.log('📢 Received allNotificationsMarkedAsRead event from notification page:', event.detail)
      // Refresh notifications to sync with notification page
      refreshNotifications()
    }

    window.addEventListener('notificationMarkedAsRead', handleNotificationMarkedAsRead as EventListener)
    window.addEventListener('allNotificationsMarkedAsRead', handleAllNotificationsMarkedAsRead as EventListener)

    return () => {
      window.removeEventListener('notificationMarkedAsRead', handleNotificationMarkedAsRead as EventListener)
      window.removeEventListener('allNotificationsMarkedAsRead', handleAllNotificationsMarkedAsRead as EventListener)
    }
  }, [refreshNotifications])

  // Combine socket notifications with API notifications
  const allNotifications = [...socketNotifications, ...apiNotifications]

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <i className="ti ti-check-circle w-4 h-4 text-green-500" />
      case 'error':
        return <i className="ti ti-alert-circle w-4 h-4 text-red-500" />
      case 'warning':
        return <i className="ti ti-alert-triangle w-4 h-4 text-yellow-500" />
      case 'info':
      default:
        return <i className="ti ti-info-circle w-4 h-4 text-blue-500" />
    }
  }

  const getBadgeClass = (severity: string) => {
    switch (severity) {
      case 'success':
        return 'bg-success text-white'
      case 'error':
        return 'bg-danger text-white'
      case 'warning':
        return 'bg-warning text-dark'
      case 'info':
      default:
        return 'bg-info text-white'
    }
  }

  // getBackgroundColor function removed - unused

  const formatTime = (timestamp: Date | string) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) {
      return 'Baru saja'
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} menit yang lalu`
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60)
      return `${hours} jam yang lalu`
    } else {
      const days = Math.floor(diffInMinutes / 1440)
      return `${days} hari yang lalu`
    }
  }

  const handleMarkAsRead = async (notification: ApiNotification) => {
    if (!notification.read_at) {
      await markAsRead(notification.id)
    }
  }

  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
  }

  const handleRefresh = async () => {
    await refreshNotifications()
  }

  return (
    <div className="dropdown">
      <button
        type="button"
        className="nav-link dropdown-toggle hide-arrow position-relative"
        onClick={() => setIsOpen(!isOpen)}
        style={{ border: 'none', background: 'none' }}
      >
        <i className="ti ti-bell ti-sm"></i>
        {unreadCount > 0 && (
          <span className="badge rounded-pill badge-notifications bg-danger">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="dropdown-menu dropdown-menu-end py-0 show" style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          left: 'auto',
          zIndex: 9999,
          minWidth: '380px',
          maxWidth: '400px',
          marginTop: '0.5rem',
          boxShadow: '0 0.25rem 1rem rgba(161, 172, 184, 0.45)',
          border: '0 solid #d9dee3',
          borderRadius: '0.5rem'
        }}>
          <div className="dropdown-menu-header border-bottom">
            <div className="dropdown-header d-flex align-items-center py-3">
              <h6 className="mb-0 me-auto">Notifikasi Admin</h6>
              <div className="dropdown-actions">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary me-2"
                  onClick={handleRefresh}
                  disabled={loading}
                  style={{ border: 'none', background: 'none', padding: '0.25rem 0.5rem' }}
                >
                  <i className={`ti ti-refresh ti-sm ${loading ? 'ti-spin' : ''}`}></i>
                </button>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={handleMarkAllAsRead}
                    style={{ border: 'none', background: 'none', padding: '0.25rem 0.5rem' }}
                  >
                    <i className="ti ti-check ti-sm"></i>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="dropdown-notifications-list scrollable-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 mb-0 text-muted small">Memuat notifikasi...</p>
              </div>
            ) : error ? (
              <div className="text-center py-4">
                <i className="ti ti-alert-circle text-danger mb-2" style={{ fontSize: '2rem' }}></i>
                <p className="text-danger mb-0">{error}</p>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary mt-2"
                  onClick={handleRefresh}
                  style={{ border: 'none', background: 'none', padding: '0.25rem 0.5rem' }}
                >
                  Coba Lagi
                </button>
              </div>
            ) : allNotifications.length === 0 ? (
              <div className="text-center py-4">
                <i className="ti ti-bell-off text-muted mb-2" style={{ fontSize: '2rem' }}></i>
                <p className="text-muted mb-0">Tidak ada notifikasi</p>
              </div>
            ) : (
              <ul className="list-group list-group-flush">
                {allNotifications.map((notification) => {
                  // Check if it's an API notification
                  const isApiNotification = 'notification' in notification
                  const isRead = isApiNotification ? !!notification.read_at : false
                  const timestamp = isApiNotification ? notification.created_at : notification.timestamp
                  const title = isApiNotification ? notification.notification.title : notification.title
                  const message = isApiNotification ? notification.notification.body : notification.message
                  const type = isApiNotification ? notification.notification.severity : notification.type
                  
                  return (
                    <li 
                      key={notification.id} 
                      className={`list-group-item list-group-item-action dropdown-notifications-item ${!isRead ? 'unread' : ''}`}
                      onClick={() => isApiNotification && !isRead ? handleMarkAsRead(notification as ApiNotification) : undefined}
                      style={{ cursor: isApiNotification && !isRead ? 'pointer' : 'default' }}
                    >
                      <div className="d-flex">
                        <div className="flex-shrink-0 me-3">
                          {getIcon(type)}
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1 fw-semibold">{title}</h6>
                          <p className="mb-1 text-muted small">{message}</p>
                          <div className="d-flex align-items-center">
                            <i className="ti ti-clock w-3 h-3 text-muted me-1" />
                            <small className="text-muted">{formatTime(timestamp)}</small>
                            {!isRead && (
                              <span className={`badge rounded-pill ms-auto ${getBadgeClass(type)}`}>
                                Baru
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {allNotifications.length > 0 && (
            <div className="dropdown-menu-footer border-top">
              <a
                href="/admin/notifications"
                className="dropdown-item d-flex justify-content-center py-3"
              >
                Lihat Semua Notifikasi
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
