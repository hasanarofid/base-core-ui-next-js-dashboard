import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const externalApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://31.97.61.121:3030/api/v1'
    
    console.log('Proxying login request to:', `${externalApiUrl}/login`)
    console.log('Request body:', body)
    
    const response = await fetch(`${externalApiUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    
    console.log('Response status:', response.status)
    console.log('Response data:', data)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Login failed' },
        { status: response.status }
      )
    }

    // Buat response dengan data
    const nextResponse = NextResponse.json(data)
    
    // Ambil cookies dari external API response dan set ke Next.js response
    const setCookieHeader = response.headers.get('set-cookie')
    if (setCookieHeader) {
      console.log('Setting cookies from external API:', setCookieHeader)
      
      // Parse dan set cookies satu per satu
      const cookies = setCookieHeader.split(',')
      cookies.forEach(cookie => {
        const [nameValue, ...options] = cookie.trim().split(';')
        const [name, value] = nameValue.split('=')
        
        if (name && value) {
          const cookieOptions: {
            httpOnly?: boolean;
            secure?: boolean;
            sameSite?: 'lax' | 'strict' | 'none';
            path?: string;
            maxAge?: number;
            expires?: Date;
            domain?: string;
          } = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            path: '/',
          }
          
          // Parse options
          options.forEach(option => {
            const [key, val] = option.trim().split('=')
            if (key.toLowerCase() === 'max-age') {
              cookieOptions.maxAge = parseInt(val)
            } else if (key.toLowerCase() === 'expires') {
              cookieOptions.expires = new Date(val)
            } else if (key.toLowerCase() === 'domain') {
              cookieOptions.domain = val
            } else if (key.toLowerCase() === 'path') {
              cookieOptions.path = val
            } else if (key.toLowerCase() === 'secure') {
              cookieOptions.secure = true
            } else if (key.toLowerCase() === 'httponly') {
              cookieOptions.httpOnly = true
            } else if (key.toLowerCase() === 'samesite') {
              cookieOptions.sameSite = val as 'lax' | 'strict' | 'none'
            }
          })
          
          nextResponse.cookies.set(name.trim(), value.trim(), cookieOptions)
        }
      })
    }

    return nextResponse
  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 