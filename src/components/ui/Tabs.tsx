'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Tab {
  id: string
  label: string
  content: React.ReactNode
  disabled?: boolean
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  className?: string
  variant?: 'default' | 'pills'
}

export default function Tabs({ tabs, defaultTab, className, variant = 'default' }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  const variantClasses = {
    default: {
      container: 'border-b border-gray-200',
      tab: 'border-b-2 border-transparent px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300',
      active: 'border-primary text-primary'
    },
    pills: {
      container: 'space-x-1',
      tab: 'px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50',
      active: 'bg-primary text-white border-primary'
    }
  }

  const currentVariant = variantClasses[variant]

  return (
    <div className={className}>
      <div className={cn('flex', currentVariant.container)}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && setActiveTab(tab.id)}
            disabled={tab.disabled}
            className={cn(
              currentVariant.tab,
              activeTab === tab.id && currentVariant.active,
              tab.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  )
} 