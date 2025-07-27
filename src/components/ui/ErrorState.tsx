import { cn } from '@/lib/utils'
import { AlertCircle, RefreshCw } from 'lucide-react'
import Button from './Button'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export default function ErrorState({
  title = 'Terjadi Kesalahan',
  message = 'Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi.',
  onRetry,
  className
}: ErrorStateProps) {
  return (
    <div className={cn('text-center py-12', className)}>
      <div className="mx-auto h-12 w-12 text-red-400 mb-4">
        <AlertCircle className="h-12 w-12" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-6">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Coba Lagi
        </Button>
      )}
    </div>
  )
} 