import axios from 'axios'
import { config } from '@/config'
import { debugApiRequest, debugApiResponse, debugError } from '@/utils/debug'
import { TenantListResponse, Tenant, CreateTenantData } from '@/types/tenant'
import { UserListResponse, User, CreateUserData, VerifyEmailData } from '@/types/user'
import { PaymentMethod, PaymentMethodListResponse, CreatePaymentMethodData } from '@/types/paymentMethod'
import { 
  TenantPaymentMethodListResponse, 
  TenantPaymentMethodResponse,
  CreateTenantPaymentMethodData 
} from '@/types/tenantPaymentMethod'
import { Transaction, TransactionListResponse, TransactionFilters } from '@/types/transaction'
import { 
  NotificationListResponse, 
  NotificationReadResponse, 
  NotificationReadAllResponse
} from '@/types/notification'

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

// Interface untuk response API user
interface UserData {
  id: string;
  fullName: string;
  email: string;
  role: string;
  forcePasswordChange: boolean;
  tenantId: string;
  tenant?: {
    id: string;
    name: string;
    status: string;
    domain: string;
  };
}

interface UserResponse {
  message: string;
  user: UserData;
}

// Fungsi untuk mengambil data user dari endpoint /user
export async function getUser(): Promise<UserResponse> {
  try {
    const response = await fetch('/api/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Penting: untuk mengirim cookies
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

// Fungsi untuk update data user
export async function updateUser(userData: { id: string; fullName?: string; email?: string }): Promise<UserResponse> {
  try {
    const response = await fetch('/api/user', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Gagal memperbarui data user')
    }

    return await response.json()
  } catch (error) {
    console.error('Error updating user:', error)
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

// Fungsi utility untuk API calls dengan cookies
export async function apiWithCookies(endpoint: string, options: RequestInit = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }

  const defaultOptions: RequestInit = {
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
    credentials: 'include', // Penting: untuk mengirim cookies
    ...options,
  }

  console.log(`Making API call to: /api${endpoint}`)
  console.log('Request options:', defaultOptions)

  const response = await fetch(`/api${endpoint}`, defaultOptions)
  
  console.log('Response status:', response.status)
  console.log('Response headers:', Object.fromEntries(response.headers.entries()))
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Terjadi kesalahan' }))
    console.error('API Error:', errorData)
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  console.log('API Response data:', data)
  return data
}

// ===== TENANT MANAGEMENT API FUNCTIONS =====

// Fungsi untuk mengambil data tenant dengan cookies
export async function getTenantsWithCookies(): Promise<TenantListResponse> {
  return apiWithCookies('/tenants')
}

// Fungsi untuk membuat tenant baru dengan cookies
export async function createTenantWithCookies(tenantData: CreateTenantData): Promise<{ message: string; data: Tenant }> {
  return apiWithCookies('/tenants', {
    method: 'POST',
    body: JSON.stringify(tenantData),
  })
}

// Fungsi untuk update tenant dengan cookies
export async function updateTenantWithCookies(id: string, tenantData: Partial<CreateTenantData>): Promise<{ message: string; data: Tenant }> {
  return apiWithCookies(`/tenants/${id}`, {
    method: 'PUT',
    body: JSON.stringify(tenantData),
  })
}

// Fungsi untuk delete tenant dengan cookies
export async function deleteTenantWithCookies(id: string): Promise<{ message: string }> {
  return apiWithCookies(`/tenants/${id}`, {
    method: 'DELETE',
  })
} 

// Fungsi untuk approve tenant dengan cookies
export async function approveTenantWithCookies(id: string): Promise<{ message: string; data: Tenant }> {
  return apiWithCookies(`/tenants/${id}/approve`, {
    method: 'PATCH',
  })
}

// Fungsi untuk update status tenant dengan cookies
export async function updateTenantStatusWithCookies(id: string, status: string): Promise<{ message: string; data: Tenant }> {
  return apiWithCookies(`/tenants/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

// ===== USER MANAGEMENT API FUNCTIONS =====

// Fungsi untuk mengambil data users dengan cookies
export async function getUsersWithCookies(): Promise<UserListResponse> {
  return apiWithCookies('/user-list')
}

// Fungsi untuk membuat user baru dengan cookies
export async function createUserWithCookies(userData: CreateUserData): Promise<{ message: string; data: User }> {
  return apiWithCookies('/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  })
}

// Fungsi untuk update user dengan cookies
export async function updateUserWithCookies(id: string, userData: Partial<CreateUserData>): Promise<{ message: string; data: User }> {
  return apiWithCookies('/user', {
    method: 'PATCH',
    body: JSON.stringify({ id, ...userData }),
  })
}

// Fungsi untuk verifikasi email dengan cookies
export async function verifyEmailWithCookies(emailData: VerifyEmailData): Promise<{ message: string }> {
  return apiWithCookies('/verify-email', {
    method: 'POST',
    body: JSON.stringify(emailData),
  })
}

// Fungsi untuk verifikasi user dengan cookies
export async function verifyUserWithCookies(id: string): Promise<{ message: string; data: User }> {
  return apiWithCookies(`/verify-user/${id}`, {
    method: 'POST',
  })
}

// Fungsi untuk reset password user dengan cookies
export async function resetPasswordWithCookies(id: string, newPassword?: string): Promise<{ message: string }> {
  return apiWithCookies(`/reset-password/${id}`, {
    method: 'POST',
    body: JSON.stringify({ new_password: newPassword }),
  })
}

// Fungsi untuk menghapus user dengan cookies
export async function deleteUserWithCookies(id: string): Promise<{ message: string }> {
  return apiWithCookies(`/admin/users/${id}`, {
    method: 'DELETE',
  })
}

// Fungsi untuk mendapatkan detail user dengan cookies
export async function getUserDetailWithCookies(id: string): Promise<{ message: string; data: User }> {
  return apiWithCookies(`/admin/users/${id}`);
}

// ===== PAYMENT METHOD API FUNCTIONS =====

// Fungsi untuk mengambil data payment method (tanpa cookies)
export async function getPaymentMethod(): Promise<PaymentMethodListResponse> {
  try {
    const response = await fetch('/api/payment-method', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Gagal mengambil data payment method');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching payment method:', error);
    throw error;
  }
}

// Fungsi untuk mengambil data payment method dengan cookies
export async function getPaymentMethodWithCookies(): Promise<PaymentMethodListResponse> {
  return apiWithCookies('/payment-method');
}

// Fungsi untuk membuat payment method baru dengan cookies
export async function createPaymentMethodWithCookies(paymentMethodData: CreatePaymentMethodData): Promise<{ message: string; data: PaymentMethod }> {
  return apiWithCookies('/payment-method', {
    method: 'POST',
    body: JSON.stringify(paymentMethodData),
  });
}

// Fungsi untuk update payment method dengan cookies
export async function updatePaymentMethodWithCookies(id: string, paymentMethodData: Partial<CreatePaymentMethodData>): Promise<{ message: string; data: PaymentMethod }> {
  return apiWithCookies(`/payment-method/${id}`, {
    method: 'PUT',
    body: JSON.stringify(paymentMethodData),
  });
}

// Fungsi untuk approve payment method dengan cookies
export async function approvePaymentMethodWithCookies(id: string): Promise<{ message: string; data: PaymentMethod }> {
  return apiWithCookies(`/payment-method/${id}/approve`, {
    method: 'POST',
  })
}

// Fungsi untuk update status payment method dengan cookies
export async function updatePaymentMethodStatusWithCookies(id: string, status: string): Promise<{ message: string; data: PaymentMethod }> {
  return apiWithCookies(`/payment-method/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
} 

export async function getPaymentMethodByIdWithCookies(id: string): Promise<{ message: string; data: PaymentMethod }> {
  return apiWithCookies(`/payment-method/${id}`);
}

export async function deletePaymentMethodWithCookies(id: string): Promise<{ message: string }> {
  return apiWithCookies(`/payment-method/${id}`, {
    method: 'DELETE',
  });
}

// ===== TENANT PAYMENT METHOD API FUNCTIONS =====

// Fungsi untuk mengambil data tenant payment method dengan cookies
export async function getTenantPaymentMethodsWithCookies(tenantId: string): Promise<TenantPaymentMethodListResponse> {
  return apiWithCookies(`/tenants/${tenantId}/payment-methods`);
}

// Fungsi untuk membuat tenant payment method baru dengan cookies
export async function createTenantPaymentMethodWithCookies(tenantId: string, paymentMethodData: CreateTenantPaymentMethodData): Promise<TenantPaymentMethodResponse> {
  return apiWithCookies(`/tenants/${tenantId}/payment-methods`, {
    method: 'POST',
    body: JSON.stringify(paymentMethodData),
  });
}

// Fungsi untuk update tenant payment method dengan cookies
export async function updateTenantPaymentMethodWithCookies(id: string, paymentMethodData: Partial<CreateTenantPaymentMethodData>): Promise<TenantPaymentMethodResponse> {
  return apiWithCookies(`/tenant-payment-methods/${id}`, {
    method: 'PUT',
    body: JSON.stringify(paymentMethodData),
  });
}

// Fungsi untuk menghapus tenant payment method dengan cookies
export async function deleteTenantPaymentMethodWithCookies(id: string): Promise<{ message: string }> {
  return apiWithCookies(`/tenant-payment-methods/${id}`, {
    method: 'DELETE',
  });
}

// Fungsi untuk mengambil data tenant payment method individual dengan cookies
export async function getTenantPaymentMethodByIdWithCookies(id: string): Promise<TenantPaymentMethodResponse> {
  return apiWithCookies(`/tenant-payment-methods/${id}`);
}

// ===== TRANSACTION API FUNCTIONS =====

// Fungsi untuk mengambil data transactions dengan cookies
export async function getTransactionsWithCookies(filters?: TransactionFilters): Promise<TransactionListResponse> {
  const queryParams = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });
  }
  
  const url = queryParams.toString() ? `/transactions?${queryParams.toString()}` : '/transactions';
  console.log('🔍 Calling transactions API with URL:', url);
  return apiWithCookies(url);
}

// Fungsi untuk mengambil data transaction individual dengan cookies
export async function getTransactionByIdWithCookies(id: string): Promise<{ status: string; data: Transaction }> {
  console.log('🔍 Calling transaction detail API with ID:', id);
  return apiWithCookies(`/transactions/${id}`);
}

// ===== NOTIFICATION API FUNCTIONS =====

// Fungsi untuk mengambil data notifikasi dengan cookies
export async function getNotificationsWithCookies(page: number = 1, limit: number = 20): Promise<NotificationListResponse> {
  console.log('🔔 Calling notifications API with page:', page, 'limit:', limit);
  return apiWithCookies(`/notifications?page=${page}&limit=${limit}`);
}

// Fungsi untuk menandai notifikasi sebagai sudah dibaca dengan cookies
export async function markNotificationAsReadWithCookies(id: string): Promise<NotificationReadResponse> {
  console.log('✅ Marking notification as read with ID:', id);
  return apiWithCookies(`/notifications/${id}/read`, {
    method: 'PATCH',
  });
}

// Fungsi untuk menandai semua notifikasi sebagai sudah dibaca dengan cookies
export async function markAllNotificationsAsReadWithCookies(): Promise<NotificationReadAllResponse> {
  console.log('✅ Marking all notifications as read');
  return apiWithCookies('/notifications/read-all', {
    method: 'PATCH',
  });
}

// Admin notifications now use the same endpoint as regular notifications
// The backend will handle role-based filtering based on the user's session


