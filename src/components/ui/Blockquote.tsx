import { cn } from '@/lib/utils'

interface BlockquoteProps {
  children: React.ReactNode
  className?: string
}

export default function Blockquote({ children, className }: BlockquoteProps) {
  return (
    <blockquote
      className={cn(
        'mt-6 border-l-4 border-primary pl-6 italic text-gray-600',
        className
      )}
    >
      {children}
    </blockquote>
  )
} 