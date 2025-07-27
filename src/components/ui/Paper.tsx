import { cn } from '@/lib/utils'

interface PaperProps {
  children: React.ReactNode
  elevation?: 'none' | 'sm' | 'md' | 'lg'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export default function Paper({ children, elevation = 'md', padding = 'md', className }: PaperProps) {
  const elevationClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  }

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  }

  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-gray-200',
        elevationClasses[elevation],
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  )
} 