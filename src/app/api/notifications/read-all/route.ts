import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(request: NextRequest) {
  try {
    // Ambil cookies dari request
    const cookies = request.cookies
    const sessionCookie = cookies.get('session') || cookies.get('token') || cookies.get('auth') || cookies.get('auth_token')
    
    if (!sessionCookie) {
      return NextResponse.json(
        { message: 'Unauthorized', error: 'No authentication token found' },
        { status: 401 }
      )
    }

    // Forward request to external API
    const externalApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://31.97.61.121:3030/api/v1'
    
    console.log('Marking all notifications as read at:', `${externalApiUrl}/notifications/read-all`)
    console.log('Using session cookie:', sessionCookie.name)

    const response = await fetch(`${externalApiUrl}/notifications/read-all`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `${sessionCookie.name}=${sessionCookie.value}`,
      },
    })

    const data = await response.json()
    
    console.log('Mark all as read API response status:', response.status)
    console.log('Mark all as read API response data:', data)

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Gagal menandai semua notifikasi sebagai dibaca' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    return NextResponse.json(
      { message: 'Internal server error', error: 'Failed to mark all notifications as read' },
      { status: 500 }
    )
  }
}
