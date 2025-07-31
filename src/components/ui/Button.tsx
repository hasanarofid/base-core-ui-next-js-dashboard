import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'secondary' | 'danger' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses = {
      primary: 'px-4 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 bg-gradient-to-r from-brand-blue-3 to-brand-blue-4 hover:from-brand-blue-4 hover:to-brand-blue-5 text-white border-0',
      outline: 'px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 border-2 hover:border-brand-blue-3 bg-transparent text-brand-blue-3 hover:bg-brand-blue-3 hover:text-white',
      secondary: 'px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300',
      danger: 'px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 bg-red-500 hover:bg-red-600 text-white border-0',
      success: 'px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 bg-green-500 hover:bg-green-600 text-white border-0',
      warning: 'px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 bg-yellow-500 hover:bg-yellow-600 text-white border-0'
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5 text-base',
      lg: 'px-6 py-3 text-lg'
    };

    return (
      <button
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button }; 