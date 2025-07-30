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
    
    console.log('Proxying refresh request to:', `${externalApiUrl}/refresh`)
    console.log('Using session cookie:', sessionCookie.name)

    const response = await fetch(`${externalApiUrl}/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `${sessionCookie.name}=${sessionCookie.value}`,
      },
    })

    const data = await response.json()
    
    console.log('Refresh API response status:', response.status)
    console.log('Refresh API response data:', data)

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Refresh failed' },
        { status: response.status }
      )
    }

    // Buat response dengan data
    const nextResponse = NextResponse.json(data)
    
    // Ambil cookies dari external API response dan set ke Next.js response
    const setCookieHeader = response.headers.get('set-cookie')
    if (setCookieHeader) {
      console.log('Setting cookies from external API:', setCookieHeader)
      nextResponse.headers.set('Set-Cookie', setCookieHeader)
    }

    return nextResponse
  } catch (error) {
    console.error('Refresh API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 