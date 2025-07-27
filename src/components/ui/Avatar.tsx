import { cn } from '@/lib/utils'
import { User } from 'lucide-react'

interface AvatarProps {
  src?: string
  alt?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fallback?: string
  className?: string
}

export default function Avatar({
  src,
  alt,
  size = 'md',
  fallback,
  className
}: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt || 'Avatar'}
        className={cn(
          'rounded-full object-cover',
          sizeClasses[size],
          className
        )}
      />
    )
  }

  if (fallback) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-primary text-white rounded-full font-medium',
          sizeClasses[size],
          textSizeClasses[size],
          className
        )}
      >
        {getInitials(fallback)}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center bg-gray-200 text-gray-500 rounded-full',
        sizeClasses[size],
        className
      )}
    >
      <User className={cn('text-gray-400', sizeClasses[size])} />
    </div>
  )
} 