import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
  }
  icon: LucideIcon
  iconColor?: string
  className?: string
}

export default function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = 'text-blue-600',
  className
}: StatsCardProps) {
  return (
    <div className={cn(
      "bg-white rounded-lg shadow-sm border border-gray-200 p-6",
      className
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <span
                className={cn(
                  "text-sm font-medium",
                  change.type === 'increase' ? 'text-green-600' : 'text-red-600'
                )}
              >
                {change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">dari bulan lalu</span>
            </div>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-lg",
          iconColor.replace('text-', 'bg-').replace('-600', '-100')
        )}>
          <Icon className={cn("w-6 h-6", iconColor)} />
        </div>
      </div>
    </div>
  )
} 