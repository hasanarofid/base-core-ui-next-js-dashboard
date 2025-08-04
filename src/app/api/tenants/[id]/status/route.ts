import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Ambil cookies dari request
    const cookies = request.cookies
    console.log('All cookies received:', Array.from(cookies.getAll()))
    
    const sessionCookie = cookies.get('session') || cookies.get('token') || cookies.get('auth')
    
    if (!sessionCookie) {
      console.error('No session cookie found')
      return NextResponse.json(
        { message: 'Session tidak ditemukan' },
        { status: 401 }
      )
    }

    const externalApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://31.97.61.121:3030/api/v1'
    const { id: tenantId } = await params
    const body = await request.json()
    
    console.log('Environment variables:')
    console.log('NEXT_PUBLIC_API_BASE_URL:', process.env.NEXT_PUBLIC_API_BASE_URL)
    console.log('External API URL:', externalApiUrl)
    console.log('Tenant ID:', tenantId)
    
    // Validasi body request
    if (!body || !body.status) {
      console.error('Invalid request body:', body)
      return NextResponse.json(
        { message: 'Status harus diisi' },
        { status: 400 }
      )
    }

    // Validasi status yang diizinkan
    const allowedStatuses = ['pending', 'suspended', 'active']
    if (!allowedStatuses.includes(body.status)) {
      console.error('Invalid status:', body.status)
      return NextResponse.json(
        { message: `Status tidak valid. Status yang diizinkan: ${allowedStatuses.join(', ')}` },
        { status: 400 }
      )
    }
    
    // Coba beberapa kemungkinan endpoint dengan PATCH method
    const possibleEndpoints = [
      `${externalApiUrl}/tenants/${tenantId}/status`,
      `${externalApiUrl}/tenants/${tenantId}`,
      `${externalApiUrl}/tenants/status/${tenantId}`,
    ]
    
    console.log('Possible endpoints:', possibleEndpoints)
    console.log('Using endpoint:', possibleEndpoints[0])
    console.log('Using session cookie:', sessionCookie.name)
    console.log('Session cookie value length:', sessionCookie.value.length)
    console.log('Status data:', body)

    // Coba endpoint satu per satu
    let response = null
    let data = null
    let lastError = null
    
    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`)
        
        response = await fetch(endpoint, {
          method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `${sessionCookie.name}=${sessionCookie.value}`,
            // Tambahkan Authorization header sebagai backup
            'Authorization': `Bearer ${sessionCookie.value}`,
      },
      body: JSON.stringify(body),
    })

        console.log(`Endpoint ${endpoint} response status:`, response.status)
        console.log(`Endpoint ${endpoint} response headers:`, Object.fromEntries(response.headers.entries()))

        // Coba parse response sebagai JSON, jika gagal ambil sebagai text
        try {
          data = await response.json()
        } catch (parseError) {
          console.error(`Failed to parse response as JSON from ${endpoint}:`, parseError)
          const textData = await response.text()
          console.log(`Response as text from ${endpoint}:`, textData)
          data = { message: 'Invalid response format from external API' }
        }
        
        console.log(`Endpoint ${endpoint} response data:`, data)

        if (response.ok) {
          console.log(`Success with endpoint: ${endpoint}`)
          break
        } else {
          console.error(`Endpoint ${endpoint} failed:`, data)
          lastError = data
        }
      } catch (fetchError) {
        console.error(`Error with endpoint ${endpoint}:`, fetchError)
        lastError = { message: fetchError instanceof Error ? fetchError.message : 'Network error' }
      }
    }

    if (!response || !response.ok) {
      console.error('All endpoints failed. Last error:', lastError)
      return NextResponse.json(
        { message: lastError?.message || 'Gagal mengubah status tenant' },
        { status: response?.status || 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Tenant status update API error:', error)
    
    // Log error details untuk debugging
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    return NextResponse.json(
      { message: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 