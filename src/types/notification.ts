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

// API Notification Types
export interface NotificationData {
  id: string
  tenant_id: string
  type: 'transaction' | 'tenant' | 'payment' | 'system'
  event: string
  title: string
  body: string
  resource_type: string
  resource_id: string
  severity: 'info' | 'success' | 'warning' | 'error'
  payload: Record<string, unknown>
  idempotency_key: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface ApiNotification {
  id: string
  notification_id: string
  user_id: string
  delivered_at: string
  read_at: string | null
  archived_at: string | null
  created_at: string
  notification: NotificationData
}

export interface NotificationListResponse {
  message: string
  data: {
    total: number
    page: number
    limit: number
    items: ApiNotification[]
  }
}

export interface NotificationReadResponse {
  message: string
  data?: ApiNotification
}

export interface NotificationReadAllResponse {
  message: string
  data: {
    updated_count: number
  }
}
