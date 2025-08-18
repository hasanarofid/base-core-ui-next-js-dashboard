import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; paymentMethodId: string }> }
) {
  try {
    // Ambil cookies dari request
    const cookies = request.cookies
    const sessionCookie = cookies.get('session') || cookies.get('token') || cookies.get('auth')
    
    if (!sessionCookie) {
      return NextResponse.json(
        { message: 'Session tidak ditemukan' },
        { status: 401 }
      )
    }

    const externalApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://31.97.61.121:3032/api/v1'
    const { id: tenantId, paymentMethodId } = await params
    const body = await request.json()
    
    console.log('Updating payment method:', `${externalApiUrl}/tenants/${tenantId}/payment-methods/${paymentMethodId}`)
    console.log('Using session cookie:', sessionCookie.name)
    console.log('Request body:', body)

    const response = await fetch(`${externalApiUrl}/tenants/${tenantId}/payment-methods/${paymentMethodId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `${sessionCookie.name}=${sessionCookie.value}`,
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()
    
    console.log('Payment method update API response status:', response.status)
    console.log('Payment method update API response data:', data)

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Gagal memperbarui payment method' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Payment method update API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 