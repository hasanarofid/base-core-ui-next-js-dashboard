export interface WalletData {
  id: string // Adding id property for DataTable compatibility
  tenant_id: string
  currency: string
  available_amount: number
  pending_amount: number
  updatedAt: string
}

export interface WalletLedgerItem {
  id: string
  event_type: string
  delta_available: number
  delta_pending: number
  available_before: number
  pending_before: number
  available_after: number
  pending_after: number
  amount_abs: number
  currency: string
  description: string
  transaction_id: string | null
  payout_id: string | null
}

export interface WalletDetailResponse {
  ok: boolean
  data: WalletData
}

export interface WalletListResponse {
  ok: boolean
  total: number
  page: number
  limit: number
  items: WalletData[]
}

export interface WalletLedgerResponse {
  ok: boolean
  total: number
  page: number
  limit: number
  items: WalletLedgerItem[]
}

export type EventType = 
  | 'debit_available'
  | 'credit_pending'
  | 'release_to_available'
  | 'adjustment'
  | 'payout_requested'
  | 'payout_failed'
  | 'payout_refund'

export const getEventTypeLabel = (eventType: string): string => {
  const labels: Record<string, string> = {
    debit_available: 'Penarikan Dana',
    credit_pending: 'Penerimaan Dana',
    release_to_available: 'Pelepasan Dana',
    adjustment: 'Penyesuaian',
    payout_requested: 'Permintaan Payout',
    payout_failed: 'Payout Gagal',
    payout_refund: 'Refund Payout'
  }
  return labels[eventType] || eventType
}

export const getEventTypeColor = (eventType: string): string => {
  const colors: Record<string, string> = {
    debit_available: 'danger',
    credit_pending: 'success',
    release_to_available: 'info',
    adjustment: 'warning',
    payout_requested: 'primary',
    payout_failed: 'danger',
    payout_refund: 'warning'
  }
  return colors[eventType] || 'secondary'
}
