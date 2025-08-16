import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔍 GET /api/tenant/[id] - Fetching tenant data for ID:', params.id)
    
    // Get cookies from request
    const cookies = request.cookies
    const sessionCookie = cookies.get('session') || cookies.get('token') || cookies.get('auth')
    
    if (!sessionCookie) {
      console.log('❌ No session cookie found')
      return NextResponse.json(
        { message: 'Unauthorized - No session cookie' },
        { status: 401 }
      )
    }

    console.log('🔑 Using session cookie:', sessionCookie.name)

    // Make request to external API
    const externalApiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://31.97.61.121:3032/api/v1'}/tenant/${params.id}`
    console.log('🌐 Making request to external API:', externalApiUrl)
    
    const response = await fetch(externalApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `${sessionCookie.name}=${sessionCookie.value}`,
      },
    })

    console.log('📡 External API response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ External API error:', errorText)
      return NextResponse.json(
        { message: 'Failed to fetch tenant data from external API' },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('✅ Tenant data fetched successfully:', data)
    
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('❌ Error in GET /api/tenant/[id]:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔄 PUT /api/tenant/[id] - Updating tenant data for ID:', params.id)
    
    // Get cookies from request
    const cookies = request.cookies
    const sessionCookie = cookies.get('session') || cookies.get('token') || cookies.get('auth')
    
    if (!sessionCookie) {
      console.log('❌ No session cookie found')
      return NextResponse.json(
        { message: 'Unauthorized - No session cookie' },
        { status: 401 }
      )
    }

    console.log('🔑 Using session cookie:', sessionCookie.name)

    // Get request body
    const body = await request.json()
    console.log('📦 Request body:', body)

    // Make request to external API
    const externalApiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://31.97.61.121:3032/api/v1'}/tenant/${params.id}`
    console.log('🌐 Making request to external API:', externalApiUrl)
    
    const response = await fetch(externalApiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `${sessionCookie.name}=${sessionCookie.value}`,
      },
      body: JSON.stringify(body)
    })

    console.log('📡 External API response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ External API error:', errorText)
      return NextResponse.json(
        { message: 'Failed to update tenant data from external API' },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('✅ Tenant data updated successfully:', data)
    
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('❌ Error in PUT /api/tenant/[id]:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 