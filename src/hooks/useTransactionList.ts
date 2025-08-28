import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useSocket } from '@/contexts/SocketContext'

interface Transaction {
  id: string
  transaction_id?: string
  amount?: number
  status?: string
  created_at?: string
  updated_at?: string
  [key: string]: unknown
}

interface UseTransactionListReturn {
  transactions: Transaction[]
  loading: boolean
  error: string | null
  refreshTransactions: () => Promise<void>
  addTransaction: (transaction: Transaction) => void
  updateTransaction: (id: string, updates: Partial<Transaction>) => void
  removeTransaction: (id: string) => void
}

export function useTransactionList(): UseTransactionListReturn {
  const { user } = useAuth()
  const { socket, isConnected } = useSocket()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Refs to prevent infinite loops
  const isRefreshingRef = useRef(false)
  const lastRefreshTimeRef = useRef(0)

  const fetchTransactions = useCallback(async () => {
    // Prevent concurrent refreshes
    if (isRefreshingRef.current) {
      console.log('⏸️ Skipping transaction refresh - already in progress')
      return
    }

    // Prevent too frequent refreshes (minimum 5 seconds between refreshes)
    const now = Date.now()
    if (now - lastRefreshTimeRef.current < 5000) {
      console.log('⏸️ Skipping transaction refresh - too frequent')
      return
    }

    try {
      isRefreshingRef.current = true
      setLoading(true)
      setError(null)
      lastRefreshTimeRef.current = now
      
      console.log('🔄 Fetching transactions for role:', user?.role)
      
      // TODO: Implement actual API call to fetch transactions
      // For now, we'll just simulate the API call
      // const response = await getTransactionsWithCookies()
      // setTransactions(response.data.items)
      
      console.log('✅ Fetched transactions:', transactions.length)
    } catch (err) {
      console.error('❌ Error fetching transactions:', err)
      setError(err instanceof Error ? err.message : 'Gagal mengambil data transaksi')
    } finally {
      setLoading(false)
      isRefreshingRef.current = false
    }
  }, [user?.role, transactions.length])

  const addTransaction = useCallback((transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev])
  }, [])

  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => 
      prev.map(transaction => 
        transaction.id === id || transaction.transaction_id === id
          ? { ...transaction, ...updates }
          : transaction
      )
    )
  }, [])

  const removeTransaction = useCallback((id: string) => {
    setTransactions(prev => 
      prev.filter(transaction => 
        transaction.id !== id && transaction.transaction_id !== id
      )
    )
  }, [])

  const refreshTransactions = useCallback(async () => {
    await fetchTransactions()
  }, [fetchTransactions])

  // Listen for socket events to update transactions
  useEffect(() => {
    if (!socket || !isConnected) return

    const handleTransactionCreated = (data: Record<string, unknown>) => {
      console.log('💰 Socket: Transaction created, adding to list:', data)
      const newTransaction: Transaction = {
        id: String(data.transaction_id || data.id || `temp_${Date.now()}`),
        transaction_id: String(data.transaction_id || data.id),
        amount: typeof data.amount === 'number' ? data.amount : undefined,
        status: 'pending',
        created_at: new Date().toISOString(),
        ...data
      }
      addTransaction(newTransaction)
    }

    const handleTransactionUpdated = (data: Record<string, unknown>) => {
      console.log('💰 Socket: Transaction updated, updating in list:', data)
      const transactionId = String(data.transaction_id || data.id)
      if (transactionId) {
        updateTransaction(transactionId, {
          ...data,
          updated_at: new Date().toISOString()
        })
      }
    }

    const handleTransactionCompleted = (data: Record<string, unknown>) => {
      console.log('💰 Socket: Transaction completed, updating in list:', data)
      const transactionId = String(data.transaction_id || data.id)
      if (transactionId) {
        updateTransaction(transactionId, {
          status: 'completed',
          updated_at: new Date().toISOString(),
          ...data
        })
      }
    }

    const handleTransactionFailed = (data: Record<string, unknown>) => {
      console.log('💰 Socket: Transaction failed, updating in list:', data)
      const transactionId = String(data.transaction_id || data.id)
      if (transactionId) {
        updateTransaction(transactionId, {
          status: 'failed',
          updated_at: new Date().toISOString(),
          ...data
        })
      }
    }

    // Listen for transaction events
    socket.on('transaction_created', handleTransactionCreated)
    socket.on('transaction_updated', handleTransactionUpdated)
    socket.on('transaction_completed', handleTransactionCompleted)
    socket.on('transaction_failed', handleTransactionFailed)

    // Listen for general transaction event
    socket.on('transaction', (data: Record<string, unknown>) => {
      console.log('💰 Socket: General transaction event:', data)
      refreshTransactions()
    })

    // Listen for transaction:created event (with colon)
    socket.on('transaction:created', (data: Record<string, unknown>) => {
      console.log('💰 Socket: Transaction:created event:', data)
      refreshTransactions()
    })

    return () => {
      socket.off('transaction_created', handleTransactionCreated)
      socket.off('transaction_updated', handleTransactionUpdated)
      socket.off('transaction_completed', handleTransactionCompleted)
      socket.off('transaction_failed', handleTransactionFailed)
      socket.off('transaction')
      socket.off('transaction:created')
    }
  }, [socket, isConnected, addTransaction, updateTransaction, refreshTransactions])

  // Listen for refresh events from socket
  useEffect(() => {
    const handleRefreshEvent = () => {
      console.log('📡 Received refresh event from socket for transactions')
      refreshTransactions()
    }

    window.addEventListener('refreshTransactions', handleRefreshEvent)
    
    return () => {
      window.removeEventListener('refreshTransactions', handleRefreshEvent)
    }
  }, [refreshTransactions])

  // Fetch transactions on mount
  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return {
    transactions,
    loading,
    error,
    refreshTransactions,
    addTransaction,
    updateTransaction,
    removeTransaction,
  }
}
