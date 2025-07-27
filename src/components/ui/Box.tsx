import { cn } from '@/lib/utils'

interface BoxProps {
  children: React.ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  margin?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export default function Box({ children, padding = 'md', margin = 'none', className }: BoxProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  }

  const marginClasses = {
    none: '',
    sm: 'm-2',
    md: 'm-4',
    lg: 'm-6',
    xl: 'm-8'
  }

  return (
    <div
      className={cn(
        paddingClasses[padding],
        marginClasses[margin],
        className
      )}
    >
      {children}
    </div>
  )
} 