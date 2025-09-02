import { NextRequest, NextResponse } from 'next/server'

// Mock data untuk demo - dalam implementasi nyata ini akan mengambil dari database
const mockWallets = [
  {
    id: "wallet-1",
    tenant_id: "63a2745f-5898-40f0-bad5-faa0573e4e9c",
    currency: "IDR",
    available_amount: 40000,
    pending_amount: 50000,
    updatedAt: "2025-09-01T12:36:21.221Z"
  },
  {
    id: "wallet-2",
    tenant_id: "ebe984d2-cb6e-42a8-b77e-23d859dc796b",
    currency: "IDR",
    available_amount: 750000,
    pending_amount: 0,
    updatedAt: "2025-08-31T11:26:28.930Z"
  },
  {
    id: "wallet-3",
    tenant_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    currency: "IDR",
    available_amount: 125000,
    pending_amount: 25000,
    updatedAt: "2025-09-01T10:15:30.000Z"
  },
  {
    id: "wallet-4",
    tenant_id: "f9e8d7c6-b5a4-3210-fedc-ba9876543210",
    currency: "IDR",
    available_amount: 89000,
    pending_amount: 150000,
    updatedAt: "2025-08-31T15:45:12.000Z"
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    // Simulasi pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedWallets = mockWallets.slice(startIndex, endIndex)
    
    // Simulasi delay network
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return NextResponse.json({
      ok: true,
      total: mockWallets.length,
      page: page,
      limit: limit,
      items: paginatedWallets
    })
  } catch (error) {
    console.error('Error fetching wallets:', error)
    return NextResponse.json(
      { 
        ok: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
