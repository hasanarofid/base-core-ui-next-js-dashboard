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

    // PERBAIKAN: Setelah password berhasil diubah, pastikan backend mengupdate force_password_change
    // Jika backend tidak mengupdate otomatis, kita perlu memanggil API update user
    console.log('✅ Password changed successfully, checking if force_password_change needs to be updated...')
    
    try {
      // Cek data user terbaru untuk melihat apakah force_password_change sudah diupdate
      const userResponse = await fetch(`${baseUrl}/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `token=${token}`
        },
      })
      
      if (userResponse.ok) {
        const userData = await userResponse.json()
        console.log('🔍 Current user data after password change:', userData)
        
        // PERBAIKAN LOGIKA: Jika force_password_change masih false, kita perlu mengupdate menjadi true
        if (userData.user && userData.user.forcePasswordChange === false) {
          console.log('⚠️ forcePasswordChange still false, updating to true...')
          
          // Update user untuk set force_password_change menjadi true
          const updateResponse = await fetch(`${baseUrl}/user`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Cookie': `token=${token}`
            },
            body: JSON.stringify({
              id: userData.user.id,
              forcePasswordChange: true
            }),
          })
          
          if (updateResponse.ok) {
            console.log('✅ forcePasswordChange updated to true successfully')
          } else {
            console.log('⚠️ Failed to update forcePasswordChange, but password change was successful')
          }
        } else {
          console.log('✅ forcePasswordChange already true, no update needed')
        }
      }
    } catch (error) {
      console.error('❌ Error checking/updating force_password_change:', error)
      // Jangan throw error karena password change sudah berhasil
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