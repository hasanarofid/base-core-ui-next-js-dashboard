'use client'

import React from 'react'
import { useSocket } from '@/contexts/SocketContext'

export default function RecentNotifications() {
  const { notifications, clearNotifications } = useSocket()

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

  const formatTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)

    if (hours > 0) return `${hours} jam yang lalu`
    if (minutes > 0) return `${minutes} menit yang lalu`
    return 'Baru saja'
  }

  const recentNotifications = notifications.slice(0, 5)

  return (
    <div className="col-lg-6 col-md-12 mb-4">
      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between">
          <h5 className="card-title mb-0">
            <i className="ti ti-bell me-2"></i>
            Notifikasi Terbaru
          </h5>
          {notifications.length > 0 && (
            <button
              onClick={clearNotifications}
              className="btn btn-sm btn-outline-secondary"
              title="Hapus semua notifikasi"
            >
              <i className="ti ti-trash me-1"></i>
              Hapus Semua
            </button>
          )}
        </div>
        <div className="card-body">
          {recentNotifications.length === 0 ? (
            <div className="text-center py-4">
              <i className="ti ti-bell-off ti-lg text-muted mb-3"></i>
              <p className="text-muted mb-0">Tidak ada notifikasi</p>
            </div>
          ) : (
            <div className="list-group list-group-flush">
              {recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="list-group-item list-group-item-action border-0 px-0"
                >
                  <div className="d-flex align-items-start">
                    <div className="flex-shrink-0 me-3 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1 fw-semibold">{notification.title}</h6>
                      <p className="mb-1 text-muted small">{notification.message}</p>
                      <div className="d-flex align-items-center">
                        <i className="ti ti-clock w-3 h-3 text-muted me-1" />
                        <small className="text-muted">{formatTime(notification.timestamp)}</small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {notifications.length > 5 && (
            <div className="text-center mt-3">
              <small className="text-muted">
                Dan {notifications.length - 5} notifikasi lainnya...
              </small>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
