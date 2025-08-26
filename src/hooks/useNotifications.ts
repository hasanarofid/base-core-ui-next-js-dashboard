import { useState, useEffect, useCallback } from 'react'
import { 
  getNotificationsWithCookies, 
  markNotificationAsReadWithCookies, 
  markAllNotificationsAsReadWithCookies 
} from '@/lib/api'
import { 
  NotificationListResponse, 
  NotificationReadResponse, 
  NotificationReadAllResponse,
  ApiNotification 
} from '@/types/notification'

interface UseNotificationsReturn {
  notifications: ApiNotification[]
  unreadCount: number
  totalCount: number
  loading: boolean
  error: string | null
  fetchNotifications: (page?: number, limit?: number) => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  refreshNotifications: () => Promise<void>
}

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<ApiNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = useCallback(async (page: number = 1, limit: number = 20) => {
    try {
      setLoading(true)
      setError(null)
      
      const response: NotificationListResponse = await getNotificationsWithCookies(page, limit)
      
      setNotifications(response.data.items)
      setTotalCount(response.data.total)
      
      // Hitung notifikasi yang belum dibaca
      const unread = response.data.items.filter(notification => !notification.read_at).length
      setUnreadCount(unread)
      
      console.log('🔔 Fetched notifications:', {
        total: response.data.total,
        unread: unread,
        items: response.data.items.length
      })
    } catch (err) {
      console.error('❌ Error fetching notifications:', err)
      setError(err instanceof Error ? err.message : 'Gagal mengambil notifikasi')
    } finally {
      setLoading(false)
    }
  }, [])

  const markAsRead = useCallback(async (id: string) => {
    try {
      setError(null)
      
      const response: NotificationReadResponse = await markNotificationAsReadWithCookies(id)
      
      // Update notifikasi di state dengan data dari response
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read_at: response.data?.read_at || new Date().toISOString() }
            : notification
        )
      )
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1))
      
      console.log('✅ Marked notification as read:', id, response)
    } catch (err) {
      console.error('❌ Error marking notification as read:', err)
      setError(err instanceof Error ? err.message : 'Gagal menandai notifikasi sebagai dibaca')
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      setError(null)
      
      const response: NotificationReadAllResponse = await markAllNotificationsAsReadWithCookies()
      
      // Refresh notifications untuk mendapatkan data terbaru dari server
      await fetchNotifications(1, 20)
      
      console.log('✅ Marked all notifications as read:', response)
    } catch (err) {
      console.error('❌ Error marking all notifications as read:', err)
      setError(err instanceof Error ? err.message : 'Gagal menandai semua notifikasi sebagai dibaca')
    }
  }, [fetchNotifications])

  const refreshNotifications = useCallback(async () => {
    await fetchNotifications(1, 20)
  }, [fetchNotifications])

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications(1, 20)
  }, [fetchNotifications])

  // Listen for refresh events from socket
  useEffect(() => {
    const handleRefreshEvent = () => {
      console.log('🔄 Received refresh notification event from socket')
      refreshNotifications()
    }

    window.addEventListener('refreshNotifications', handleRefreshEvent)
    
    return () => {
      window.removeEventListener('refreshNotifications', handleRefreshEvent)
    }
  }, [refreshNotifications])

  return {
    notifications,
    unreadCount,
    totalCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
  }
}
