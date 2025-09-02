import { NextRequest, NextResponse } from 'next/server'

// Mock data untuk demo - dalam implementasi nyata ini akan mengambil dari database
const mockWalletDetails = {
  "63a2745f-5898-40f0-bad5-faa0573e4e9c": {
    tenant_id: "63a2745f-5898-40f0-bad5-faa0573e4e9c",
    currency: "IDR",
    available_amount: 40000,
    pending_amount: 50000,
    updatedAt: "2025-09-01T12:36:21.221Z"
  },
  "ebe984d2-cb6e-42a8-b77e-23d859dc796b": {
    tenant_id: "ebe984d2-cb6e-42a8-b77e-23d859dc796b",
    currency: "IDR",
    available_amount: 750000,
    pending_amount: 0,
    updatedAt: "2025-08-31T11:26:28.930Z"
  },
  "a1b2c3d4-e5f6-7890-abcd-ef1234567890": {
    tenant_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    currency: "IDR",
    available_amount: 125000,
    pending_amount: 25000,
    updatedAt: "2025-09-01T10:15:30.000Z"
  },
  "f9e8d7c6-b5a4-3210-fedc-ba9876543210": {
    tenant_id: "f9e8d7c6-b5a4-3210-fedc-ba9876543210",
    currency: "IDR",
    available_amount: 89000,
    pending_amount: 150000,
    updatedAt: "2025-08-31T15:45:12.000Z"
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Simulasi delay network
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const walletDetail = mockWalletDetails[id as keyof typeof mockWalletDetails]
    
    if (!walletDetail) {
      return NextResponse.json(
        { 
          ok: false, 
          error: 'Wallet tidak ditemukan' 
        },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      ok: true,
      data: walletDetail
    })
  } catch (error) {
    console.error('Error fetching wallet detail:', error)
    return NextResponse.json(
      { 
        ok: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
