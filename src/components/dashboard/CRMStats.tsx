'use client'

import { 
  DollarSign, 
  Users, 
  ShoppingCart, 
  Activity, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

interface CRMStatsProps {
  data: {
    revenue: {
      value: string
      change: string
      isPositive: boolean
    }
    leads: {
      value: string
      change: string
      isPositive: boolean
    }
    orders: {
      value: string
      change: string
      isPositive: boolean
    }
    conversion: {
      value: string
      change: string
      isPositive: boolean
    }
  }
}

export default function CRMStats({ data }: CRMStatsProps) {
  const stats = [
    {
      icon: DollarSign,
      value: data.revenue.value,
      label: 'Total Revenue',
      change: data.revenue.change,
      isPositive: data.revenue.isPositive,
      color: 'from-brand-blue-3 to-brand-blue-4'
    },
    {
      icon: Users,
      value: data.leads.value,
      label: 'Total Leads',
      change: data.leads.change,
      isPositive: data.leads.isPositive,
      color: 'from-brand-blue-2 to-brand-blue-3'
    },
    {
      icon: ShoppingCart,
      value: data.orders.value,
      label: 'Total Orders',
      change: data.orders.change,
      isPositive: data.orders.isPositive,
      color: 'from-brand-blue-1 to-brand-blue-2'
    },
    {
      icon: Activity,
      value: data.conversion.value,
      label: 'Conversion Rate',
      change: data.conversion.change,
      isPositive: data.conversion.isPositive,
      color: 'from-brand-blue-4 to-brand-blue-5'
    }
  ]

  return (
    <div className="row mb-4">
      {stats.map((stat, index) => (
        <div key={index} className="col-lg-3 col-md-6 mb-4">
          <div className="stats-card">
            <div className="stats-icon">
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div className="stats-value">{stat.value}</div>
            <div className="stats-label">{stat.label}</div>
            <div className={`stats-change ${stat.isPositive ? 'positive' : 'negative'}`}>
              {stat.isPositive ? (
                <ArrowUpRight className="w-4 h-4 me-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 me-1" />
              )}
              {stat.change}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 