import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef } from 'react'
import { Check } from 'lucide-react'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
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
                "flex items-center justify-center w-4 h-4 border border-gray-300 rounded cursor-pointer transition-colors",
                props.checked && "bg-primary border-primary",
                error && "border-red-500",
                className
              )}
            >
              {props.checked && (
                <Check className="w-3 h-3 text-white" />
              )}
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

Checkbox.displayName = 'Checkbox'

export default Checkbox 