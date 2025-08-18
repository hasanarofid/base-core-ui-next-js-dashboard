import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
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

    const externalApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://31.97.61.121:3030/api/v1'
    const { id: tenantId } = await params
    
    console.log('Approving tenant:', tenantId)
    console.log('External API URL:', externalApiUrl)

    // Endpoint approve TIDAK mengirim body
    const response = await fetch(`${externalApiUrl}/tenants/${tenantId}/approve`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Cookie': `${sessionCookie.name}=${sessionCookie.value}`,
      }
    })

    console.log('Approve API response status:', response.status)

    // Cek apakah response adalah JSON
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Response is not JSON:', contentType)
      const responseText = await response.text()
      console.error('Response text:', responseText.substring(0, 200))
      return NextResponse.json(
        { message: 'Backend mengembalikan response yang tidak valid' },
        { status: 500 }
      )
    }

    const data = await response.json()
    console.log('Approve API response data:', data)

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Gagal approve tenant' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Tenant approve API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 