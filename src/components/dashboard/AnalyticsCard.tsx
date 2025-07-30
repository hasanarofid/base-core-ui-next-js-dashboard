import { LucideIcon } from 'lucide-react'

interface AnalyticsCardProps {
  title: string
  subtitle?: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
  }
  icon?: LucideIcon
  iconColor?: string
  bgColor?: string
  children?: React.ReactNode
}

export default function AnalyticsCard({
  title,
  subtitle,
  value,
  change,
  icon: Icon,
  iconColor = "text-blue-600",
  children
}: AnalyticsCardProps) {
  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <h6 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</h6>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-500">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`w-12 h-12 ${iconColor} bg-opacity-10 rounded-lg flex items-center justify-center ml-3`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-baseline">
          <h4 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</h4>
        </div>
        {change && (
          <div className="flex items-center">
            <span className={`text-sm font-medium ${
              change.type === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {change.type === 'increase' ? '+' : '-'}{change.value}%
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">dari bulan lalu</span>
          </div>
        )}
      </div>
      
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  )
} 