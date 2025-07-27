import { cn } from '@/lib/utils'

interface CodeProps {
  children: React.ReactNode
  variant?: 'inline' | 'block'
  language?: string
  className?: string
}

export default function Code({ children, variant = 'inline', language, className }: CodeProps) {
  if (variant === 'inline') {
    return (
      <code
        className={cn(
          'relative rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-gray-900',
          className
        )}
      >
        {children}
      </code>
    )
  }

  return (
    <pre className={cn('relative rounded-lg bg-gray-900 p-4 overflow-x-auto', className)}>
      <code className="text-sm text-gray-100">
        {language && (
          <div className="mb-2 text-xs text-gray-400 uppercase tracking-wide">
            {language}
          </div>
        )}
        {children}
      </code>
    </pre>
  )
} 