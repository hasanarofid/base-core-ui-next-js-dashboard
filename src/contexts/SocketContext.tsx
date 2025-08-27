'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react'
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

// === gunakan domain FE + path yang diproxy Nginx ===
const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || 'https://tenant-app-innovia.duckdns.org'
const SOCKET_PATH = process.env.NEXT_PUBLIC_SOCKET_PATH || '/realtime'

// helper: ambil pesan error dari unknown
function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  try {
    return JSON.stringify(err)
  } catch {
    return 'Unknown error'
  }
}

// helper: konversi unknown → Record<string, unknown>
function toRecord(u: unknown): Record<string, unknown> {
  if (u && typeof u === 'object' && !Array.isArray(u)) {
    return u as Record<string, unknown>
  }
  return {}
}

// tipe payload generik dari server (kalau belum ditipkan spesifik)
type AnyPayload = Record<string, unknown>

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { user, isAuthenticated } = useAuth()
  const { token } = useToken()

  // Trigger global refresh untuk komponen lain (kalau kamu punya listener)
  const refreshNotifications = useCallback(() => {
    window.dispatchEvent(new CustomEvent('refreshNotifications'))
  }, [])

  useEffect(() => {
    console.log('🔍 SocketContext init:', {
      isAuthenticated,
      user: user?.email,
      hasToken: !!token,
      SOCKET_URL,
      SOCKET_PATH,
    })

    // Belum login / belum ada token → jangan konek
    if (!isAuthenticated || !user || !token) {
      console.warn('⏸️ Skip socket: not authenticated or no token')
      return
    }

    // === Paksa WebSocket only (tanpa polling) ===
    const s = io(SOCKET_URL, {
      path: SOCKET_PATH,
      auth: { token },             // BE baca dari handshake.auth.token
      transports: ['websocket'],   // ⬅️ WS only
      upgrade: false,              // ⬅️ jangan upgrade dari polling
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    })

    // ===== koneksi dasar =====
    s.on('connecting', () => console.log('🔄 Socket.IO connecting...'))

    s.on('connect', () => {
      const transport = s.io.engine.transport.name
      console.log('✅ Socket.IO connected!', { id: s.id, transport })
      if (transport !== 'websocket') {
        console.warn('⚠️ Transport bukan websocket:', transport)
      }
      setIsConnected(true)
    })

    s.on('disconnect', (reason: string) => {
      console.log('🔌 Socket.IO disconnected:', reason)
      setIsConnected(false)
    })

    s.on('reconnect', (attemptNumber: number) => {
      console.log('🔌 Socket.IO reconnected after', attemptNumber, 'attempts')
      setIsConnected(true)
    })

    const onErr =
      (label: string) =>
      (err: unknown): void => {
        console.error(`❌ Socket.IO ${label}:`, getErrorMessage(err))
        setIsConnected(false)
        // ⛔ tidak fallback ke polling—tetap paksa WS
      }

    s.on('reconnect_error', onErr('reconnect_error'))
    s.on('connect_error', onErr('connect_error'))
    s.on('connect_timeout', () => {
      console.error('⏰ Socket.IO connection timeout')
      setIsConnected(false)
    })

    // ===== EVENTS dari backend =====

    // Notifikasi umum → tampil instan (jangan cuma refresh)
    s.on('notify:new', (data: AnyPayload) => {
      console.log('📢 notify:new', data)
      setNotifications((prev) => [
        {
          id: `notify_${Date.now()}_${Math.random()}`,
          type: (data?.type as Notification['type']) || 'info',
          title: (data?.title as string) || 'Notifikasi',
          message: (data?.message as string) || 'Ada notifikasi baru',
          timestamp: new Date(),
          data,
        },
        ...prev,
      ])
      // (opsional) kalau perlu sinkron dari API:
      // refreshNotifications()
    })

    // Transaksi dibuat
    s.on('transaction:created', (data: AnyPayload) => {
      console.log('💰 transaction:created', data)
      setNotifications((prev) => [
        {
          id: `transaction_created_${Date.now()}_${Math.random()}`,
          type: 'success',
          title: 'Transaksi Baru',
          message: `Transaksi baru dibuat: ${(data?.transaction_id as string) || (data?.id as string) || 'N/A'}`,
          timestamp: new Date(),
          data,
        },
        ...prev,
      ])
      // refreshNotifications()
    })

    // Status transaksi
    s.on('transaction:status', (data: AnyPayload) => {
      console.log('💰 transaction:status', data)
      setNotifications((prev) => [
        {
          id: `transaction_status_${Date.now()}_${Math.random()}`,
          type: 'info',
          title: 'Status Transaksi',
          message: `Transaksi ${(data?.transaction_id as string) || (data?.id as string) || 'N/A'}: ${(data?.status as string) || 'updated'}`,
          timestamp: new Date(),
          data,
        },
        ...prev,
      ])
      // refreshNotifications()
    })

    // (opsional) kompat debug lama
    s.on('transaction', (data: AnyPayload) => {
      console.log('💰 transaction (generic)', data)
      // refreshNotifications()
    })
    s.on('transaction_created', (data: AnyPayload) => {
      console.log('💰 transaction_created (underscore)', data)
      // refreshNotifications()
    })
    s.on('transaction_updated', (data: AnyPayload) => {
      console.log('💰 transaction_updated', data)
      setNotifications((prev) => [
        {
          id: `transaction_updated_${Date.now()}_${Math.random()}`,
          type: 'info',
          title: 'Transaksi Diperbarui',
          message: `Transaksi ${(data?.transaction_id as string) || (data?.id as string) || 'N/A'} diperbarui`,
          timestamp: new Date(),
          data,
        },
        ...prev,
      ])
      // refreshNotifications()
    })
    s.on('transaction_completed', (data: AnyPayload) => {
      console.log('💰 transaction_completed', data)
      setNotifications((prev) => [
        {
          id: `transaction_completed_${Date.now()}_${Math.random()}`,
          type: 'success',
          title: 'Transaksi Selesai',
          message: `Transaksi ${(data?.transaction_id as string) || (data?.id as string) || 'N/A'} selesai`,
          timestamp: new Date(),
          data,
        },
        ...prev,
      ])
      // refreshNotifications()
    })
    s.on('transaction_failed', (data: AnyPayload) => {
      console.log('💰 transaction_failed', data)
      setNotifications((prev) => [
        {
          id: `transaction_failed_${Date.now()}_${Math.random()}`,
          type: 'error',
          title: 'Transaksi Gagal',
          message: `Transaksi ${(data?.transaction_id as string) || (data?.id as string) || 'N/A'} gagal: ${(data?.reason as string) || 'Unknown error'}`,
          timestamp: new Date(),
          data,
        },
        ...prev,
      ])
      // refreshNotifications()
    })

    // Pembayaran
    s.on('payment_received', (data: AnyPayload) => {
      console.log('💳 payment_received', data)
      setNotifications((prev) => [
        {
          id: `payment_${Date.now()}`,
          type: 'success',
          title: 'Pembayaran Diterima',
          message: `Pembayaran sebesar ${String(data?.amount ?? '')} diterima`,
          timestamp: new Date(),
          data,
        },
        ...prev,
      ])
      // refreshNotifications()
    })

    // Tenant
    s.on('tenant_created', (data: AnyPayload) => {
      console.log('🏢 tenant_created', data)
      setNotifications((prev) => [
        {
          id: `tenant_${Date.now()}`,
          type: 'info',
          title: 'Tenant Baru',
          message: `Tenant baru: ${String(data?.tenant_name ?? data?.name ?? '')}`,
          timestamp: new Date(),
          data,
        },
        ...prev,
      ])
      // refreshNotifications()
    })

    // Notifikasi generic
    s.on('notification', (data: AnyPayload) => {
      console.log('📢 notification (generic)', data)
      setNotifications((prev) => [
        {
          id: `general_${Date.now()}`,
          type: (data?.type as Notification['type']) || 'info',
          title: (data?.title as string) || 'Notifikasi',
          message: (data?.message as string) || 'Ada notifikasi baru',
          timestamp: new Date(),
          data,
        },
        ...prev,
      ])
      // refreshNotifications()
    })

    // Error dari server (pasang data yang aman)
    s.on('error', (data: unknown) => {
      console.log('❌ error event', data)
      setNotifications((prev) => [
        {
          id: `error_${Date.now()}`,
          type: 'error',
          title: 'Error',
          message: getErrorMessage(data),
          timestamp: new Date(),
          data: toRecord(data),
        },
        ...prev,
      ])
      // refreshNotifications()
    })

    // Debug ringan
    s.onAny((eventName: string) => {
      if (eventName === 'transaction:created' || eventName === 'notify:new') {
        console.log(`🔍 onAny: ${eventName}`)
      }
    })

    setSocket(s)

    // cleanup koneksi saat deps berubah / unmount
    return () => {
      console.log('🧹 Cleaning up Socket.IO connection')
      s.disconnect()
      setSocket(null)
      setIsConnected(false)
    }
  }, [isAuthenticated, user, token]) // tidak referensi state `socket` → bebas warning deps

  const clearNotifications = () => setNotifications([])

  const value = {
    socket,
    isConnected,
    notifications,
    clearNotifications,
    refreshNotifications,
  }

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}

export function useSocket() {
  const context = useContext(SocketContext)
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}
