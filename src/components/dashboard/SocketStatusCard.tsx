'use client'

import React from 'react'
import { useSocket } from '@/contexts/SocketContext'

export default function SocketStatusCard() {
  const { isConnected, notifications } = useSocket()

  const getConnectionStatus = () => {
    if (isConnected) {
      return {
        text: 'Terhubung',
        color: 'text-success',
        bgColor: 'bg-success',
        icon: <i className="ti ti-wifi w-4 h-4" />
      }
    } else {
      return {
        text: 'Terputus',
        color: 'text-danger',
        bgColor: 'bg-danger',
        icon: <i className="ti ti-wifi-off w-4 h-4" />
      }
    }
  }

  const status = getConnectionStatus()
  const unreadCount = notifications.length

  return (
    <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
      <div className="card">
        <div className="card-header d-flex align-items-center justify-content-between">
          <h5 className="card-title mb-0">
            <i className="ti ti-wifi me-2"></i>
            Status Real-time
          </h5>
          <div className={`badge ${status.bgColor} rounded-pill`}>
            <i className={`ti ti-activity w-3 h-3 ${isConnected ? 'animate-pulse' : ''}`} />
          </div>
        </div>
        <div className="card-body">
          <div className="d-flex align-items-center mb-3">
            <div className={`me-2 ${status.color}`}>
              {status.icon}
            </div>
            <span className={`fw-semibold ${status.color}`}>
              {status.text}
            </span>
          </div>
          
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <i className="ti ti-bell w-4 h-4 text-muted me-2" />
              <span className="text-muted">Notifikasi:</span>
            </div>
            <span className="badge bg-primary rounded-pill">
              {unreadCount}
            </span>
          </div>
          
          <div className="mt-2">
            <small className="text-muted">
              <i className="ti ti-clock w-3 h-3 me-1" />
              {isConnected ? 'Koneksi aktif' : 'Mencoba menghubungkan...'}
            </small>
          </div>
        </div>
      </div>
    </div>
  )
}
