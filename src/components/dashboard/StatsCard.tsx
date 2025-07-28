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
  iconBgColor?: string
}

export default function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = "text-blue-600",
  iconBgColor = "bg-blue-100"
}: StatsCardProps) {
  return (
    <div className="stats-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="stats-label">{title}</p>
          <h3 className="stats-value">{value}</h3>
          {change && (
            <p className={`stats-change ${change.type === 'increase' ? 'positive' : 'negative'}`}>
              {change.type === 'increase' ? '+' : '-'}{change.value}% dari bulan lalu
            </p>
          )}
        </div>
        <div className={`stats-icon ${iconBgColor}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  )
} 