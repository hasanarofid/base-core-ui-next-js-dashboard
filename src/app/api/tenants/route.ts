import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
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
    
    console.log('Fetching tenants data from:', `${externalApiUrl}/tenants`)
    console.log('Using session cookie:', sessionCookie.name)

    const response = await fetch(`${externalApiUrl}/tenants`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `${sessionCookie.name}=${sessionCookie.value}`,
      },
    })

    const data = await response.json()
    
    console.log('Tenants API response status:', response.status)
    console.log('Tenants API response data:', data)

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Gagal mengambil data tenants' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Tenants API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 

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
    const body = await request.json()
    
    console.log('Creating tenant at:', `${externalApiUrl}/tenants/register`)
    console.log('Using session cookie:', sessionCookie.name)
    console.log('Tenant data:', body)

    const response = await fetch(`${externalApiUrl}/tenants/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `${sessionCookie.name}=${sessionCookie.value}`,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    
    console.log('Tenant creation API response status:', response.status)
    console.log('Tenant creation API response data:', data)

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Gagal membuat tenant baru' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Tenant creation API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 