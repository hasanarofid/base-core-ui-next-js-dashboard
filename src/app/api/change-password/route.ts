import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(request: NextRequest) {
  try {
    // Get cookies from the request
    const cookies = request.headers.get('cookie')
    console.log('All cookies received:', cookies)
    
    // Parse cookies to get the token
    const token = cookies?.split(';')
      .find(cookie => cookie.trim().startsWith('token='))
      ?.split('=')[1]
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token tidak ditemukan' },
        { status: 401 }
      )
    }

    // Get environment variables
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
    console.log('Environment variables:')
    console.log('NEXT_PUBLIC_API_BASE_URL:', baseUrl)
    
    if (!baseUrl) {
      return NextResponse.json(
        { error: 'API base URL tidak dikonfigurasi' },
        { status: 500 }
      )
    }

    const externalApiUrl = `${baseUrl}/change-password`
    console.log('External API URL:', externalApiUrl)
    
    // Get request body
    const body = await request.json()
    console.log('Change password data:', body)
    
    // Validate required fields
    if (!body.currentPassword || !body.newPassword) {
      return NextResponse.json(
        { error: 'currentPassword dan newPassword harus diisi' },
        { status: 400 }
      )
    }

    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Cookie': `token=${token}`
    }

    // Make request to external API
    const response = await fetch(externalApiUrl, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        currentPassword: body.currentPassword,
        newPassword: body.newPassword
      }),
    })

    console.log('External API response status:', response.status)
    console.log('External API response headers:', Object.fromEntries(response.headers.entries()))
    
    const responseData = await response.json()
    console.log('External API response data:', responseData)

    if (!response.ok) {
      return NextResponse.json(
        { error: responseData.message || 'Gagal mengubah password' },
        { status: response.status }
      )
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Error in change password API:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan internal server' },
      { status: 500 }
    )
  }
} 