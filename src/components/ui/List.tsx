import { cn } from '@/lib/utils'

interface ListProps {
  children: React.ReactNode
  ordered?: boolean
  className?: string
}

interface ListItemProps {
  children: React.ReactNode
  className?: string
}

export function List({ children, ordered = false, className }: ListProps) {
  const Component = ordered ? 'ol' : 'ul'
  
  return (
    <Component
      className={cn(
        'space-y-2',
        ordered ? 'list-decimal list-inside' : 'list-disc list-inside',
        className
      )}
    >
      {children}
    </Component>
  )
}

export function ListItem({ children, className }: ListItemProps) {
  return (
    <li className={cn('text-gray-700', className)}>
      {children}
    </li>
  )
} 