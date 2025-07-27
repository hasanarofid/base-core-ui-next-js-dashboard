import { cn } from '@/lib/utils'

interface SectionProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  className?: string
}

export default function Section({ children, title, subtitle, className }: SectionProps) {
  return (
    <section className={cn('py-8', className)}>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          )}
          {subtitle && (
            <p className="text-gray-600">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </section>
  )
} 