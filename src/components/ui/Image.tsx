import { cn } from '@/lib/utils'
import NextImage from 'next/image'

interface ImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
  quality?: number
}

export default function Image({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  priority = false,
  quality = 75
}: ImageProps) {
  return (
    <NextImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      priority={priority}
      quality={quality}
      className={cn('object-cover', className)}
    />
  )
} 