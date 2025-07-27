export class ApiError extends Error {
  public status: number
  public data?: unknown

  constructor(message: string, status: number = 500, data?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }

  static fromResponse(response: Response, data?: unknown): ApiError {
    const message = data && typeof data === 'object' && 'message' in data 
      ? String(data.message) 
      : `HTTP ${response.status}: ${response.statusText}`
    return new ApiError(message, response.status, data)
  }

  static fromNetworkError(error: Error): ApiError {
    return new ApiError('Network error: ' + error.message, 0)
  }
}

export function handleApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  if (error instanceof Error) {
    return new ApiError(error.message)
  }

  return new ApiError('Unknown error occurred')
} 