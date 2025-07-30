import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost'],
  },
  // Add static file serving for template assets
  async rewrites() {
    return [
      {
        source: '/theme/:path*',
        destination: '/public/theme/:path*',
      },
    ]
  },
}

export default nextConfig
