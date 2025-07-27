import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef } from 'react'

interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              ref={ref}
              id={id}
              {...props}
            />
            <label
              htmlFor={id}
              className={cn(
                "flex items-center w-11 h-6 bg-gray-200 rounded-full cursor-pointer transition-colors",
                props.checked && "bg-primary",
                error && "bg-red-200",
                className
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 bg-white rounded-full shadow transform transition-transform",
                  props.checked && "translate-x-5"
                )}
              />
            </label>
          </div>
          {label && (
            <label htmlFor={id} className="text-sm font-medium text-gray-700 cursor-pointer">
              {label}
            </label>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }
)

Switch.displayName = 'Switch'

export default Switch 