import { config } from '@/config'

export function debugLog(message: string, data?: unknown) {
  if (config.environment.enableDebug) {
    console.log(`[DEBUG] ${message}`, data)
  }
}

export function debugError(message: string, error?: unknown) {
  if (config.environment.enableDebug) {
    console.error(`[DEBUG ERROR] ${message}`, error)
  }
}

export function debugApiRequest(method: string, url: string, data?: unknown) {
  if (config.environment.enableDebug) {
    console.log(`[API REQUEST] ${method} ${url}`, data)
  }
}

export function debugApiResponse(method: string, url: string, status: number, data?: unknown) {
  if (config.environment.enableDebug) {
    console.log(`[API RESPONSE] ${method} ${url} (${status})`, data)
  }
} 