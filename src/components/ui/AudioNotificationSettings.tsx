'use client'

import React, { useState } from 'react'
import { useAudioNotification } from '@/hooks/useAudioNotification'

interface AudioNotificationSettingsProps {
  className?: string
  showTitle?: boolean
}

export function AudioNotificationSettings({ 
  className = '', 
  showTitle = true 
}: AudioNotificationSettingsProps) {
  const {
    isSupported,
    hasPermission,
    isEnabled,
    volume,
    soundType,
    requestPermission,
    updateConfig,
    testSound
  } = useAudioNotification()

  const [isRequesting, setIsRequesting] = useState(false)
  const [isTesting, setIsTesting] = useState(false)

  const handleRequestPermission = async () => {
    setIsRequesting(true)
    try {
      const granted = await requestPermission()
      if (granted) {
        console.log('✅ Audio permission granted')
      } else {
        console.warn('❌ Audio permission denied')
      }
    } catch (error) {
      console.error('Error requesting audio permission:', error)
    } finally {
      setIsRequesting(false)
    }
  }

  const handleTestSound = async () => {
    setIsTesting(true)
    try {
      await testSound()
    } catch (error) {
      console.error('Error testing sound:', error)
    } finally {
      setIsTesting(false)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    updateConfig({ volume: newVolume })
  }

  const handleSoundTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateConfig({ soundType: e.target.value as 'default' | 'success' | 'error' | 'warning' | 'info' })
  }

  const handleToggleEnabled = () => {
    updateConfig({ enabled: !isEnabled })
  }

  if (!isSupported) {
    return (
      <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center space-x-2">
          <i className="ti ti-volume-off text-yellow-600"></i>
          <span className="text-yellow-800">
            Audio notifications tidak didukung di browser ini
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white border rounded-lg shadow-sm ${className}`}>
      <div className="p-4">
        {showTitle && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              <i className="ti ti-volume text-blue-500 mr-2"></i>
              Pengaturan Audio Notifikasi
            </h3>
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${hasPermission ? 'text-green-600' : 'text-red-600'}`}>
                {hasPermission ? 'Izin Diberikan' : 'Izin Diperlukan'}
              </span>
              <div className={`w-2 h-2 rounded-full ${hasPermission ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>
          </div>
        )}

        {/* Permission Status */}
        {!hasPermission && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <i className="ti ti-alert-circle text-red-600"></i>
                <span className="text-red-800 text-sm">
                  Izin audio diperlukan untuk memainkan notifikasi suara
                </span>
              </div>
              <button
                onClick={handleRequestPermission}
                disabled={isRequesting}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
              >
                {isRequesting ? (
                  <>
                    <i className="ti ti-loader ti-spin mr-1"></i>
                    Meminta...
                  </>
                ) : (
                  'Minta Izin'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <i className="ti ti-bell text-gray-600"></i>
            <span className="text-gray-700">Aktifkan Audio Notifikasi</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={handleToggleEnabled}
              disabled={!hasPermission}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Volume Control */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <i className="ti ti-volume text-gray-600"></i>
              <span className="text-gray-700">Volume</span>
            </div>
            <span className="text-sm text-gray-500">{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            disabled={!isEnabled || !hasPermission}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Sound Type Selection */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <i className="ti ti-music text-gray-600"></i>
            <span className="text-gray-700">Jenis Suara</span>
          </div>
          <select
            value={soundType}
            onChange={handleSoundTypeChange}
            disabled={!isEnabled || !hasPermission}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          >
            <option value="default">Default</option>
            <option value="success">Success</option>
            <option value="error">Error</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
        </div>

        {/* Test Sound Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <i className="ti ti-player-play text-gray-600"></i>
            <span className="text-gray-700">Test Suara</span>
          </div>
          <button
            onClick={handleTestSound}
            disabled={!isEnabled || !hasPermission || isTesting}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
          >
            {isTesting ? (
              <>
                <i className="ti ti-loader ti-spin"></i>
                <span>Testing...</span>
              </>
            ) : (
              <>
                <i className="ti ti-player-play"></i>
                <span>Test</span>
              </>
            )}
          </button>
        </div>

        {/* Status Information */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
            <div>
              <span className="font-medium">Status:</span>
              <span className={`ml-1 ${isEnabled ? 'text-green-600' : 'text-red-600'}`}>
                {isEnabled ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>
            <div>
              <span className="font-medium">Browser:</span>
              <span className="ml-1">
                {isSupported ? 'Didukung' : 'Tidak Didukung'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
