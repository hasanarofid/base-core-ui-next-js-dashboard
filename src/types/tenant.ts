export interface Tenant {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  status: 'pending' | 'active' | 'suspended' | 'inactive';
  plan: 'basic' | 'premium' | 'enterprise';
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  subscriptionEnd?: string;
}

export interface CreateTenantData {
  name: string;
  email: string;
  company: string;
  phone: string;
  status: 'pending' | 'active' | 'suspended' | 'inactive';
  plan: 'basic' | 'premium' | 'enterprise';
}

export interface UpdateTenantData extends Partial<CreateTenantData> {
  id: string;
}

export interface TenantFilters {
  search?: string;
  status?: 'pending' | 'active' | 'suspended' | 'inactive';
  plan?: 'basic' | 'premium' | 'enterprise';
}

export interface TenantListResponse {
  data: Tenant[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 