import { LucideIcon } from 'lucide-react'
import Link from 'next/link'

interface ModuleCardProps {
  title: string
  description: string
  icon: LucideIcon
  href: string
  color?: string
  badge?: string
}

export default function ModuleCard({ 
  title, 
  description, 
  icon: Icon, 
  href, 
  color = "bg-blue-500",
  badge 
}: ModuleCardProps) {
  return (
    <Link href={href} className="module-card">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className={`module-icon ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="module-title">{title}</h3>
            <p className="module-description">{description}</p>
          </div>
        </div>
        {badge && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            {badge}
          </span>
        )}
      </div>
    </Link>
  )
} 