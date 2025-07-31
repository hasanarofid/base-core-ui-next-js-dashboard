import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Ambil cookies dari request
    const cookies = request.cookies
    const sessionCookie = cookies.get('session') || cookies.get('token') || cookies.get('auth')
    
    if (!sessionCookie) {
      return NextResponse.json(
        { 
          status: false,
          message: 'User is not logged in' 
        },
        { status: 401 }
      )
    }

    const externalApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://31.97.61.121:3030'
    
    console.log('Proxying login-status request to:', `${externalApiUrl}/login-status`)
    console.log('Using session cookie:', sessionCookie.name)

    const response = await fetch(`${externalApiUrl}/login-status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `${sessionCookie.name}=${sessionCookie.value}`,
      },
    })

    const data = await response.json()
    
    console.log('Login-status API response status:', response.status)
    console.log('Login-status API response data:', data)

    if (!response.ok) {
      return NextResponse.json(
        { 
          status: false,
          message: data.message || 'Failed to check login status' 
        },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Login-status API error:', error)
    return NextResponse.json(
      { 
        status: false,
        message: 'Internal server error' 
      },
      { status: 500 }
    )
  }
} 