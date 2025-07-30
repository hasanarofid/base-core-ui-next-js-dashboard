export interface Tenant {
  id: string;
  name: string;
  logo_url?: string;
  domain?: string;
  email: string;
  contact_person?: string;
  config_json?: Record<string, unknown>;
  status: 'pending' | 'active' | 'suspended' | 'inactive';
  client_id?: string;
  client_key?: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  subscriptionEnd?: string;
  // Legacy fields untuk kompatibilitas
  company?: string;
  phone?: string;
  plan?: 'basic' | 'premium' | 'enterprise';
}

export interface CreateTenantData {
  name: string;
  email: string;
  logo_url?: string;
  domain?: string;
  contact_person?: string;
  config_json?: Record<string, unknown>;
  status?: 'pending' | 'active' | 'suspended' | 'inactive';
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
  message: string;
  data: Tenant[];
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  tenantId?: string | null;
  tenant?: Tenant | null;
}

export interface UserResponse {
  message: string;
  user: User;
} 