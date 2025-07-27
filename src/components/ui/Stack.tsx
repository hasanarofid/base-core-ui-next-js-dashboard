import { cn } from '@/lib/utils'

interface StackProps {
  children: React.ReactNode
  direction?: 'horizontal' | 'vertical'
  spacing?: 'sm' | 'md' | 'lg' | 'xl'
  align?: 'start' | 'center' | 'end' | 'stretch'
  className?: string
}

export default function Stack({
  children,
  direction = 'vertical',
  spacing = 'md',
  align = 'start',
  className
}: StackProps) {
  const directionClasses = {
    horizontal: 'flex-row',
    vertical: 'flex-col'
  }

  const spacingClasses = {
    sm: 'space-y-2 space-x-2',
    md: 'space-y-4 space-x-4',
    lg: 'space-y-6 space-x-6',
    xl: 'space-y-8 space-x-8'
  }

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  }

  return (
    <div
      className={cn(
        'flex',
        directionClasses[direction],
        spacingClasses[spacing],
        alignClasses[align],
        className
      )}
    >
      {children}
    </div>
  )
} 