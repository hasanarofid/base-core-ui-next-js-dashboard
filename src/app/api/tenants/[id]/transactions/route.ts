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
    
    // Build query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = new URLSearchParams();
    
    // Add all search parameters to the query
    searchParams.forEach((value, key) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    const apiUrl = queryString ? `${externalApiUrl}/tenants/${tenantId}/transactions?${queryString}` : `${externalApiUrl}/tenants/${tenantId}/transactions`;
    
    console.log('Fetching transactions from:', apiUrl)
    console.log('Using session cookie:', sessionCookie.name)

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `${sessionCookie.name}=${sessionCookie.value}`,
      },
    })

    const data = await response.json()
    
    console.log('Transactions API response status:', response.status)
    console.log('Transactions API response data:', data)

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Gagal mengambil data transaksi' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Transactions API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 