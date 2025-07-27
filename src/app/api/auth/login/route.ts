import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const externalApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://31.97.61.121:3030'
    
    console.log('Proxying login request to:', `${externalApiUrl}`)
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

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Login failed' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 