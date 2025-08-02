export interface PaymentMethod {
    id: string;
    name: string;
    code?: string;
    logo_url?: string;
    type?: string;
    status: 'suspended' | 'pending' | 'active';
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreatePaymentMethodData {
    name: string;
    code?: string;
    logo_url?: string;
    type?: string;
    status?: 'pending' | 'active' | 'suspended';
  }
  
  export interface UpdatePaymentMethodData extends Partial<CreatePaymentMethodData> {
    id: string;
  }
  
  export interface PaymentMethodFilters {
    search?: string;
    status?: 'pending' | 'active' | 'suspended';
    type?: string;
  }
  
  export interface PaymentMethodListResponse {
    message: string;
    data: PaymentMethod[];
  }
  