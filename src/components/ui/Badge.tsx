import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className
}: BadgeProps) {
  const variants = {
    default: 'bg-label-secondary text-secondary border-secondary',
    primary: 'bg-label-primary text-brand-blue-3 border-brand-blue-3',
    success: 'bg-label-success text-success border-success',
    warning: 'bg-label-warning text-brand-yellow border-brand-yellow',
    danger: 'bg-label-danger text-danger border-danger',
    info: 'bg-label-info text-brand-blue-2 border-brand-blue-2'
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs font-semibold',
    md: 'px-2.5 py-0.5 text-sm font-semibold',
    lg: 'px-3 py-1 text-base font-semibold'
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border transition-all duration-300 hover:scale-105',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  )
} 