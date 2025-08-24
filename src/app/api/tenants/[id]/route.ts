import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id: tenantId } = await params
    
    console.log('Fetching tenant data from:', `${externalApiUrl}/tenants/${tenantId}`)
    console.log('Using session cookie:', sessionCookie.name)

    const response = await fetch(`${externalApiUrl}/tenants/${tenantId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `${sessionCookie.name}=${sessionCookie.value}`,
      },
    })

    const data = await response.json()
    
    console.log('Tenant API response status:', response.status)
    console.log('Tenant API response data:', data)

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Gagal mengambil data tenant' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Tenant API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id: tenantId } = await params
    const body = await request.json()
    
    // Transform data untuk memastikan format yang benar
    const transformedBody = {
      name: body.name,
      logo_url: body.logo_url,
      domain: body.domain,
      email: body.email,
      contact_person: body.contact_person,
      config_json: {
        callbackUrl: body.config_json?.callbackUrl || null,
        ipWhitelist: body.config_json?.ipWhitelist || null
      }
    }
    
    console.log('Updating tenant data from:', `${externalApiUrl}/tenants/${tenantId}`)
    console.log('Using session cookie:', sessionCookie.name)
    console.log('Update data:', transformedBody)

    const response = await fetch(`${externalApiUrl}/tenants/${tenantId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `${sessionCookie.name}=${sessionCookie.value}`,
      },
      body: JSON.stringify(transformedBody),
    })

    const data = await response.json()
    
    console.log('Tenant update API response status:', response.status)
    console.log('Tenant update API response data:', data)

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Gagal memperbarui data tenant' },
        { status: response.status }
      )
    }

    // Format response sesuai requirement
    const formattedResponse = {
      message: "Tenant updated successfully",
      data: data.data || data
    };

    return NextResponse.json(formattedResponse)
  } catch (error) {
    console.error('Tenant update API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id: tenantId } = await params
    
    console.log('Deleting tenant from:', `${externalApiUrl}/tenants/${tenantId}`)
    console.log('Using session cookie:', sessionCookie.name)

    const response = await fetch(`${externalApiUrl}/tenants/${tenantId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `${sessionCookie.name}=${sessionCookie.value}`,
      },
    })

    const data = await response.json()
    
    console.log('Tenant delete API response status:', response.status)
    console.log('Tenant delete API response data:', data)

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Gagal menghapus tenant' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Tenant delete API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 