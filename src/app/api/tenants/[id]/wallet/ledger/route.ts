import { NextRequest, NextResponse } from 'next/server'

// Mock data untuk demo - dalam implementasi nyata ini akan mengambil dari database
const mockLedgerData = {
  "63a2745f-5898-40f0-bad5-faa0573e4e9c": [
    {
      id: "26e985b1-6499-45d5-9a46-53085085d6d7",
      event_type: "debit_available",
      delta_available: -10000,
      delta_pending: 0,
      available_before: 50000,
      pending_before: 50000,
      available_after: 40000,
      pending_after: 50000,
      amount_abs: 10000,
      currency: "IDR",
      description: "Payout requested (#093d87ee-c03d-4a88-9fc9-1a582ded90f8)",
      transaction_id: null,
      payout_id: "093d87ee-c03d-4a88-9fc9-1a582ded90f8"
    },
    {
      id: "89dd3ac7-1550-49ac-a58c-2b66ab341632",
      event_type: "adjustment",
      delta_available: 10000,
      delta_pending: 0,
      available_before: 40000,
      pending_before: 50000,
      available_after: 50000,
      pending_after: 50000,
      amount_abs: 10000,
      currency: "IDR",
      description: "Payout failed (#697f430a-c889-4c55-b377-dfc558b20bad) refund",
      transaction_id: null,
      payout_id: "697f430a-c889-4c55-b377-dfc558b20bad"
    },
    {
      id: "1c2f999a-2bd5-4d8d-8379-e1e1d6b49403",
      event_type: "debit_available",
      delta_available: -10000,
      delta_pending: 0,
      available_before: 50000,
      pending_before: 50000,
      available_after: 40000,
      pending_after: 50000,
      amount_abs: 10000,
      currency: "IDR",
      description: "Payout requested (#697f430a-c889-4c55-b377-dfc558b20bad)",
      transaction_id: null,
      payout_id: "697f430a-c889-4c55-b377-dfc558b20bad"
    },
    {
      id: "c0cb90d7-448d-49bc-9043-8cc31a3da368",
      event_type: "credit_pending",
      delta_available: 0,
      delta_pending: 50000,
      available_before: 50000,
      pending_before: 0,
      available_after: 50000,
      pending_after: 50000,
      amount_abs: 50000,
      currency: "IDR",
      description: "QRIS payment received (ref INNV20250831200529)",
      transaction_id: "4f9f441d-0441-45d7-9588-d54d29320659",
      payout_id: null
    },
    {
      id: "004364f4-e669-4d60-af33-191b1d026365",
      event_type: "release_to_available",
      delta_available: 50000,
      delta_pending: -50000,
      available_before: 0,
      pending_before: 50000,
      available_after: 50000,
      pending_after: 0,
      amount_abs: 50000,
      currency: "IDR",
      description: "Release settlement (ref INNV20250831152805)",
      transaction_id: "299c0095-6a62-416a-8940-98b9f7cc1c22",
      payout_id: null
    },
    {
      id: "b9e46367-76a2-4a3b-bf45-db110b9fce9e",
      event_type: "credit_pending",
      delta_available: 0,
      delta_pending: 50000,
      available_before: 0,
      pending_before: 0,
      available_after: 0,
      pending_after: 50000,
      amount_abs: 50000,
      currency: "IDR",
      description: "QRIS payment received (ref INNV20250831152805)",
      transaction_id: "299c0095-6a62-416a-8940-98b9f7cc1c22",
      payout_id: null
    }
  ],
  "ebe984d2-cb6e-42a8-b77e-23d859dc796b": [
    {
      id: "ledger-1-tenant-2",
      event_type: "credit_pending",
      delta_available: 0,
      delta_pending: 750000,
      available_before: 0,
      pending_before: 0,
      available_after: 0,
      pending_after: 750000,
      amount_abs: 750000,
      currency: "IDR",
      description: "Bulk payment received (ref BULK20250831120000)",
      transaction_id: "bulk-txn-123",
      payout_id: null
    },
    {
      id: "ledger-2-tenant-2",
      event_type: "release_to_available",
      delta_available: 750000,
      delta_pending: -750000,
      available_before: 0,
      pending_before: 750000,
      available_after: 750000,
      pending_after: 0,
      amount_abs: 750000,
      currency: "IDR",
      description: "Settlement completed (ref SETTLE20250831120000)",
      transaction_id: "settle-txn-456",
      payout_id: null
    }
  ],
  "a1b2c3d4-e5f6-7890-abcd-ef1234567890": [
    {
      id: "ledger-1-tenant-3",
      event_type: "credit_pending",
      delta_available: 0,
      delta_pending: 150000,
      available_before: 0,
      pending_before: 0,
      available_after: 0,
      pending_after: 150000,
      amount_abs: 150000,
      currency: "IDR",
      description: "Payment received (ref PAY20250901100000)",
      transaction_id: "pay-txn-789",
      payout_id: null
    }
  ],
  "f9e8d7c6-b5a4-3210-fedc-ba9876543210": [
    {
      id: "ledger-1-tenant-4",
      event_type: "credit_pending",
      delta_available: 0,
      delta_pending: 239000,
      available_before: 0,
      pending_before: 0,
      available_after: 0,
      pending_after: 239000,
      amount_abs: 239000,
      currency: "IDR",
      description: "Multiple payments received",
      transaction_id: "multi-txn-012",
      payout_id: null
    }
  ]
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    // Simulasi delay network
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const ledgerItems = mockLedgerData[id as keyof typeof mockLedgerData] || []
    
    // Simulasi pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedLedger = ledgerItems.slice(startIndex, endIndex)
    
    return NextResponse.json({
      ok: true,
      total: ledgerItems.length,
      page: page,
      limit: limit,
      items: paginatedLedger
    })
  } catch (error) {
    console.error('Error fetching wallet ledger:', error)
    return NextResponse.json(
      { 
        ok: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
