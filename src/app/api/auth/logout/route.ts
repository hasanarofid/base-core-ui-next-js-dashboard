import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
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
    
    console.log('Proxying logout request to:', `${externalApiUrl}/logout`)
    console.log('Using session cookie:', sessionCookie.name)

    const response = await fetch(`${externalApiUrl}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `${sessionCookie.name}=${sessionCookie.value}`,
      },
    })

    const data = await response.json()
    
    console.log('Logout API response status:', response.status)
    console.log('Logout API response data:', data)

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Logout failed' },
        { status: response.status }
      )
    }

    // Buat response dengan data
    const nextResponse = NextResponse.json(data)
    
    // Clear cookies jika logout berhasil
    nextResponse.cookies.delete('session')
    nextResponse.cookies.delete('token')
    nextResponse.cookies.delete('auth')

    return nextResponse
  } catch (error) {
    console.error('Logout API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 