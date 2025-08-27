'use client'

import React, { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import AuthGuard from '@/components/auth/AuthGuard'
import { useOptimizedNotifications } from '@/hooks/useOptimizedNotifications'
// Audio components temporarily hidden
// import { AudioNotificationSettings } from '@/components/ui/AudioNotificationSettings'
// import { SocketStatus } from '@/components/ui/SocketStatus'
// import { AudioTestButton } from '@/components/ui/AudioTestButton'
import { ApiNotification } from '@/types/notification'

export default function AdminNotificationsPage() {
  const { 
    notifications, 
    unreadCount, 
    totalCount, 
    loading, 
    error,
    refreshNotifications, 
    markAsRead, 
    markAllAsRead 
  } = useOptimizedNotifications()
  
  const [currentPage, setCurrentPage] = useState(1)
  const [limit] = useState(20)
  const totalPages = Math.ceil(totalCount / limit)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    refreshNotifications(page, limit)
  }

  const handleMarkAsRead = async (notification: ApiNotification) => {
    if (!notification.read_at) {
      await markAsRead(notification.id)
      
      // Dispatch custom event untuk sinkronisasi dengan icon bell
      const event = new CustomEvent('notificationMarkedAsRead', {
        detail: { notificationId: notification.id, readAt: new Date().toISOString() }
      })
      window.dispatchEvent(event)
    }
  }

  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
    
    // Dispatch custom event untuk sinkronisasi dengan icon bell
    const event = new CustomEvent('allNotificationsMarkedAsRead', {
      detail: { readAt: new Date().toISOString() }
    })
    window.dispatchEvent(event)
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <i className="ti ti-check-circle text-success" />
      case 'error':
        return <i className="ti ti-alert-circle text-danger" />
      case 'warning':
        return <i className="ti ti-alert-triangle text-warning" />
      case 'info':
      default:
        return <i className="ti ti-info-circle text-info" />
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

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
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

  // Listen for events from icon bell to sync table
  useEffect(() => {
    const handleNotificationMarkedAsRead = (event: CustomEvent) => {
      console.log('📢 Received notificationMarkedAsRead event from icon bell:', event.detail)
      // Refresh notifications to sync with icon bell
      refreshNotifications(currentPage, limit)
    }

    const handleAllNotificationsMarkedAsRead = (event: CustomEvent) => {
      console.log('📢 Received allNotificationsMarkedAsRead event from icon bell:', event.detail)
      // Refresh notifications to sync with icon bell
      refreshNotifications(currentPage, limit)
    }

    window.addEventListener('notificationMarkedAsRead', handleNotificationMarkedAsRead as EventListener)
    window.addEventListener('allNotificationsMarkedAsRead', handleAllNotificationsMarkedAsRead as EventListener)

    return () => {
      window.removeEventListener('notificationMarkedAsRead', handleNotificationMarkedAsRead as EventListener)
      window.removeEventListener('allNotificationsMarkedAsRead', handleAllNotificationsMarkedAsRead as EventListener)
    }
  }, [refreshNotifications, currentPage, limit])

  return (
    <AuthGuard requireAuth={true}>
      <DashboardLayout>
        <div className="container-xxl flex-grow-1 container-p-y">
          <h4 className="fw-bold py-3 mb-4">
            <span className="text-muted fw-light">Notifikasi /</span> Riwayat Notifikasi Admin
          </h4>
          
          {/* Audio settings temporarily hidden
          <div className="row">
            <div className="col-12 mb-4">
              <div className="row">
                <div className="col-md-4">
                  <AudioNotificationSettings />
                </div>
                <div className="col-md-4">
                  <SocketStatus showDetails={true} />
                </div>
                <div className="col-md-4">
                  <AudioTestButton />
                </div>
              </div>
            </div>
          </div>
          */}
          
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">
                    <i className="ti ti-bell me-2 text-primary"></i>
                    Notifikasi Admin
                  </h5>
                  <div className="d-flex gap-2">
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={handleMarkAllAsRead}
                      >
                        <i className="ti ti-check me-1"></i>
                        Tandai Semua Dibaca
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => refreshNotifications(currentPage, limit)}
                      disabled={loading}
                    >
                      <i className={`ti ti-refresh me-1 ${loading ? 'ti-spin' : ''}`}></i>
                      Refresh
                    </button>
                  </div>
                </div>
                
                <div className="card-body">
                  {loading && (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2">Memuat notifikasi...</p>
                    </div>
                  )}

                  {error && (
                    <div className="alert alert-danger" role="alert">
                      <i className="ti ti-alert-circle me-2"></i>
                      {error}
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger ms-3"
                        onClick={() => refreshNotifications(currentPage, limit)}
                      >
                        Coba Lagi
                      </button>
                    </div>
                  )}

                  {!loading && !error && notifications.length === 0 && (
                    <div className="text-center py-4">
                      <i className="ti ti-bell-off text-muted" style={{ fontSize: '3rem' }}></i>
                      <h5 className="mt-3 text-muted">Tidak ada notifikasi</h5>
                      <p className="text-muted">Notifikasi admin baru akan muncul di sini</p>
                    </div>
                  )}

                  {!loading && !error && notifications.length > 0 && (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Status</th>
                            <th>Tipe</th>
                            <th>Judul</th>
                            <th>Pesan</th>
                            <th>Waktu</th>
                            <th>Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {notifications.map((notification) => (
                            <tr 
                              key={notification.id}
                              className={!notification.read_at ? 'table-primary' : ''}
                            >
                              <td>
                                {notification.read_at ? (
                                  <span className="badge bg-secondary">Dibaca</span>
                                ) : (
                                  <span className="badge bg-primary">Baru</span>
                                )}
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  {getIcon(notification.notification?.severity || 'info')}
                                  <span className={`badge ms-2 ${getBadgeClass(notification.notification?.severity || 'info')}`}>
                                    {notification.notification?.severity || 'info'}
                                  </span>
                                </div>
                              </td>
                              <td>
                                <strong>{notification.notification?.title || 'No Title'}</strong>
                              </td>
                              <td>
                                <span className="text-muted">{notification.notification?.body || 'No content'}</span>
                              </td>
                              <td>
                                <small className="text-muted">{formatTime(notification.created_at)}</small>
                              </td>
                              <td>
                                {!notification.read_at && (
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => handleMarkAsRead(notification)}
                                    title="Tandai sebagai dibaca"
                                  >
                                    <i className="ti ti-check"></i>
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Pagination */}
                  {!loading && !error && totalPages > 1 && (
                    <nav aria-label="Notification pagination" className="mt-4">
                      <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            <i className="ti ti-chevron-left"></i>
                          </button>
                        </li>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </button>
                          </li>
                        ))}
                        
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            <i className="ti ti-chevron-right"></i>
                          </button>
                        </li>
                      </ul>
                    </nav>
                  )}

                  {/* Summary */}
                  {!loading && !error && notifications.length > 0 && (
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <small className="text-muted">
                        Menampilkan {notifications.length} dari {totalCount} notifikasi
                      </small>
                      <small className="text-muted">
                        Halaman {currentPage} dari {totalPages}
                      </small>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
