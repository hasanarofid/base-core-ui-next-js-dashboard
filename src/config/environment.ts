export const isDevelopment = process.env.NODE_ENV === 'development'
export const isProduction = process.env.NODE_ENV === 'production'

export const environment = {
  isDevelopment,
  isProduction,
  apiBaseUrl: '/api',
  externalApiUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://31.97.61.121:3032/api/v1',
  enableDebug: isDevelopment,
  enableErrorBoundary: true,
  enableToastNotifications: true,
  sessionTimeout: parseInt(process.env.NEXT_PUBLIC_SESSION_TIMEOUT || '1800000'),
} as const 