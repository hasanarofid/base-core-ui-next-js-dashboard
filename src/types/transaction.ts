export interface Transaction {
  id: string;
  transaction_code: string;
  reference_code: string;
  status: 'pending' | 'paid' | 'failed' | 'expired';
  total_amount: string;
  amount: string;
  fee_amount: string;
  createdAt: string;
  updatedAt: string;
  tenantPaymentMethod: {
    id: string;
    fee_type: string;
    fee_value: number;
    paymentMethod: {
      id: string;
      code: string;
      name: string;
      type: string;
      logo_url: string;
    };
  };
  user: {
    id: string;
    email: string;
    full_name?: string;
  };
  tenant: {
    id: string;
    name: string;
  };
  logs?: TransactionLog[];
}

export interface TransactionLog {
  id: string;
  action: string;
  message: string;
  status: string;
  metadata?: {
    isStatic?: boolean;
    expiredAt?: string;
    qrContent?: string | null;
    contractId?: string;
    terminalId?: string | null;
    description?: string;
    customer_name?: string;
    partnerReferenceNo?: string;
    gateway_response_code?: string;
    gateway_response_message?: string;
  };
  created_at: string;
}

export interface TransactionListResponse {
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    transactions: Transaction[];
  };
}

export interface TransactionFilters {
  status?: string;
  payment_method_type?: string;
  tenant_name?: string;
  transaction_code?: string;
  reference_code?: string;
  start_date?: string;
  end_date?: string;
} 