import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
    const { id: tenantId } = await params
    
    console.log('Fetching payment methods from:', `${externalApiUrl}/tenants/${tenantId}/payment-methods`)
    console.log('Using session cookie:', sessionCookie.name)

    const response = await fetch(`${externalApiUrl}/tenants/${tenantId}/payment-methods`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `${sessionCookie.name}=${sessionCookie.value}`,
      },
    })

    const data = await response.json()
    
    console.log('Payment methods API response status:', response.status)
    console.log('Payment methods API response data:', data)

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Gagal mengambil data payment methods' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Payment methods API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
    const { id: tenantId } = await params
    const body = await request.json()
    
    console.log('Creating tenant payment method for tenant:', tenantId)
    console.log('Using session cookie:', sessionCookie.name)
    console.log('Request body:', body)

    const response = await fetch(`${externalApiUrl}/tenants/${tenantId}/payment-methods`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `${sessionCookie.name}=${sessionCookie.value}`,
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()
    
    console.log('Create tenant payment method API response status:', response.status)
    console.log('Create tenant payment method API response data:', data)

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Gagal membuat tenant payment method' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Create tenant payment method API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
    const { id: tenantId } = await params
    const body = await request.json()
    
    // Extract payment method ID from URL
    const url = new URL(request.url)
    const pathParts = url.pathname.split('/')
    const paymentMethodId = pathParts[pathParts.length - 1]
    
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