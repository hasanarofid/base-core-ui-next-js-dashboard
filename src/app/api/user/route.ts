import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Debug request info
    console.log('🔍 GET /api/user called')
    console.log('🔍 Request method:', request.method)
    console.log('🔍 Request URL:', request.url)
    
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

export async function PATCH(request: NextRequest) {
  try {
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
    
    // Hanya baca body jika method adalah PATCH dan content-length > 0
    let body = null
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > 0) {
      try {
        body = await request.json()
      } catch (error) {
        console.error('Error parsing request body:', error)
        return NextResponse.json(
          { message: 'Invalid request body format' },
          { status: 400 }
        )
      }
    }
    
    console.log('Environment variables:')
    console.log('NEXT_PUBLIC_API_BASE_URL:', process.env.NEXT_PUBLIC_API_BASE_URL)
    console.log('External API URL:', externalApiUrl)
    console.log('Update user data:', body)

    // Validasi body request
    if (!body || !body.id) {
      console.error('Invalid request body:', body)
      return NextResponse.json(
        { message: 'ID user harus diisi' },
        { status: 400 }
      )
    }

    const response = await fetch(`${externalApiUrl}/admin/user`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
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
    
    console.log('User update API response data:', data)

    if (!response.ok) {
      console.error('External API error:', data)
      return NextResponse.json(
        { message: data.message || 'Gagal memperbarui data user' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('User update API error:', error)
    
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