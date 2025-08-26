'use client'

import React from 'react'
import { useToken } from '@/hooks/useToken'

export function TokenDebug() {
  const { token } = useToken()

  const getTokenInfo = () => {
    if (!token) {
      return {
        status: 'Tidak ada token',
        color: 'text-red-600',
        bgColor: 'bg-red-100'
      }
    }

    return {
      status: `Token: ${token.substring(0, 20)}...`,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  }

  const tokenInfo = getTokenInfo()

  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${tokenInfo.bgColor} ${tokenInfo.color}`}>
      <i className="ti ti-key w-3 h-3 mr-1" />
      {tokenInfo.status}
    </div>
  )
}
