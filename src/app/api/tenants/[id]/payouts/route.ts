import { NextRequest, NextResponse } from 'next/server'

// Mock data untuk demo - dalam implementasi nyata ini akan menyimpan ke database
const mockPayouts: Array<{
  id: string
  tenant_id: string
  amount: number
  bank: {
    code: string
    accountNo: string
    accountName: string
  }
  notes: string
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'failed'
  created_at: string
  updated_at: string
}> = []

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tenantId } = await params
    const body = await request.json()
    
    // Validasi input
    const { amount, bank, notes } = body
    
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { 
          ok: false, 
          error: 'Jumlah payout harus lebih dari 0' 
        },
        { status: 400 }
      )
    }
    
    if (!bank || !bank.code || !bank.accountNo || !bank.accountName) {
      return NextResponse.json(
        { 
          ok: false, 
          error: 'Data bank tidak lengkap' 
        },
        { status: 400 }
      )
    }
    
    // Simulasi delay network
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Generate unique ID untuk payout
    const payoutId = `payout-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    // Buat payout record
    const payoutRecord = {
      id: payoutId,
      tenant_id: tenantId,
      amount: amount,
      bank: {
        code: bank.code,
        accountNo: bank.accountNo,
        accountName: bank.accountName
      },
      notes: notes || '',
      status: 'pending' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    // Simpan ke mock data
    mockPayouts.push(payoutRecord)
    
    // Simulasi validasi saldo (dalam implementasi nyata akan cek database)
    // Untuk demo, kita anggap selalu berhasil
    
    return NextResponse.json({
      ok: true,
      message: 'Permintaan payout berhasil dikirim',
      data: {
        payout_id: payoutId,
        status: 'pending',
        message: 'Payout akan diproses dalam 1-3 hari kerja'
      }
    })
    
  } catch (error) {
    console.error('Error processing payout request:', error)
    return NextResponse.json(
      { 
        ok: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tenantId } = await params
    
    // Simulasi delay network
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Filter payouts berdasarkan tenant ID
    const tenantPayouts = mockPayouts.filter(payout => payout.tenant_id === tenantId)
    
    return NextResponse.json({
      ok: true,
      total: tenantPayouts.length,
      items: tenantPayouts
    })
    
  } catch (error) {
    console.error('Error fetching payouts:', error)
    return NextResponse.json(
      { 
        ok: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
