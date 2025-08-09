import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/users called - dedicated endpoint for fetching users')
    
    // Ambil token dari header Authorization atau cookies
    const authHeader = request.headers.get('authorization')
    const cookies = request.cookies
    console.log('All cookies received:', Array.from(cookies.getAll()))
    console.log('Authorization header:', authHeader ? 'Found' : 'Not found')
    
    let token = null
    
    // Prioritas: Authorization header dulu, kemudian cookies
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7) // Remove 'Bearer ' prefix
      console.log('Token found in Authorization header')
    } else {
      const sessionCookie = cookies.get('session') || cookies.get('token') || cookies.get('auth')
      if (sessionCookie) {
        token = sessionCookie.value
        console.log('Token found in cookies:', sessionCookie.name)
      }
    }
    
    if (!token) {
      console.error('No authentication token found in headers or cookies')
      return NextResponse.json(
        { message: 'Session tidak ditemukan' },
        { status: 401 }
      )
    }

    const externalApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://31.97.61.121:3030/api/v1'
    
    console.log('Fetching users data from:', `${externalApiUrl}/admin/user`)
    console.log('Using token:', token.substring(0, 10) + '...')

    const response = await fetch(`${externalApiUrl}/admin/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
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
    
    console.log('Users API response data:', data)

    if (!response.ok) {
      console.error('External API error:', data)
      return NextResponse.json(
        { message: data.message || 'Gagal mengambil data users' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Users API error:', error)
    
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