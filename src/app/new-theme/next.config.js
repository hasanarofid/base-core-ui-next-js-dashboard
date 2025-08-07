/** @type {import('next').NextConfig} */
const nextConfig = {
  // Mengizinkan external scripts
  experimental: {
    esmExternals: 'loose',
  },
  
  // Konfigurasi untuk static assets
  async headers() {
    return [
      {
        source: '/theme/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Konfigurasi untuk images
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  
  // Konfigurasi untuk webpack
  webpack: (config, { isServer }) => {
    // Mengizinkan external scripts
    config.externals = config.externals || [];
    if (!isServer) {
      config.externals.push({
        'jquery': 'jQuery',
        'bootstrap': 'bootstrap',
        'swiper': 'Swiper',
        'apexcharts': 'ApexCharts',
      });
    }
    
    return config;
  },
};

module.exports = nextConfig; 