export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: Date
  data?: Record<string, unknown>
}

export interface SocketNotification {
  type: string
  title?: string
  message: string
  data?: Record<string, unknown>
}

export interface TransactionNotification {
  transaction_id?: string
  id?: string
  amount?: number
  currency?: string
  status?: string
  [key: string]: unknown
}

export interface TenantNotification {
  tenant_id?: string
  tenant_name?: string
  name?: string
  status?: string
  [key: string]: unknown
}

export interface PaymentNotification {
  payment_id?: string
  amount?: number
  currency?: string
  status?: string
  [key: string]: unknown
}
