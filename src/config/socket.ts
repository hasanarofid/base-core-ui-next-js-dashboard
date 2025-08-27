// Socket.IO Configuration and Event Types
export const SOCKET_CONFIG = {
  // Server configuration
  SERVER_URL: 'http://31.97.61.121:3032',
  PATH: '/realtime',
  
  // Connection options
  CONNECTION_OPTIONS: {
    transports: ['websocket', 'polling'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    forceNew: true,
  },
  
  // Event names that should be listened to from backend
  EVENTS: {
    // Connection events
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    RECONNECT: 'reconnect',
    CONNECT_ERROR: 'connect_error',
    RECONNECT_ERROR: 'reconnect_error',
    
    // Transaction events
    TRANSACTION: 'transaction',                    // General transaction event
    TRANSACTION_CREATED: 'transaction_created',    // New transaction created
    TRANSACTION_UPDATED: 'transaction_updated',    // Transaction updated
    TRANSACTION_COMPLETED: 'transaction_completed', // Transaction completed
    TRANSACTION_FAILED: 'transaction_failed',      // Transaction failed
    TRANSACTION_CANCELLED: 'transaction_cancelled', // Transaction cancelled
    
    // Payment events
    PAYMENT_RECEIVED: 'payment_received',          // Payment received
    PAYMENT_PROCESSED: 'payment_processed',        // Payment processed
    PAYMENT_FAILED: 'payment_failed',              // Payment failed
    PAYMENT_REFUNDED: 'payment_refunded',          // Payment refunded
    
    // Tenant events
    TENANT_CREATED: 'tenant_created',              // New tenant created
    TENANT_UPDATED: 'tenant_updated',              // Tenant updated
    TENANT_APPROVED: 'tenant_approved',            // Tenant approved
    TENANT_REJECTED: 'tenant_rejected',            // Tenant rejected
    TENANT_SUSPENDED: 'tenant_suspended',          // Tenant suspended
    
    // User events
    USER_CREATED: 'user_created',                  // New user created
    USER_UPDATED: 'user_updated',                  // User updated
    USER_ACTIVATED: 'user_activated',              // User activated
    USER_DEACTIVATED: 'user_deactivated',          // User deactivated
    
    // Notification events
    NOTIFICATION: 'notification',                  // General notification
    NEW_NOTIFICATION: 'new_notification',          // New API notification
    NOTIFICATION_UPDATED: 'notification_updated',  // Notification updated
    NOTIFICATION_READ: 'notification_read',        // Notification marked as read
    
    // Error events
    ERROR: 'error',                                // General error
    VALIDATION_ERROR: 'validation_error',          // Validation error
    AUTH_ERROR: 'auth_error',                      // Authentication error
    
    // System events
    SYSTEM_MAINTENANCE: 'system_maintenance',      // System maintenance
    SYSTEM_UPDATE: 'system_update',                // System update
    BACKUP_COMPLETED: 'backup_completed',          // Backup completed
    
    // QRIS events
    QRIS_GENERATED: 'qris_generated',              // QRIS code generated
    QRIS_SCANNED: 'qris_scanned',                  // QRIS code scanned
    QRIS_EXPIRED: 'qris_expired',                  // QRIS code expired
    
    // Webhook events
    WEBHOOK_RECEIVED: 'webhook_received',          // Webhook received
    WEBHOOK_FAILED: 'webhook_failed',              // Webhook failed
    
    // Custom events (add as needed)
    CUSTOM_EVENT: 'custom_event',                  // Custom event
  },
  
  // Event categories for better organization
  EVENT_CATEGORIES: {
    TRANSACTION: [
      'transaction',
      'transaction_created',
      'transaction_updated', 
      'transaction_completed',
      'transaction_failed',
      'transaction_cancelled'
    ],
    PAYMENT: [
      'payment_received',
      'payment_processed',
      'payment_failed',
      'payment_refunded'
    ],
    TENANT: [
      'tenant_created',
      'tenant_updated',
      'tenant_approved',
      'tenant_rejected',
      'tenant_suspended'
    ],
    USER: [
      'user_created',
      'user_updated',
      'user_activated',
      'user_deactivated'
    ],
    NOTIFICATION: [
      'notification',
      'new_notification',
      'notification_updated',
      'notification_read'
    ],
    SYSTEM: [
      'error',
      'validation_error',
      'auth_error',
      'system_maintenance',
      'system_update',
      'backup_completed'
    ],
    QRIS: [
      'qris_generated',
      'qris_scanned',
      'qris_expired'
    ],
    WEBHOOK: [
      'webhook_received',
      'webhook_failed'
    ]
  }
} as const

// Type definitions for socket events
export interface SocketEventData {
  // Transaction events
  transaction?: {
    transaction_id?: string
    id?: string
    amount?: number
    status?: string
    tenant_id?: string
    payment_method?: string
    created_at?: string
    updated_at?: string
  }
  
  // Payment events
  payment?: {
    payment_id?: string
    id?: string
    amount?: number
    currency?: string
    status?: string
    transaction_id?: string
    payment_method?: string
  }
  
  // Tenant events
  tenant?: {
    tenant_id?: string
    id?: string
    tenant_name?: string
    name?: string
    status?: string
    email?: string
    phone?: string
  }
  
  // User events
  user?: {
    user_id?: string
    id?: string
    email?: string
    name?: string
    role?: string
    status?: string
  }
  
  // Notification events
  notification?: {
    notification_id?: string
    id?: string
    title?: string
    message?: string
    type?: string
    severity?: string
    read_at?: string
  }
  
  // Error events
  error?: {
    message?: string
    code?: string
    details?: unknown
  }
  
  // General data
  [key: string]: unknown
}

// Helper functions removed - not used in current implementation
