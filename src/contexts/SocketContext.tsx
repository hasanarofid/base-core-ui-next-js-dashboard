'use client'

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from './AuthContext'
import { useToken } from '@/hooks/useToken'
import { Notification } from '@/types/notification'
// Remove toast context import to avoid circular dependency

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
  notifications: Notification[]
  clearNotifications: () => void
  refreshNotifications: () => void
  refreshTransactions: () => void
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { user, isAuthenticated } = useAuth()
  const { token } = useToken()
  // Toast functions will be passed as props or handled differently to avoid circular dependency

  // Event listeners will be added directly in the useEffect

  // Callback untuk refresh notifikasi dari komponen lain
  const refreshNotifications = useCallback(() => {
    // Trigger event untuk refresh notifikasi
    const event = new CustomEvent('refreshNotifications')
    window.dispatchEvent(event)
  }, [])

  // Callback untuk refresh transactions dari komponen lain
  const refreshTransactions = useCallback(() => {
    // Trigger event untuk refresh transactions
    const event = new CustomEvent('refreshTransactions')
    window.dispatchEvent(event)
  }, [])

  useEffect(() => {
    console.log('🔍 SocketContext useEffect triggered:', {
      isAuthenticated,
      user: user?.email,
      hasToken: !!token,
      tokenPreview: token ? token.substring(0, 20) + '...' : 'none'
    })

    if (!isAuthenticated || !user) {
      console.log('🚫 User not authenticated, disconnecting socket')
      // Disconnect socket if user is not authenticated
      if (socket) {
        socket.disconnect()
        setSocket(null)
        setIsConnected(false)
      }
      return
    }

    // Disconnect existing socket before creating new one
    if (socket) {
      console.log('🔄 Disconnecting existing socket before creating new one')
      socket.disconnect()
      setSocket(null)
      setIsConnected(false)
    }

    // Use token from useToken hook
    if (!token) {
      console.warn('No authentication token found for Socket.IO connection')
      
      // Try to get token from cookies as fallback
      const cookies = document.cookie.split(';')
      const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='))
      if (tokenCookie) {
        const cookieToken = tokenCookie.split('=')[1]
        console.log('🔑 Found token in cookies, using for Socket.IO connection')
        
        // Create socket connection with cookie token
        const newSocket = io(process.env.NEXT_PUBLIC_SOCKET || 'http://31.97.61.121:3032', {
          path: '/realtime',
          auth: {
            token: cookieToken
          },
          transports: ['websocket', 'polling'],
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: 10,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          timeout: 20000,
          forceNew: true,
        })
        
        // Add basic connection event listeners
        newSocket.on('connect', () => {
          console.log('🔌 Socket.IO connected successfully with cookie token')
          setIsConnected(true)
        })

        newSocket.on('disconnect', (reason) => {
          console.log('🔌 Socket.IO disconnected:', reason)
          setIsConnected(false)
        })

        newSocket.on('reconnect', (attemptNumber) => {
          console.log('🔌 Socket.IO reconnected after', attemptNumber, 'attempts')
          setIsConnected(true)
        })

        newSocket.on('reconnect_attempt', (attemptNumber) => {
          console.log('🔄 Socket.IO reconnection attempt:', attemptNumber)
        })

        newSocket.on('reconnect_error', (error) => {
          console.error('❌ Socket.IO reconnection error:', error)
        })

        newSocket.on('connect_error', (error) => {
          console.error('🔌 Socket.IO connection error:', error)
          setIsConnected(false)
          
          // Try to reconnect with different transport if websocket fails
          if (error.message.includes('websocket')) {
            console.log('🔄 Trying to reconnect with polling transport...')
            newSocket.io.opts.transports = ['polling']
            newSocket.connect()
          }
        })

        setSocket(newSocket)
        return
      }
      
      console.error('❌ No token found in localStorage or cookies')
      return
    }

    console.log('🔌 Creating Socket.IO connection with token:', token.substring(0, 20) + '...')
    
    // Create socket connection with better error handling
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET || 'http://31.97.61.121:3032', {
      path: '/realtime',
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      forceNew: true,
    })

    console.log('🔌 Socket.IO instance created, waiting for connection...')

    // Basic connection event listeners
    newSocket.on('connecting', () => {
      console.log('🔄 Socket.IO connecting...')
    })

    newSocket.on('connect_timeout', () => {
      console.error('⏰ Socket.IO connection timeout')
      setIsConnected(false)
    })

    newSocket.on('connect', () => {
      console.log('✅ Socket.IO connected successfully!')
      console.log('🔌 Socket ID:', newSocket.id)
      console.log('🔌 Transport:', newSocket.io.engine.transport.name)
      setIsConnected(true)
    })

    newSocket.on('disconnect', (reason) => {
      console.log('🔌 Socket.IO disconnected:', reason)
      setIsConnected(false)
    })

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('🔌 Socket.IO reconnected after', attemptNumber, 'attempts')
      setIsConnected(true)
    })

    newSocket.on('reconnect_attempt', (attemptNumber) => {
      console.log('🔄 Socket.IO reconnection attempt:', attemptNumber)
    })

    newSocket.on('reconnect_error', (error) => {
      console.error('❌ Socket.IO reconnection error:', error)
    })

    newSocket.on('connect_error', (error) => {
      console.error('❌ Socket.IO connection error:', error)
      console.error('❌ Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      })
      setIsConnected(false)
      
      // Try to reconnect with different transport if websocket fails
      if (error.message.includes('websocket')) {
        console.log('🔄 Trying to reconnect with polling transport...')
        newSocket.io.opts.transports = ['polling']
        newSocket.connect()
      }
    })

    // Listen for transaction events
    newSocket.on('transaction_created', (data) => {
      console.log('💰 Transaction created notification:', data)
      const notification: Notification = {
        id: `transaction_created_${Date.now()}_${Math.random()}`,
        type: 'success',
        title: 'Transaksi Baru',
        message: `Transaksi baru telah dibuat dengan ID: ${data.transaction_id || data.id || 'N/A'}`,
        timestamp: new Date(),
        data: data
      }
      setNotifications(prev => [notification, ...prev])
      refreshNotifications()
      refreshTransactions()
      
      // Toast notification will be handled at component level
    })

    // Listen for general transaction event (might be sent from backend)
    newSocket.on('transaction', (data) => {
      console.log('💰 General transaction event:', data)
      refreshNotifications()
    })

    // Listen for transaction:created event (with colon)
    newSocket.on('transaction:created', (data) => {
      console.log('💰 Transaction:created event:', data)
      refreshNotifications()
    })

    // Listen for notify:new event (with colon)
    newSocket.on('notify:new', (data) => {
      console.log('📢 Notify:new event:', data)
      refreshNotifications()
    })

    newSocket.on('transaction_updated', (data) => {
      console.log('💰 Transaction updated notification:', data)
      const notification: Notification = {
        id: `transaction_updated_${Date.now()}_${Math.random()}`,
        type: 'info',
        title: 'Transaksi Diperbarui',
        message: `Transaksi dengan ID ${data.transaction_id || data.id || 'N/A'} telah diperbarui`,
        timestamp: new Date(),
        data: data
      }
      setNotifications(prev => [notification, ...prev])
      refreshNotifications()
      refreshTransactions()
      
      // Toast notification will be handled at component level
    })

    newSocket.on('transaction_completed', (data) => {
      console.log('💰 Transaction completed notification:', data)
      const notification: Notification = {
        id: `transaction_completed_${Date.now()}_${Math.random()}`,
        type: 'success',
        title: 'Transaksi Selesai',
        message: `Transaksi dengan ID ${data.transaction_id || data.id || 'N/A'} telah selesai`,
        timestamp: new Date(),
        data: data
      }
      setNotifications(prev => [notification, ...prev])
      refreshNotifications()
      refreshTransactions()
      
      // Toast notification will be handled at component level
    })

    newSocket.on('transaction_failed', (data) => {
      console.log('💰 Transaction failed notification:', data)
      const notification: Notification = {
        id: `transaction_failed_${Date.now()}_${Math.random()}`,
        type: 'error',
        title: 'Transaksi Gagal',
        message: `Transaksi dengan ID ${data.transaction_id || data.id || 'N/A'} gagal: ${data.reason || 'Unknown error'}`,
        timestamp: new Date(),
        data: data
      }
      setNotifications(prev => [notification, ...prev])
      refreshNotifications()
      refreshTransactions()
      
      // Toast notification will be handled at component level
    })

    // Listen for payment events
    newSocket.on('payment_received', (data) => {
      console.log('💳 Payment received notification:', data)
      const notification: Notification = {
        id: `payment_${Date.now()}`,
        type: 'success',
        title: 'Pembayaran Diterima',
        message: `Pembayaran sebesar ${data.amount} telah diterima`,
        timestamp: new Date(),
        data: data
      }
      setNotifications(prev => [notification, ...prev])
      refreshNotifications()
      
      // Toast notification will be handled at component level
    })

    // Listen for tenant events
    newSocket.on('tenant_created', (data) => {
      console.log('🏢 Tenant created notification:', data)
      const notification: Notification = {
        id: `tenant_${Date.now()}`,
        type: 'info',
        title: 'Tenant Baru',
        message: `Tenant baru telah dibuat: ${data.tenant_name || data.name}`,
        timestamp: new Date(),
        data: data
      }
      setNotifications(prev => [notification, ...prev])
      refreshNotifications()
      
      // Toast notification will be handled at component level
    })

    // Listen for general notification events
    newSocket.on('notification', (data) => {
      console.log('📢 General notification:', data)
      const notification: Notification = {
        id: `general_${Date.now()}`,
        type: data.type || 'info',
        title: data.title || 'Notifikasi',
        message: data.message || 'Ada notifikasi baru',
        timestamp: new Date(),
        data: data
      }
      setNotifications(prev => [notification, ...prev])
      refreshNotifications()
      
      // Toast notification will be handled at component level
    })

    // Listen for error events
    newSocket.on('error', (data) => {
      console.log('❌ Error notification:', data)
      const notification: Notification = {
        id: `error_${Date.now()}`,
        type: 'error',
        title: 'Error',
        message: data.message || 'Terjadi kesalahan',
        timestamp: new Date(),
        data: data
      }
      setNotifications(prev => [notification, ...prev])
      refreshNotifications()
      
      // Toast notification will be handled at component level
    })

    // Listen for API notification events
    newSocket.on('new_notification', (data) => {
      console.log('📢 New API notification received:', data)
      refreshNotifications()
    })

    newSocket.on('notification_updated', (data) => {
      console.log('📢 Notification updated:', data)
      refreshNotifications()
    })

    // Listen for any event (debugging)
    newSocket.onAny((eventName: string, ...args: unknown[]) => {
      console.log(`🔍 Socket event received (onAny): ${eventName}`, args)
      
      // Handle specific events that might be sent from backend
      if (eventName === 'transaction' || eventName === 'transaction_created' || eventName === 'transaction:created') {
        const data = args[0] as unknown
        console.log('💰 Transaction event detected:', data)
        console.log('🔄 Calling refreshNotifications() for transaction event')
        refreshNotifications()
      }
      
      if (eventName === 'notification' || eventName === 'new_notification' || eventName === 'notify:new') {
        console.log('📢 Notification event detected:', args[0])
        console.log('🔄 Calling refreshNotifications() for notification event')
        refreshNotifications()
      }
    })

    setSocket(newSocket)

    // Cleanup function
    return () => {
      console.log('🧹 Cleaning up Socket.IO connection')
      newSocket.disconnect()
      setSocket(null)
      setIsConnected(false)
    }
  }, [isAuthenticated, user, token])

  const clearNotifications = () => {
    setNotifications([])
  }

  const value = {
    socket,
    isConnected,
    notifications,
    clearNotifications,
    refreshNotifications,
    refreshTransactions,
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  const context = useContext(SocketContext)
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}
