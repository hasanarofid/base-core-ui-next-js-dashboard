export interface TenantPaymentMethod {
  id: string;
  tenant_id: string;
  payment_method_id: string;
  fee_type: 'flat' | 'percent';
  fee_value: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  // Additional fields that might be populated from joins
  tenant_name?: string;
  payment_method_name?: string;
  payment_method_logo_url?: string;
}

export interface CreateTenantPaymentMethodData {
  tenant_id: string;
  payment_method_id: string;
  fee_type: 'flat' | 'percent';
  fee_value: number;
  status?: 'active' | 'inactive';
}

export interface UpdateTenantPaymentMethodData extends Partial<CreateTenantPaymentMethodData> {
  id: string;
}

export interface TenantPaymentMethodFilters {
  tenant_id?: string;
  payment_method_id?: string;
  fee_type?: 'flat' | 'percent';
  status?: 'active' | 'inactive';
}

export interface TenantPaymentMethodListResponse {
  message: string;
  data: TenantPaymentMethod[];
}

export interface TenantPaymentMethodResponse {
  message: string;
  data: TenantPaymentMethod;
} 