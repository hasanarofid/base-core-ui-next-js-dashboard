import { cn } from '@/lib/utils'

interface GroupProps {
  children: React.ReactNode
  orientation?: 'horizontal' | 'vertical'
  spacing?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export default function Group({
  children,
  orientation = 'horizontal',
  spacing = 'md',
  className
}: GroupProps) {
  const orientationClasses = {
    horizontal: 'flex-row',
    vertical: 'flex-col'
  }

  const spacingClasses = {
    sm: 'space-y-2 space-x-2',
    md: 'space-y-4 space-x-4',
    lg: 'space-y-6 space-x-6',
    xl: 'space-y-8 space-x-8'
  }

  return (
    <div
      className={cn(
        'flex',
        orientationClasses[orientation],
        spacingClasses[spacing],
        className
      )}
    >
      {children}
    </div>
  )
} 