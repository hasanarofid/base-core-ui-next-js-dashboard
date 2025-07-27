'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

interface AccordionItem {
  id: string
  title: string
  content: React.ReactNode
  disabled?: boolean
}

interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
  defaultOpen?: string[]
  className?: string
}

export default function Accordion({
  items,
  allowMultiple = false,
  defaultOpen = [],
  className
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen)

  const toggleItem = (itemId: string) => {
    if (allowMultiple) {
      setOpenItems(prev =>
        prev.includes(itemId)
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      )
    } else {
      setOpenItems(prev =>
        prev.includes(itemId) ? [] : [itemId]
      )
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item) => (
        <div
          key={item.id}
          className="border border-gray-200 rounded-lg overflow-hidden"
        >
          <button
            onClick={() => !item.disabled && toggleItem(item.id)}
            disabled={item.disabled}
            className={cn(
              'w-full flex items-center justify-between px-4 py-3 text-left bg-white hover:bg-gray-50 transition-colors',
              item.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <span className="font-medium text-gray-900">{item.title}</span>
            <ChevronDown
              className={cn(
                'w-4 h-4 text-gray-500 transition-transform',
                openItems.includes(item.id) && 'rotate-180'
              )}
            />
          </button>
          {openItems.includes(item.id) && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  )
} 