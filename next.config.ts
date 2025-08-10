import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
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
