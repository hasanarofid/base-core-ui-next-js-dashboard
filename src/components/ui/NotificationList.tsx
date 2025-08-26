'use client'

import React, { useState } from 'react'
import { useSocket } from '@/contexts/SocketContext'

export function NotificationList() {
  const { notifications, clearNotifications } = useSocket()
  const [isOpen, setIsOpen] = useState(false)

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

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-l-green-400'
      case 'error':
        return 'bg-red-50 border-l-red-400'
      case 'warning':
        return 'bg-yellow-50 border-l-yellow-400'
      case 'info':
      default:
        return 'bg-blue-50 border-l-blue-400'
    }
  }

  const formatTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days} hari yang lalu`
    if (hours > 0) return `${hours} jam yang lalu`
    if (minutes > 0) return `${minutes} menit yang lalu`
    return 'Baru saja'
  }

  const unreadCount = notifications.length

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
              {unreadCount > 0 && (
                <button
                  type="button"
                  className="dropdown-notifications-all text-body"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Hapus semua notifikasi"
                  onClick={clearNotifications}
                  style={{ border: 'none', background: 'none', padding: '4px' }}
                >
                  <i className="ti ti-trash fs-4"></i>
                </button>
              )}
            </div>
          </li>

          <li className="dropdown-notifications-list scrollable-container">
            <ul className="list-group list-group-flush">
              {notifications.length === 0 ? (
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
                notifications.map((notification) => (
                  <li key={notification.id} className="list-group-item list-group-item-action dropdown-notifications-item">
                    <div className="d-flex">
                      <div className="flex-shrink-0 me-3">
                        <div className="avatar">
                          <span className="avatar-initial rounded-circle bg-label-primary">
                            {getIcon(notification.type)}
                          </span>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{notification.title}</h6>
                        <p className="mb-0">{notification.message}</p>
                        <small className="text-muted">{formatTime(notification.timestamp)}</small>
                      </div>
                      <div className="flex-shrink-0 dropdown-notifications-actions">
                        <button type="button" className="dropdown-notifications-read" style={{ border: 'none', background: 'none', padding: '4px' }}>
                          <span className="badge badge-dot"></span>
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </li>
          <li className="dropdown-menu-footer border-top">
            <button
              type="button"
              className="dropdown-item d-flex justify-content-center text-primary p-2 h-px-40 mb-1 align-items-center"
              style={{ border: 'none', background: 'none', width: '100%' }}
            >
              Lihat semua notifikasi
            </button>
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
    </div>
  )
}
