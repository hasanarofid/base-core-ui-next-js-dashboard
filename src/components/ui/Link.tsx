import { cn } from '@/lib/utils'
import NextLink from 'next/link'

interface LinkProps {
  href: string
  children: React.ReactNode
  external?: boolean
  className?: string
}

export default function Link({ href, children, external = false, className }: LinkProps) {
  const baseClasses = 'text-primary hover:text-primary-dark underline underline-offset-4'

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(baseClasses, className)}
      >
        {children}
      </a>
    )
  }

  return (
    <NextLink href={href} className={cn(baseClasses, className)}>
      {children}
    </NextLink>
  )
} 