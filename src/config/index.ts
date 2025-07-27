import { environment } from './environment'

export const config = {
  api: {
    baseURL: environment.apiBaseUrl,
    timeout: 10000,
  },
  auth: {
    sessionTimeout: environment.sessionTimeout,
    tokenKey: 'token',
    refreshTokenKey: 'refreshToken',
    userKey: 'user',
  },
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Vuexy Dashboard',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  },
  features: {
    enableSessionTimeout: true,
    enableAutoRefresh: true,
    enableErrorBoundary: environment.enableErrorBoundary,
    enableToastNotifications: environment.enableToastNotifications,
  },
  environment,
} as const 