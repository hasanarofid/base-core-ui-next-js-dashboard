import { cn } from '@/lib/utils'

interface HeadingProps {
  children: React.ReactNode
  level?: 1 | 2 | 3 | 4 | 5 | 6
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold'
  color?: 'default' | 'muted' | 'primary'
  className?: string
}

export default function Heading({
  children,
  level = 1,
  size,
  weight = 'bold',
  color = 'default',
  className
}: HeadingProps) {
  const defaultSizes = {
    1: 'text-4xl',
    2: 'text-3xl',
    3: 'text-2xl',
    4: 'text-xl',
    5: 'text-lg',
    6: 'text-base'
  }

  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
    '6xl': 'text-6xl'
  }

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold'
  }

  const colorClasses = {
    default: 'text-gray-900',
    muted: 'text-gray-500',
    primary: 'text-primary'
  }

  const renderHeading = () => {
    const props = {
      className: cn(
        size ? sizeClasses[size] : defaultSizes[level],
        weightClasses[weight],
        colorClasses[color],
        className
      ),
      children
    }

    switch (level) {
      case 1:
        return <h1 {...props} />
      case 2:
        return <h2 {...props} />
      case 3:
        return <h3 {...props} />
      case 4:
        return <h4 {...props} />
      case 5:
        return <h5 {...props} />
      case 6:
        return <h6 {...props} />
      default:
        return <h1 {...props} />
    }
  }

  return renderHeading()
} 