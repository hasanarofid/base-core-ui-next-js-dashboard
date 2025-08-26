import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { message: 'Bad Request', error: 'Notification ID is required' },
        { status: 400 }
      )
    }

    // Forward request to external API
    const externalApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://31.97.61.121:3030/api/v1'
    
    console.log('Marking notification as read at:', `${externalApiUrl}/notifications/${id}/read`)
    console.log('Using session cookie:', sessionCookie.name)

    const response = await fetch(`${externalApiUrl}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `${sessionCookie.name}=${sessionCookie.value}`,
      },
    })

    const data = await response.json()
    
    console.log('Mark as read API response status:', response.status)
    console.log('Mark as read API response data:', data)

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Gagal menandai notifikasi sebagai dibaca' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return NextResponse.json(
      { message: 'Internal server error', error: 'Failed to mark notification as read' },
      { status: 500 }
    )
  }
}
