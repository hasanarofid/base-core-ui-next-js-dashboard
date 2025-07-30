import axios from 'axios'
import { config } from '@/config'
import { debugApiRequest, debugApiResponse, debugError } from '@/utils/debug'
import { UserResponse, TenantListResponse } from '@/types/tenant'

// Membuat instance axios dengan konfigurasi default
export const api = axios.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // Disable credentials untuk cross-origin
})

// Interceptor untuk menambahkan token ke header
api.interceptors.request.use(
  (axiosConfig) => {
    const token = localStorage.getItem(config.auth.tokenKey)
    if (token) {
      axiosConfig.headers.Authorization = `Bearer ${token}`
    }
    
    debugApiRequest(
      axiosConfig.method?.toUpperCase() || 'UNKNOWN',
      axiosConfig.url || 'unknown',
      axiosConfig.data
    )
    
    return axiosConfig
  },
  (error) => {
    debugError('Request interceptor error', error)
    return Promise.reject(error)
  }
)

// Interceptor untuk handle response
api.interceptors.response.use(
  (response) => {
    debugApiResponse(
      response.config.method?.toUpperCase() || 'UNKNOWN',
      response.config.url || 'unknown',
      response.status,
      response.data
    )
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem(config.auth.refreshTokenKey)
        if (refreshToken) {
          const response = await api.post('/auth/refresh', { refreshToken })
          const { token } = response.data
          
          localStorage.setItem(config.auth.tokenKey, token)
          originalRequest.headers.Authorization = `Bearer ${token}`
          
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh token failed, redirect to login
        debugError('Token refresh failed', refreshError)
        localStorage.removeItem(config.auth.tokenKey)
        localStorage.removeItem(config.auth.refreshTokenKey)
        localStorage.removeItem(config.auth.userKey)
        window.location.href = '/login'
      }
    }
    
    debugError('Response interceptor error', error)
    return Promise.reject(error)
  }
)

// API endpoints
export const authAPI = {
  login: (credentials: { email: string; password: string }) => {
    console.log('Base URL:', config.api.baseURL)
    console.log('Login request to:', `${config.api.baseURL}/auth/login`)
    console.log('Credentials:', credentials)
    return api.post('/auth/login', credentials)
  },
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  refresh: () => api.post('/auth/refresh'),
}

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data: Record<string, unknown>) => api.put('/user/profile', data),
  changePassword: (data: Record<string, unknown>) => api.put('/user/password', data),
}

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentActivity: () => api.get('/dashboard/recent-activity'),
  getCharts: () => api.get('/dashboard/charts'),
} 

// Fungsi untuk mengambil data user
export async function getUser(): Promise<UserResponse> {
  try {
    const response = await fetch('/api/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Gagal mengambil data user')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching user:', error)
    throw error
  }
}

// Fungsi untuk mengambil data tenants
export async function getTenants(): Promise<TenantListResponse> {
  try {
    const response = await fetch('/api/tenants', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Gagal mengambil data tenants')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching tenants:', error)
    throw error
  }
} 