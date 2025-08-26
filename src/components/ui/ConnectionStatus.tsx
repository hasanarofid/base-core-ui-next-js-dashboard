'use client'

import React from 'react'
import { useSocket } from '@/contexts/SocketContext'
import { useToken } from '@/hooks/useToken'

export function ConnectionStatus() {
  const { isConnected } = useSocket()
  const { token } = useToken()

  const getStatusInfo = () => {
    if (!token) {
      return {
        text: 'Token tidak ditemukan',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        icon: 'ti ti-alert-circle'
      }
    }

    if (isConnected) {
      return {
        text: 'Terhubung',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        icon: 'ti ti-wifi'
      }
    } else {
      return {
        text: 'Mencoba menghubungkan...',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        icon: 'ti ti-wifi-off'
      }
    }
  }

  const status = getStatusInfo()

  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.color}`}>
      <i className={`${status.icon} w-3 h-3 mr-1`} />
      {status.text}
    </div>
  )
}
