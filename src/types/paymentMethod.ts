export interface PaymentMethod {
    id: string;
    name: string;
    code?: string;
    logo_url?: string;
    type?: string;
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreatePaymentMethodData {
    name: string;
    code?: string;
    logo_url?: string;
    type?: string;
    status?: 'active' | 'inactive';
  }
  
  export interface UpdatePaymentMethodData extends Partial<CreatePaymentMethodData> {
    id: string;
  }
  
  export interface PaymentMethodFilters {
    search?: string;
    status?: 'active' | 'inactive';
    type?: string;
  }
  
  export interface PaymentMethodListResponse {
    message: string;
    data: PaymentMethod[];
  }
  