import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Ambil cookies dari request
    const cookies = request.cookies
    console.log('All cookies received:', Array.from(cookies.getAll()))
    
    const sessionCookie = cookies.get('session') || cookies.get('token') || cookies.get('auth')
    
    if (!sessionCookie) {
      console.error('No session cookie found')
      return NextResponse.json(
        { message: 'Session tidak ditemukan' },
        { status: 401 }
      )
    }

    const externalApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://31.97.61.121:3030/api/v1'
    const { id: userId } = await params
    
    console.log('Environment variables:')
    console.log('NEXT_PUBLIC_API_BASE_URL:', process.env.NEXT_PUBLIC_API_BASE_URL)
    console.log('External API URL:', externalApiUrl)
    console.log('User ID:', userId)

    const response = await fetch(`${externalApiUrl}/verify-user/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `${sessionCookie.name}=${sessionCookie.value}`,
        'Authorization': `Bearer ${sessionCookie.value}`,
      },
    })

    console.log('External API response status:', response.status)
    console.log('External API response headers:', Object.fromEntries(response.headers.entries()))

    // Coba parse response sebagai JSON, jika gagal ambil sebagai text
    let data
    try {
      data = await response.json()
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError)
      const textData = await response.text()
      console.log('Response as text:', textData)
      data = { message: 'Invalid response format from external API' }
    }
    
    console.log('User verification API response data:', data)

    if (!response.ok) {
      console.error('External API error:', data)
      return NextResponse.json(
        { message: data.message || 'Gagal verifikasi user' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('User verification API error:', error)
    
    // Log error details untuk debugging
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    return NextResponse.json(
      { message: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 