'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'

interface BrandColorsProps {
  className?: string
  showLabels?: boolean
  showHex?: boolean
}

export default function BrandColors({ 
  className, 
  showLabels = true, 
  showHex = true 
}: BrandColorsProps) {
  const { theme } = useTheme()

  const brandColors = [
    { name: 'Blue 1', color: theme.colors.brand.blue[0], class: 'bg-brand-blue-1' },
    { name: 'Blue 2', color: theme.colors.brand.blue[1], class: 'bg-brand-blue-2' },
    { name: 'Blue 3', color: theme.colors.brand.blue[2], class: 'bg-brand-blue-3' },
    { name: 'Blue 4', color: theme.colors.brand.blue[3], class: 'bg-brand-blue-4' },
    { name: 'Blue 5', color: theme.colors.brand.blue[4], class: 'bg-brand-blue-5' },
    { name: 'Yellow', color: theme.colors.brand.yellow, class: 'bg-brand-yellow' },
    { name: 'Typeface', color: theme.colors.brand.typeface, class: 'bg-brand-typeface' },
  ]

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4', className)}>
      {brandColors.map((brandColor) => (
        <div key={brandColor.name} className="flex flex-col items-center space-y-2">
          <div 
            className={cn(
              'w-16 h-16 rounded-lg shadow-md border border-gray-200 dark:border-gray-700',
              brandColor.class
            )}
            style={{ backgroundColor: brandColor.color }}
            title={`${brandColor.name}: ${brandColor.color}`}
          />
          
          {showLabels && (
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {brandColor.name}
              </p>
              {showHex && (
                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                  {brandColor.color}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// Individual color components for easy use
export function BrandBlue1({ className }: { className?: string }) {
  const { theme } = useTheme()
  return (
    <div 
      className={cn('bg-brand-blue-1', className)}
      style={{ backgroundColor: theme.colors.brand.blue[0] }}
    />
  )
}

export function BrandBlue2({ className }: { className?: string }) {
  const { theme } = useTheme()
  return (
    <div 
      className={cn('bg-brand-blue-2', className)}
      style={{ backgroundColor: theme.colors.brand.blue[1] }}
    />
  )
}

export function BrandBlue3({ className }: { className?: string }) {
  const { theme } = useTheme()
  return (
    <div 
      className={cn('bg-brand-blue-3', className)}
      style={{ backgroundColor: theme.colors.brand.blue[2] }}
    />
  )
}

export function BrandBlue4({ className }: { className?: string }) {
  const { theme } = useTheme()
  return (
    <div 
      className={cn('bg-brand-blue-4', className)}
      style={{ backgroundColor: theme.colors.brand.blue[3] }}
    />
  )
}

export function BrandBlue5({ className }: { className?: string }) {
  const { theme } = useTheme()
  return (
    <div 
      className={cn('bg-brand-blue-5', className)}
      style={{ backgroundColor: theme.colors.brand.blue[4] }}
    />
  )
}

export function BrandYellow({ className }: { className?: string }) {
  const { theme } = useTheme()
  return (
    <div 
      className={cn('bg-brand-yellow', className)}
      style={{ backgroundColor: theme.colors.brand.yellow }}
    />
  )
}

export function BrandTypeface({ className }: { className?: string }) {
  const { theme } = useTheme()
  return (
    <div 
      className={cn('bg-brand-typeface', className)}
      style={{ backgroundColor: theme.colors.brand.typeface }}
    />
  )
} 