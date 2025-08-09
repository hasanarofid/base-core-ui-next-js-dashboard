import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const externalApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://31.97.61.121:3030/api/v1'
    const body = await request.json()
    
    console.log('Registering new tenant at:', `${externalApiUrl}/tenants/register`)
    console.log('Tenant registration data:', body)

    // Kirim request dengan format yang sama persis seperti Postman
    const response = await fetch(`${externalApiUrl}/tenants/register`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: body.name,
        logo_url: body.logo_url,
        domain: body.domain,
        email: body.email,
        contact_person: body.contact_person
      }),
    })

    console.log('External API response status:', response.status)
    console.log('External API response headers:', Object.fromEntries(response.headers.entries()))

    // Handle response
    let data
    try {
      const responseText = await response.text()
      console.log('Raw response text:', responseText)
      
      if (responseText.trim()) {
        data = JSON.parse(responseText)
      } else {
        data = { message: 'Empty response from server' }
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      data = { message: 'Invalid response format from server' }
    }
    
    console.log('Tenant registration API response data:', data)

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Gagal mendaftarkan tenant baru' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Tenant registration API error:', error)
    return NextResponse.json(
      { message: 'Terjadi kesalahan internal server' },
      { status: 500 }
    )
  }
} 