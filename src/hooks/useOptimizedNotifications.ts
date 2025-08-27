import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { 
  getNotificationsWithCookies,
  markNotificationAsReadWithCookies, 
  markAllNotificationsAsReadWithCookies 
} from '@/lib/api'
import { 
  NotificationListResponse, 
  NotificationReadResponse,
  ApiNotification 
} from '@/types/notification'

interface UseOptimizedNotificationsReturn {
  notifications: ApiNotification[]
  unreadCount: number
  totalCount: number
  loading: boolean
  error: string | null
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  refreshNotifications: (page?: number, limit?: number) => Promise<void>
}

export function useOptimizedNotifications(): UseOptimizedNotificationsReturn {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<ApiNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Refs to prevent infinite loops
  const isRefreshingRef = useRef(false)
  const lastRefreshTimeRef = useRef(0)
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const fetchNotifications = useCallback(async (page: number = 1, limit: number = 20) => {
    // Prevent concurrent refreshes
    if (isRefreshingRef.current) {
      console.log('⏸️ Skipping refresh - already in progress')
      return
    }

    // Prevent too frequent refreshes (minimum 10 seconds between refreshes)
    const now = Date.now()
    if (now - lastRefreshTimeRef.current < 10000) {
      console.log('⏸️ Skipping refresh - too frequent')
      return
    }

    try {
      isRefreshingRef.current = true
      setLoading(true)
      setError(null)
      lastRefreshTimeRef.current = now
      
      console.log('🔄 Fetching notifications for role:', user?.role)
      
      // All roles now use the same endpoint - backend handles role-based filtering
      const response: NotificationListResponse = await getNotificationsWithCookies(page, limit)
      
      setNotifications(response.data.items)
      setTotalCount(response.data.total)
      
      // Hitung notifikasi yang belum dibaca
      const unread = response.data.items.filter(notification => !notification.read_at).length
      setUnreadCount(unread)
      
      console.log('✅ Fetched notifications:', {
        total: response.data.total,
        unread: unread,
        items: response.data.items.length
      })
    } catch (err) {
      console.error('❌ Error fetching notifications:', err)
      setError(err instanceof Error ? err.message : 'Gagal mengambil notifikasi')
    } finally {
      setLoading(false)
      isRefreshingRef.current = false
    }
  }, [user?.role])

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
      
      // Dispatch custom event untuk sinkronisasi dengan komponen lain
      const event = new CustomEvent('notificationMarkedAsRead', {
        detail: { notificationId: id, readAt: response.data?.read_at || new Date().toISOString() }
      })
      window.dispatchEvent(event)
      
      console.log('✅ Marked notification as read:', id)
    } catch (err) {
      console.error('❌ Error marking notification as read:', err)
      setError(err instanceof Error ? err.message : 'Gagal menandai notifikasi sebagai dibaca')
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      setError(null)
      
      await markAllNotificationsAsReadWithCookies()
      
      // Refresh notifications untuk mendapatkan data terbaru dari server
      await fetchNotifications(1, 20)
      
      // Dispatch custom event untuk sinkronisasi dengan komponen lain
      const event = new CustomEvent('allNotificationsMarkedAsRead', {
        detail: { readAt: new Date().toISOString() }
      })
      window.dispatchEvent(event)
      
      console.log('✅ Marked all notifications as read')
    } catch (err) {
      console.error('❌ Error marking all notifications as read:', err)
      setError(err instanceof Error ? err.message : 'Gagal menandai semua notifikasi sebagai dibaca')
    }
  }, [fetchNotifications])

  const refreshNotifications = useCallback(async (page: number = 1, limit: number = 20) => {
    // Clear any pending refresh
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current)
    }
    
    // Debounce refresh calls
    refreshTimeoutRef.current = setTimeout(() => {
      fetchNotifications(page, limit)
    }, 1000)
  }, [fetchNotifications])

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications(1, 20)
  }, [fetchNotifications])

  // Listen for refresh events from socket (debounced)
  useEffect(() => {
    const handleRefreshEvent = () => {
      console.log('📡 Received refresh event from socket')
      refreshNotifications()
    }

    window.addEventListener('refreshNotifications', handleRefreshEvent)
    
    return () => {
      window.removeEventListener('refreshNotifications', handleRefreshEvent)
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
      }
    }
  }, [refreshNotifications])

  // Auto-refresh every 5 minutes (much less frequent)
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('⏰ Auto-refreshing notifications...')
      refreshNotifications()
    }, 300000) // 5 minutes

    return () => clearInterval(interval)
  }, [refreshNotifications])

  return {
    notifications,
    unreadCount,
    totalCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
  }
}
