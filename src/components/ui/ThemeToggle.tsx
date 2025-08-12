'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function ThemeToggle({ 
  className, 
  showLabel = false, 
  size = 'md' 
}: ThemeToggleProps) {
  const { isDarkMode, toggleDarkMode } = useTheme()

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <button
      onClick={toggleDarkMode}
      className={cn(
        'theme-toggle-btn flex items-center justify-center rounded-md transition-all duration-200',
        'hover:bg-gray-100 dark:hover:bg-gray-700',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800',
        sizeClasses[size],
        className
      )}
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDarkMode ? (
        <Sun className={cn(iconSizes[size], 'text-yellow-500')} />
      ) : (
        <Moon className={cn(iconSizes[size], 'text-gray-600')} />
      )}
      
      {showLabel && (
        <span className="ml-2 text-sm font-medium">
          {isDarkMode ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  )
} 