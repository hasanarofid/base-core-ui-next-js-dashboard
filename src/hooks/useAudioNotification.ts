import { useState, useEffect, useCallback, useRef } from 'react'

interface AudioNotificationConfig {
  enabled: boolean
  volume: number
  soundType: 'default' | 'success' | 'error' | 'warning' | 'info'
  autoPlay: boolean
}

interface UseAudioNotificationReturn {
  isSupported: boolean
  hasPermission: boolean
  isEnabled: boolean
  volume: number
  soundType: string
  requestPermission: () => Promise<boolean>
  playNotification: (type?: string) => Promise<void>
  updateConfig: (config: Partial<AudioNotificationConfig>) => void
  testSound: () => Promise<void>
}

const DEFAULT_CONFIG: AudioNotificationConfig = {
  enabled: true,
  volume: 0.5,
  soundType: 'default',
  autoPlay: true
}

// Base64 encoded notification sound (simple beep)
const BASE64_SOUND = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'

export function useAudioNotification(): UseAudioNotificationReturn {
  const [isSupported, setIsSupported] = useState(false)
  const [hasPermission, setHasPermission] = useState(false)
  const [isEnabled, setIsEnabled] = useState(DEFAULT_CONFIG.enabled)
  const [volume, setVolume] = useState(DEFAULT_CONFIG.volume)
  const [soundType, setSoundType] = useState(DEFAULT_CONFIG.soundType)
  const [autoPlay, setAutoPlay] = useState(DEFAULT_CONFIG.autoPlay)
  
  const audioContextRef = useRef<AudioContext | null>(null)

  // Check if audio is supported
  useEffect(() => {
    const checkAudioSupport = () => {
      const supported = 'AudioContext' in window || 'webkitAudioContext' in window
      setIsSupported(supported)
      
      if (supported) {
        // Initialize AudioContext
        try {
          audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
        } catch (error) {
          console.warn('AudioContext not supported:', error)
        }
      }
    }

    checkAudioSupport()
  }, [])

  // Check audio permission
  const checkPermission = useCallback(async () => {
    if (!isSupported) {
      setHasPermission(false)
      return false
    }

    try {
      // Check if we can play audio
      if (audioContextRef.current?.state === 'suspended') {
        await audioContextRef.current.resume()
      }
      
      // Try to create a simple audio context test
      const testOscillator = audioContextRef.current?.createOscillator()
      if (testOscillator) {
        setHasPermission(true)
        return true
      }
      
      setHasPermission(false)
      return false
    } catch (error) {
      console.warn('Error checking audio permission:', error)
      setHasPermission(false)
      return false
    }
  }, [isSupported])

  // Request permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      console.warn('Audio not supported in this browser')
      return false
    }

    try {
      console.log('Requesting audio permission...')
      
      // Resume AudioContext if suspended
      if (audioContextRef.current?.state === 'suspended') {
        await audioContextRef.current.resume()
      }

      // Try to play base64 sound to request permission
      const audio = new Audio(BASE64_SOUND)
      audio.volume = 0.1 // Low volume for permission request
      
      await audio.play()
      console.log('Audio permission granted')
      
      setHasPermission(true)
      setIsEnabled(true) // Auto-enable after permission granted
      return true
    } catch (error) {
      console.warn('Error requesting audio permission:', error)
      setHasPermission(false)
      return false
    }
  }, [isSupported])

  // Fallback sound using Web Audio API
  const playFallbackSound = useCallback(() => {
    if (!audioContextRef.current) return

    try {
      const oscillator = audioContextRef.current.createOscillator()
      const gainNode = audioContextRef.current.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContextRef.current.destination)

      oscillator.frequency.setValueAtTime(800, audioContextRef.current.currentTime)
      oscillator.frequency.setValueAtTime(600, audioContextRef.current.currentTime + 0.1)
      oscillator.frequency.setValueAtTime(800, audioContextRef.current.currentTime + 0.2)

      gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime)
      gainNode.gain.linearRampToValueAtTime(volume * 0.3, audioContextRef.current.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.3)

      oscillator.start(audioContextRef.current.currentTime)
      oscillator.stop(audioContextRef.current.currentTime + 0.3)
    } catch (error) {
      console.warn('Error playing fallback sound:', error)
    }
  }, [volume])

  // Create and play audio
  const playAudio = useCallback(async (soundUrl: string): Promise<void> => {
    if (!isEnabled || !hasPermission) {
      return
    }

    try {
      // Resume AudioContext if suspended
      if (audioContextRef.current?.state === 'suspended') {
        await audioContextRef.current.resume()
      }

      // Try to play the audio file first
      try {
        const audio = new Audio(soundUrl)
        audio.volume = volume
        
        // Set up error handling
        audio.addEventListener('error', (e) => {
          console.warn('Error playing audio file:', e)
          // Fallback to Web Audio API
          playFallbackSound()
        })

        // Play the audio
        await audio.play()
        
        // Clean up after playing
        audio.addEventListener('ended', () => {
          audio.remove()
        })
      } catch (fileError) {
        console.warn('Error with audio file, using fallback:', fileError)
        // Fallback to Web Audio API
        playFallbackSound()
      }
    } catch (error) {
      console.warn('Error playing audio notification:', error)
      // Fallback to default browser notification sound
      playFallbackSound()
    }
  }, [isEnabled, hasPermission, volume, playFallbackSound])

  // Play notification sound using base64 audio
  const playNotification = useCallback(async (type: string = 'default'): Promise<void> => {
    if (!isEnabled || !hasPermission) {
      console.log('Audio notification disabled or no permission')
      return
    }

    try {
      console.log('Playing notification sound for type:', type)
      
      // Create audio element with base64 sound
      const audio = new Audio(BASE64_SOUND)
      audio.volume = volume
      
      // Play the sound
      await audio.play()
      console.log('Notification sound played successfully')
      
    } catch (error) {
      console.warn('Error playing base64 audio notification:', error)
      // Fallback to Web Audio API beep
      playFallbackSound()
    }
  }, [isEnabled, hasPermission, volume, playFallbackSound])

  // Test sound
  const testSound = useCallback(async (): Promise<void> => {
    if (!hasPermission) {
      const granted = await requestPermission()
      if (!granted) {
        console.warn('Audio permission denied')
        return
      }
    }

    await playNotification('test')
  }, [hasPermission, requestPermission, playNotification])

  // Update configuration
  const updateConfig = useCallback((config: Partial<AudioNotificationConfig>) => {
    if (config.enabled !== undefined) {
      setIsEnabled(config.enabled)
    }
    if (config.volume !== undefined) {
      setVolume(Math.max(0, Math.min(1, config.volume)))
    }
    if (config.soundType !== undefined) {
      setSoundType(config.soundType)
    }
    if (config.autoPlay !== undefined) {
      setAutoPlay(config.autoPlay)
    }

    // Save to localStorage
    const currentConfig = {
      enabled: config.enabled ?? isEnabled,
      volume: config.volume ?? volume,
      soundType: config.soundType ?? soundType,
      autoPlay: config.autoPlay ?? autoPlay
    }
    
    localStorage.setItem('audioNotificationConfig', JSON.stringify(currentConfig))
  }, [isEnabled, volume, soundType, autoPlay])

  // Load config from localStorage on mount
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('audioNotificationConfig')
      if (savedConfig) {
        const config = JSON.parse(savedConfig)
        updateConfig(config)
      }
    } catch (error) {
      console.warn('Error loading audio config:', error)
    }
  }, [updateConfig])

  // Check permission on mount and auto-request if needed
  useEffect(() => {
    const initializeAudio = async () => {
      const hasPermission = await checkPermission()
      if (!hasPermission && isSupported) {
        // Auto-request permission after a short delay
        setTimeout(async () => {
          await requestPermission()
        }, 1000)
      }
    }
    
    initializeAudio()
  }, [checkPermission, requestPermission, isSupported])

  return {
    isSupported,
    hasPermission,
    isEnabled,
    volume,
    soundType,
    requestPermission,
    playNotification,
    updateConfig,
    testSound
  }
}
