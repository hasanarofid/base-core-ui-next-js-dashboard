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
  bgColor = "bg-white",
  children
}: AnalyticsCardProps) {
  return (
    <div className={`analytics-card ${bgColor === 'gradient' ? 'gradient' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="card-title">{title}</h3>
          {subtitle && (
            <p className="card-subtitle">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`w-10 h-10 ${iconColor} bg-opacity-10 rounded-lg flex items-center justify-center`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <p className="card-value">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <span className={`card-change ${
                change.type === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {change.type === 'increase' ? '+' : '-'}{change.value}%
              </span>
              <span className="text-sm text-gray-500 ml-1">dari bulan lalu</span>
            </div>
          )}
        </div>
      </div>
      
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  )
} 