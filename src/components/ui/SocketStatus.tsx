'use client'

import React from 'react'
import { useSocket } from '@/contexts/SocketContext'

export function SocketStatus() {
  const { isConnected } = useSocket()

  return (
    <div className="flex items-center justify-center rounded-md transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800 w-10 h-10">
      <div className="flex items-center space-x-1">
        {isConnected ? (
          <>
            <i className="ti ti-wifi w-4 h-4 text-green-500" />
            <span className="text-xs text-green-600 font-medium">Terhubung</span>
          </>
        ) : (
          <>
            <i className="ti ti-wifi-off w-4 h-4 text-red-500" />
            <span className="text-xs text-red-600 font-medium">Terputus</span>
          </>
        )}
      </div>
      
      <div className="flex items-center space-x-1 ml-1">
        <i className={`ti ti-activity w-3 h-3 ${isConnected ? 'text-green-500 animate-pulse' : 'text-red-500'}`} />
      </div>
    </div>
  )
}
