'use client'

import React, { useState, useEffect } from 'react'
import { useSocket } from '@/contexts/SocketContext'
import { SOCKET_CONFIG } from '@/config/socket'

interface SocketStatusProps {
  showDetails?: boolean
  className?: string
}

export function SocketStatus({ showDetails = false, className = '' }: SocketStatusProps) {
  const { socket, isConnected } = useSocket()
  const [isExpanded, setIsExpanded] = useState(false)
  const [recentEvents, setRecentEvents] = useState<Array<{ event: string; timestamp: Date; data: unknown }>>([])

  // Listen for socket notifications
  useEffect(() => {
    const handleSocketNotification = (event: CustomEvent) => {
      const { eventName, data } = event.detail
      setRecentEvents(prev => [
        { event: eventName, timestamp: new Date(), data },
        ...prev.slice(0, 9) // Keep only last 10 events
      ])
    }

    window.addEventListener('socketNotification', handleSocketNotification as EventListener)
    
    return () => {
      window.removeEventListener('socketNotification', handleSocketNotification as EventListener)
    }
  }, [])

  const getStatusColor = () => {
    if (!socket) return 'text-gray-500'
    if (isConnected) return 'text-green-500'
    return 'text-red-500'
  }

  const getStatusText = () => {
    if (!socket) return 'Disconnected'
    if (isConnected) return 'Connected'
    return 'Disconnected'
  }

  const getStatusIcon = () => {
    if (!socket) return 'ti-circle-x'
    if (isConnected) return 'ti-circle-check'
    return 'ti-circle-x'
  }

  if (!showDetails) {
    return (
      <div className={`flex items-center space-x-2 text-sm ${className}`}>
        <i className={`ti ${getStatusIcon()} ${getStatusColor()}`}></i>
        <span className={getStatusColor()}>
          Socket: {getStatusText()}
        </span>
      </div>
    )
  }

  return (
    <div className={`bg-white border rounded-lg shadow-sm ${className}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Socket Status</h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className={`ti ${isExpanded ? 'ti-chevron-up' : 'ti-chevron-down'}`}></i>
          </button>
        </div>

        {/* Connection Status */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <i className={`ti ${getStatusIcon()} ${getStatusColor()}`}></i>
            <span className={getStatusColor()}>
              {getStatusText()}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <i className="ti ti-headphones text-gray-500"></i>
            <span className="text-gray-500">
              Status Only
            </span>
          </div>
        </div>

        {/* Event Count */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">Events Received:</span>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-blue-600">N/A</span>
          </div>
        </div>

        {/* Last Event */}
        <div className="mb-4">
          <span className="text-sm text-gray-600">Last Event:</span>
          <div className="mt-1 p-2 bg-gray-50 rounded text-sm font-mono">
            N/A
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="border-t pt-4">
            {/* Socket Info */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Socket Information</h4>
              <div className="text-xs space-y-1">
                <div>ID: {socket?.id || 'N/A'}</div>
                <div>Transport: {socket?.io?.engine?.transport?.name || 'N/A'}</div>
                <div>Connected: {socket?.connected ? 'Yes' : 'No'}</div>
              </div>
            </div>

            {/* Event Categories */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Listening to Events</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(SOCKET_CONFIG.EVENT_CATEGORIES).map(([category, events]) => (
                  <div key={category} className="bg-gray-50 p-2 rounded">
                    <div className="font-semibold text-gray-700 capitalize">{category}</div>
                    <div className="text-gray-500">{events.length} events</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Events */}
            {recentEvents.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Recent Events</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {recentEvents.map((event, index) => (
                    <div key={index} className="bg-gray-50 p-2 rounded text-xs">
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-blue-600">{event.event}</span>
                        <span className="text-gray-500">
                          {event.timestamp.toLocaleTimeString()}
                        </span>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
