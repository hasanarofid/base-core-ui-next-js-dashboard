'use client'

import React, { useState } from 'react'
import { useSocket } from '@/contexts/SocketContext'
import { useToken } from '@/hooks/useToken'

export function SocketTest() {
  const { socket, isConnected } = useSocket()
  const { token } = useToken()
  const [testMessage, setTestMessage] = useState('')
  const [testResult, setTestResult] = useState('')

  const testConnection = () => {
    if (!socket) {
      setTestResult('❌ Socket tidak tersedia')
      return
    }

    if (!isConnected) {
      setTestResult('❌ Socket tidak terhubung')
      return
    }

    // Test emit event
    socket.emit('test', { message: testMessage || 'Hello from client!' })
    setTestResult('✅ Test event dikirim!')
  }

  const forceReconnect = () => {
    if (socket) {
      socket.disconnect()
      setTimeout(() => {
        socket.connect()
        setTestResult('🔄 Memaksa reconnect...')
      }, 1000)
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">Test Socket.IO</h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Status Koneksi</label>
              <div className="d-flex align-items-center">
                <span className={`badge ${isConnected ? 'bg-success' : 'bg-danger'} me-2`}>
                  {isConnected ? 'Terhubung' : 'Terputus'}
                </span>
                <span className="text-muted">
                  Socket ID: {socket?.id || 'N/A'}
                </span>
              </div>
            </div>
            
            <div className="mb-3">
              <label className="form-label">Token Status</label>
              <div className="d-flex align-items-center">
                <span className={`badge ${token ? 'bg-success' : 'bg-danger'} me-2`}>
                  {token ? 'Tersedia' : 'Tidak Ada'}
                </span>
                <span className="text-muted text-truncate">
                  {token ? token.substring(0, 30) + '...' : 'Token tidak ditemukan'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Test Message</label>
              <input
                type="text"
                className="form-control"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="Pesan test..."
              />
            </div>
            
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-primary"
                onClick={testConnection}
                disabled={!isConnected}
              >
                <i className="ti ti-send me-1"></i>
                Test Send
              </button>
              
              <button
                type="button"
                className="btn btn-warning"
                onClick={forceReconnect}
              >
                <i className="ti ti-refresh me-1"></i>
                Force Reconnect
              </button>
            </div>
            
            {testResult && (
              <div className="mt-2">
                <small className="text-muted">{testResult}</small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
