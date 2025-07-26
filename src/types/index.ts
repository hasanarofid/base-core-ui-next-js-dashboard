// User types
export interface User {
  id: number
  name: string
  email: string
  avatar?: string
  role: string
  created_at: string
  updated_at: string
}

// Auth types
export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
  refresh_token: string
}

// Dashboard types
export interface DashboardStats {
  total_users: number
  total_revenue: number
  total_orders: number
  growth_percentage: number
}

export interface RecentActivity {
  id: number
  type: string
  description: string
  user: User
  created_at: string
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string[]
    borderColor?: string[]
  }[]
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

// Navigation types
export interface MenuItem {
  id: string
  title: string
  href: string
  icon?: string
  badge?: string
  children?: MenuItem[]
}

// Form types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox'
  required?: boolean
  options?: { value: string; label: string }[]
  placeholder?: string
} 