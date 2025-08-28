'use client'

import { useEffect, useRef } from 'react'
import { useSocket } from '@/contexts/SocketContext'
import { useToastContext } from '@/contexts/ToastContext'
import { useAuth } from '@/contexts/AuthContext'

export function NotificationHandler() {
  const { socket, isConnected } = useSocket()
  const { showSuccess, showError, showWarning, showInfo } = useToastContext()
  const { user } = useAuth()
  
  // Ref untuk tracking event yang sudah diproses
  const processedEvents = useRef<Set<string>>(new Set())
  const lastEventTime = useRef<number>(0)

  // Helper function untuk mencegah duplicate events
  const shouldProcessEvent = (eventType: string, data: Record<string, unknown>): boolean => {
    const now = Date.now()
    const eventId = `${eventType}_${data.transaction_id || data.id || Date.now()}`
    
    // Cek apakah event sudah diproses dalam 10 detik terakhir
    if (processedEvents.current.has(eventId)) {
      console.log(`🔔 Skipping duplicate event: ${eventId}`)
      return false
    }
    
    // Cek apakah event terlalu cepat (debouncing)
    if (now - lastEventTime.current < 1000) { // 1 detik debouncing
      console.log(`🔔 Skipping event too soon: ${eventType}`)
      return false
    }
    
    // Mark event as processed
    processedEvents.current.add(eventId)
    lastEventTime.current = now
    
    // Clean up old events after 10 seconds
    setTimeout(() => {
      processedEvents.current.delete(eventId)
    }, 10000)
    
    return true
  }

  useEffect(() => {
    if (!socket || !isConnected) return

    const handleTransactionCreated = (data: Record<string, unknown>) => {
      console.log('🔔 NotificationHandler: Transaction created event received:', data)
      console.log('🔔 Current user role:', user?.role)
      
      if (!shouldProcessEvent('transaction_created', data)) return
      
      const referenceCode = data.reference_code || data.code || data.transaction_id || data.id || 'N/A'
      showSuccess('Transaksi Baru', `Transaksi baru telah dibuat dengan kode: ${referenceCode}`)
    }

    const handleTransactionUpdated = (data: Record<string, unknown>) => {
      console.log('🔔 NotificationHandler: Transaction updated event received:', data)
      
      if (!shouldProcessEvent('transaction_updated', data)) return
      
      const referenceCode = data.reference_code || data.code || data.transaction_id || data.id || 'N/A'
      showInfo('Transaksi Diperbarui', `Transaksi dengan kode ${referenceCode} telah diperbarui`)
    }

    const handleTransactionCompleted = (data: Record<string, unknown>) => {
      console.log('🔔 NotificationHandler: Transaction completed event received:', data)
      
      if (!shouldProcessEvent('transaction_completed', data)) return
      
      const referenceCode = data.reference_code || data.code || data.transaction_id || data.id || 'N/A'
      showSuccess('Transaksi Selesai', `Transaksi dengan kode ${referenceCode} telah selesai`)
    }

    const handleTransactionFailed = (data: Record<string, unknown>) => {
      console.log('🔔 NotificationHandler: Transaction failed event received:', data)
      
      if (!shouldProcessEvent('transaction_failed', data)) return
      
      const referenceCode = data.reference_code || data.code || data.transaction_id || data.id || 'N/A'
      showError('Transaksi Gagal', `Transaksi dengan kode ${referenceCode} gagal: ${data.reason || 'Unknown error'}`)
    }

    const handlePaymentReceived = (data: Record<string, unknown>) => {
      showSuccess('Pembayaran Diterima', `Pembayaran sebesar ${data.amount} telah diterima`)
    }

    const handleTenantCreated = (data: Record<string, unknown>) => {
      showInfo('Tenant Baru', `Tenant baru telah dibuat: ${data.tenant_name || data.name}`)
    }

    const handleGeneralNotification = (data: Record<string, unknown>) => {
      console.log('🔔 NotificationHandler: General notification event received:', data)
      const toastType = String(data.type || 'info')
      const toastTitle = String(data.title || 'Notifikasi')
      const toastMessage = String(data.message || 'Ada notifikasi baru')
      
      switch (toastType) {
        case 'success':
          showSuccess(toastTitle, toastMessage)
          break
        case 'error':
          showError(toastTitle, toastMessage)
          break
        case 'warning':
          showWarning(toastTitle, toastMessage)
          break
        default:
          showInfo(toastTitle, toastMessage)
      }
    }

    const handleError = (data: Record<string, unknown>) => {
      showError('Error', String(data.message || 'Terjadi kesalahan'))
    }

    // Listen for transaction events
    socket.on('transaction_created', handleTransactionCreated)
    socket.on('transaction_updated', handleTransactionUpdated)
    socket.on('transaction_completed', handleTransactionCompleted)
    socket.on('transaction_failed', handleTransactionFailed)

    // Listen for payment events
    socket.on('payment_received', handlePaymentReceived)

    // Listen for tenant events
    socket.on('tenant_created', handleTenantCreated)

    // Listen for general notification events
    socket.on('notification', handleGeneralNotification)

    // Listen for error events
    socket.on('error', handleError)

    // Listen for additional events that might be sent from backend
    socket.on('transaction', (data: Record<string, unknown>) => {
      console.log('🔔 NotificationHandler: Transaction event received:', data)
      
      if (!shouldProcessEvent('transaction', data)) return
      
      showInfo('Transaksi', 'Ada update transaksi baru')
    })

    socket.on('transaction:created', (data: Record<string, unknown>) => {
      console.log('🔔 NotificationHandler: Transaction:created event received:', data)
      
      if (!shouldProcessEvent('transaction:created', data)) return
      
      const referenceCode = data.reference_code || data.code || data.transaction_id || data.id || 'N/A'
      showSuccess('Transaksi Baru', `Transaksi baru telah dibuat dengan kode: ${referenceCode}`)
    })

    socket.on('notify:new', (data: Record<string, unknown>) => {
      console.log('🔔 NotificationHandler: Notify:new event received:', data)
      
      if (!shouldProcessEvent('notify:new', data)) return
      
      showInfo('Notifikasi Baru', 'Ada notifikasi baru')
    })

    socket.on('new_notification', (data: Record<string, unknown>) => {
      console.log('🔔 NotificationHandler: New notification event received:', data)
      
      if (!shouldProcessEvent('new_notification', data)) return
      
      showInfo('Notifikasi Baru', 'Ada notifikasi baru')
    })

    // Listen for any event (debugging)
    socket.onAny((eventName: string, ...args: unknown[]) => {
      console.log(`🔔 NotificationHandler: Socket event received (onAny): ${eventName}`, args)
      console.log(`🔔 Current user role: ${user?.role}`)
      
      // Auto-handle transaction events that might not be explicitly handled
      if (eventName.includes('transaction') || eventName.includes('notify')) {
        console.log(`🔔 Auto-handling event: ${eventName}`)
        if (eventName.includes('created') || eventName.includes('new')) {
          const data = args[0] as Record<string, unknown>
          
          if (!shouldProcessEvent(`onAny_${eventName}`, data)) return
          
          const referenceCode = data?.reference_code || data?.code || data?.transaction_id || data?.id || 'N/A'
          showSuccess('Transaksi Baru', `Transaksi baru telah dibuat dengan kode: ${referenceCode}`)
        }
      }
    })

    return () => {
      socket.off('transaction_created', handleTransactionCreated)
      socket.off('transaction_updated', handleTransactionUpdated)
      socket.off('transaction_completed', handleTransactionCompleted)
      socket.off('transaction_failed', handleTransactionFailed)
      socket.off('payment_received', handlePaymentReceived)
      socket.off('tenant_created', handleTenantCreated)
      socket.off('notification', handleGeneralNotification)
      socket.off('error', handleError)
      socket.off('transaction')
      socket.off('transaction:created')
      socket.off('notify:new')
      socket.off('new_notification')
      socket.offAny()
    }
  }, [socket, isConnected, showSuccess, showError, showWarning, showInfo])

  return null
}
