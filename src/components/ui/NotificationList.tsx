'use client'

import React, { useState, useEffect } from 'react'
import { useSocket } from '@/contexts/SocketContext'
import { useOptimizedNotifications } from '@/hooks/useOptimizedNotifications'
import { ApiNotification } from '@/types/notification'

export function NotificationList() {
  const { notifications: socketNotifications, clearNotifications } = useSocket()
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
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days} hari yang lalu`
    if (hours > 0) return `${hours} jam yang lalu`
    if (minutes > 0) return `${minutes} menit yang lalu`
    return 'Baru saja'
  }

  const handleMarkAsRead = async (notification: ApiNotification) => {
    if (!notification.read_at) {
      await markAsRead(notification.id)
    }
  }

  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
    clearNotifications() // Clear socket notifications too
  }

  const handleRefresh = async () => {
    await refreshNotifications()
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        type="button"
        className="nav-link dropdown-toggle hide-arrow"
        onClick={() => setIsOpen(!isOpen)}
        style={{ border: 'none', background: 'none' }}
      >
        <i className="ti ti-bell ti-md"></i>
        {unreadCount > 0 && (
          <span className="badge bg-danger rounded-pill badge-notifications">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <ul className="dropdown-menu dropdown-menu-end py-0 show" style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          left: 'auto',
          zIndex: 9999,
          minWidth: '320px',
          maxWidth: '400px',
          maxHeight: '400px',
          marginTop: '0.5rem',
          boxShadow: '0 0.25rem 1rem rgba(161, 172, 184, 0.45)',
          border: '0 solid #d9dee3',
          borderRadius: '0.5rem',
          overflowY: 'auto'
        }}>
          <li className="dropdown-menu-header border-bottom">
            <div className="dropdown-header d-flex align-items-center py-3">
              <h5 className="text-body mb-0 me-auto">Notifikasi</h5>
              <div className="d-flex align-items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    className="dropdown-notifications-all text-body"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Tandai semua sebagai dibaca"
                    onClick={handleMarkAllAsRead}
                    style={{ border: 'none', background: 'none', padding: '4px' }}
                  >
                    <i className="ti ti-check fs-4"></i>
                  </button>
                )}
                <button
                  type="button"
                  className="dropdown-notifications-all text-body"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Refresh notifikasi"
                  onClick={handleRefresh}
                  style={{ border: 'none', background: 'none', padding: '4px' }}
                >
                  <i className={`ti ti-refresh fs-4 ${loading ? 'ti-spin' : ''}`}></i>
                </button>
              </div>
            </div>
          </li>

          <li className="dropdown-notifications-list scrollable-container">
            <ul className="list-group list-group-flush">
              {loading ? (
                <li className="list-group-item list-group-item-action dropdown-notifications-item">
                  <div className="d-flex justify-content-center py-3">
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <span className="ms-2">Memuat notifikasi...</span>
                  </div>
                </li>
              ) : error ? (
                <li className="list-group-item list-group-item-action dropdown-notifications-item">
                  <div className="d-flex">
                    <div className="flex-shrink-0 me-3">
                      <div className="avatar">
                        <span className="avatar-initial rounded-circle bg-label-danger">
                          <i className="ti ti-alert-circle"></i>
                        </span>
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1 text-danger">Error</h6>
                      <p className="mb-0">{error}</p>
                      <button 
                        type="button" 
                        className="btn btn-sm btn-outline-primary mt-2"
                        onClick={handleRefresh}
                      >
                        Coba Lagi
                      </button>
                    </div>
                  </div>
                </li>
              ) : allNotifications.length === 0 ? (
                <li className="list-group-item list-group-item-action dropdown-notifications-item">
                  <div className="d-flex">
                    <div className="flex-shrink-0 me-3">
                      <div className="avatar">
                        <span className="avatar-initial rounded-circle bg-label-secondary">
                          <i className="ti ti-bell-off"></i>
                        </span>
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1">Tidak ada notifikasi</h6>
                      <p className="mb-0">Notifikasi baru akan muncul di sini</p>
                      <small className="text-muted">Saat ini</small>
                    </div>
                  </div>
                </li>
              ) : (
                allNotifications.map((notification) => {
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
                          <div className="avatar">
                            <span className="avatar-initial rounded-circle bg-label-primary">
                              {getIcon(type)}
                            </span>
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center mb-1">
                            <h6 className="mb-0 me-2">{title}</h6>
                            <span className={`badge ${getBadgeClass(type)}`}>
                              {type}
                            </span>
                          </div>
                          <p className="mb-0">{message}</p>
                          <small className="text-muted">{formatTime(timestamp)}</small>
                        </div>
                        <div className="flex-shrink-0 dropdown-notifications-actions">
                          {!isRead && (
                            <button 
                              type="button" 
                              className="dropdown-notifications-read" 
                              style={{ border: 'none', background: 'none', padding: '4px' }}
                              onClick={(e) => {
                                e.stopPropagation()
                                if (isApiNotification) {
                                  handleMarkAsRead(notification as ApiNotification)
                                }
                              }}
                            >
                              <span className="badge badge-dot bg-primary"></span>
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  )
                })
              )}
            </ul>
          </li>
          <li className="dropdown-menu-footer border-top">
            <a
              href="/notifications"
              className="dropdown-item d-flex justify-content-center text-primary p-2 h-px-40 mb-1 align-items-center"
              style={{ textDecoration: 'none', width: '100%' }}
            >
              Lihat semua notifikasi
            </a>
          </li>
        </ul>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Custom CSS for unread notifications */}
      <style jsx>{`
        .unread {
          background-color: rgba(var(--bs-primary-rgb), 0.05) !important;
          border-left: 3px solid var(--bs-primary) !important;
        }
        
        .unread:hover {
          background-color: rgba(var(--bs-primary-rgb), 0.1) !important;
        }
        
        .dropdown-notifications-item {
          transition: background-color 0.2s ease;
        }
        
        .dropdown-notifications-item:hover {
          background-color: rgba(var(--bs-primary-rgb), 0.05);
        }
      `}</style>
    </div>
  )
}
