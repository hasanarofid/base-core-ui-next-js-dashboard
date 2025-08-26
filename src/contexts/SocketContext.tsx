'use client'

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from './AuthContext'
import { useToken } from '@/hooks/useToken'
import { Notification } from '@/types/notification'

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
  notifications: Notification[]
  clearNotifications: () => void
  refreshNotifications: () => void
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { user, isAuthenticated } = useAuth()
  const { token } = useToken()

  // Callback untuk refresh notifikasi dari komponen lain
  const refreshNotifications = useCallback(() => {
    // Trigger event untuk refresh notifikasi
    const event = new CustomEvent('refreshNotifications')
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

    // eslint-disable-next-line react-hooks/exhaustive-deps

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
        const newSocket = io('http://31.97.61.121:3032', {
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
        
        // Add event listeners for cookie token
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

        // Listen for notifications
        newSocket.on('transaction_created', (data) => {
          console.log('💰 Transaction created notification:', data)
          const notification: Notification = {
            id: `transaction_${Date.now()}`,
            type: 'success',
            title: 'Transaksi Baru',
            message: `Transaksi baru telah dibuat dengan ID: ${data.transaction_id || data.id}`,
            timestamp: new Date(),
            data: data
          }
          setNotifications(prev => [notification, ...prev])
          // Trigger refresh untuk API notifications
          refreshNotifications()
        })

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
          // Trigger refresh untuk API notifications
          refreshNotifications()
        })

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
          // Trigger refresh untuk API notifications
          refreshNotifications()
        })

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
          // Trigger refresh untuk API notifications
          refreshNotifications()
        })

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
          // Trigger refresh untuk API notifications
          refreshNotifications()
        })

        setSocket(newSocket)
        return
      }
      
      console.error('❌ No token found in localStorage or cookies')
      return
    }

    console.log('🔌 Creating Socket.IO connection with token:', token.substring(0, 20) + '...')
    
    // Create socket connection with better error handling
    const newSocket = io('http://31.97.61.121:3032', {
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

    // Socket event listeners
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

    // Listen for transaction notifications
    newSocket.on('transaction_created', (data) => {
      console.log('💰 Transaction created notification:', data)
      const notification: Notification = {
        id: `transaction_${Date.now()}`,
        type: 'success',
        title: 'Transaksi Baru',
        message: `Transaksi baru telah dibuat dengan ID: ${data.transaction_id || data.id}`,
        timestamp: new Date(),
        data: data
      }
      setNotifications(prev => [notification, ...prev])
      // Trigger refresh untuk API notifications
      refreshNotifications()
    })

    // Listen for tenant notifications
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
      // Trigger refresh untuk API notifications
      refreshNotifications()
    })

    // Listen for payment notifications
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
      // Trigger refresh untuk API notifications
      refreshNotifications()
    })

    // Listen for error notifications
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
      // Trigger refresh untuk API notifications
      refreshNotifications()
    })

    // Listen for general notifications
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
      // Trigger refresh untuk API notifications
      refreshNotifications()
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
