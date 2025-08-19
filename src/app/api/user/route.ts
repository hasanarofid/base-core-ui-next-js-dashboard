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
    
    console.log('Fetching user data from:', `${externalApiUrl}/user`)
    console.log('Using session cookie:', sessionCookie.name)

    const response = await fetch(`${externalApiUrl}/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `${sessionCookie.name}=${sessionCookie.value}`,
      },
    })

    const data = await response.json()
    
    console.log('User API response status:', response.status)
    console.log('User API response data:', data)

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Gagal mengambil data user' },
        { status: response.status }
      )
    }

    // PERBAIKAN: Hapus validasi role yang membatasi akses
    // Semua user yang sudah login berhak mengakses data mereka sendiri
    // Validasi role sudah ditangani oleh backend

    return NextResponse.json(data)
  } catch (error) {
    console.error('User API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
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

    const response = await fetch(`${externalApiUrl}/user`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `${sessionCookie.name}=${sessionCookie.value}`,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    
    console.log('User update API response status:', response.status)
    console.log('User update API response data:', data)

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Gagal memperbarui data user' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('User update API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 