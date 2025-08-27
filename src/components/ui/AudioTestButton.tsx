'use client'

import React, { useState } from 'react'
import { useAudioNotification } from '@/hooks/useAudioNotification'

export function AudioTestButton() {
  const { isSupported, hasPermission, isEnabled, requestPermission, testSound } = useAudioNotification()
  const [isTesting, setIsTesting] = useState(false)

  const handleTest = async () => {
    setIsTesting(true)
    try {
      if (!hasPermission) {
        const granted = await requestPermission()
        if (!granted) {
          alert('Audio permission denied. Please allow audio in your browser settings.')
          return
        }
      }
      
      await testSound()
    } catch (error) {
      console.error('Error testing audio:', error)
      alert('Error testing audio. Check console for details.')
    } finally {
      setIsTesting(false)
    }
  }

  if (!isSupported) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">Audio not supported in this browser</p>
      </div>
    )
  }

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="text-lg font-semibold text-blue-900 mb-2">Audio Test</h3>
      <div className="space-y-2">
        <p className="text-sm text-blue-700">
          Status: {hasPermission ? '✅ Permission Granted' : '❌ Permission Required'}
        </p>
        <p className="text-sm text-blue-700">
          Enabled: {isEnabled ? '✅ Yes' : '❌ No'}
        </p>
        <button
          onClick={handleTest}
          disabled={isTesting}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isTesting ? 'Testing...' : 'Test Audio Notification'}
        </button>
      </div>
    </div>
  )
}
