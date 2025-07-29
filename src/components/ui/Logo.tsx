'use client'

import Image from 'next/image';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'svg' | 'text';
  showText?: boolean;
}

export default function Logo({ 
  className, 
  size = 'md', 
  variant = 'default',
  showText = true 
}: LogoProps) {
  const { theme, isDarkMode } = useTheme();

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  const logoSrc = variant === 'svg' 
    ? theme.logo.svg 
    : isDarkMode 
      ? theme.logo.dark 
      : theme.logo.light;

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {variant === 'svg' ? (
        <div className={cn('flex-shrink-0', sizeClasses[size])}>
          <Image
            src={logoSrc}
            alt={theme.logo.alt}
            width={48}
            height={48}
            className="w-full h-full object-contain"
          />
        </div>
      ) : (
        <div className={cn('flex-shrink-0', sizeClasses[size])}>
          <Image
            src={logoSrc}
            alt={theme.logo.alt}
            width={48}
            height={48}
            className="w-full h-full object-contain rounded-md"
          />
        </div>
      )}
      
      {showText && (
        <div className="flex flex-col">
          <span className={cn(
            'font-bold text-gray-900 dark:text-white',
            textSizeClasses[size]
          )}>
            {theme.name}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            v{theme.version}
          </span>
        </div>
      )}
    </div>
  );
} 