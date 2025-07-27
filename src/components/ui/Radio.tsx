import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef } from 'react'

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="radio"
              className="sr-only"
              ref={ref}
              id={id}
              {...props}
            />
            <label
              htmlFor={id}
              className={cn(
                "flex items-center justify-center w-4 h-4 border border-gray-300 rounded-full cursor-pointer transition-colors",
                props.checked && "border-primary",
                error && "border-red-500",
                className
              )}
            >
              {props.checked && (
                <div className="w-2 h-2 bg-primary rounded-full" />
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

Radio.displayName = 'Radio'

export default Radio 