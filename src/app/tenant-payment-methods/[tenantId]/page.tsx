'use client'

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout'
import AuthGuard from '@/components/auth/AuthGuard'
import { DataTable, Column } from '@/components/ui/DataTable';
import { TenantPaymentMethod } from '@/types/tenantPaymentMethod';
import Badge from '@/components/ui/Badge';
import { getTenantPaymentMethodsWithCookies, deleteTenantPaymentMethodWithCookies, getPaymentMethodByIdWithCookies } from '@/lib/api';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useSweetAlert } from '@/lib/sweetalert-config';
import { useToast } from '@/contexts/ToastContext';

// Custom CSS untuk styling
const customStyles = `
  .payment-method-card {
    transition: all 0.3s ease;
    border: 1px solid #e7e7ff;
  }
  
  .payment-method-card:hover {
    box-shadow: 0 0.25rem 1rem rgba(161, 161, 170, 0.15);
    transform: translateY(-2px);
  }
  
  .fee-value-display {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 600;
  }
  
  .payment-method-icon {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
  }
  
  .status-badge-custom {
    padding: 0.375rem 0.75rem;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  .table-hover tbody tr:hover {
    background-color: rgba(102, 126, 234, 0.05);
  }
`;

/**
 * Tenant Payment Methods Page
 * 
 * Fitur yang tersedia:
 * 1. List Payment Methods Tenant - Menampilkan semua payment method yang dimiliki tenant
 * 2. Create Payment Method Tenant - Menambah payment method baru untuk tenant
 * 3. Update Payment Method Tenant - Mengubah konfigurasi payment method tenant
 * 4. Delete Payment Method Tenant - Menghapus payment method tenant
 * 5. Fee Management - Mengelola fee type (flat/percent) dan fee value
 * 
 * API Methods:
 * - GET /api/tenants/[id]/payment-methods - Get tenant payment methods
 * - POST /api/tenants/[id]/payment-methods - Create tenant payment method
 * - PUT /api/tenant-payment-methods/[id] - Update tenant payment method
 * - DELETE /api/tenant-payment-methods/[id] - Delete tenant payment method
 */

export default function TenantPaymentMethodsPage() {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState<TenantPaymentMethod[]>([]);
  const [paymentMethodNames, setPaymentMethodNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  const tenantId = params.tenantId as string;

  // Hook untuk SweetAlert dengan tema dinamis
  const sweetAlert = useSweetAlert();

  // Dynamic title management using custom hook
  const { fullTitle, pageTitle, pageSubtitle } = usePageTitle({
    title: 'Payment Methods Tenant',
    subtitle: `Kelola ${paymentMethods.length} payment method tenant`,
    description: `Kelola payment method tenant. Fitur lengkap untuk mengelola payment method, fee, dan konfigurasi tenant.`,
    keywords: 'tenant payment method, fee management, payment configuration'
  });

  // Fetch payment method name by ID
  const fetchPaymentMethodName = async (paymentMethodId: string): Promise<string> => {
    try {
      const response = await getPaymentMethodByIdWithCookies(paymentMethodId);
      return response.data.name || 'Payment Method';
    } catch (error) {
      console.error(`❌ Error fetching payment method name for ID ${paymentMethodId}:`, error);
      return 'Payment Method';
    }
  };

  // Fetch payment methods data function
  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getTenantPaymentMethodsWithCookies(tenantId);
      console.log('🔍 Full API Response:', JSON.stringify(response, null, 2));
      
      // Handle multiple possible response formats
      let paymentMethodsData: TenantPaymentMethod[] = [];
      
      if (response) {
        // Format 1: { message: "success", data: [...] } - Standard response
        if (response.data && Array.isArray(response.data)) {
          paymentMethodsData = response.data;
          console.log('✅ Found payment methods in response.data:', paymentMethodsData.length);
        }
        // Format 2: Direct array [...] - Fallback
        else if (Array.isArray(response)) {
          paymentMethodsData = response as unknown as TenantPaymentMethod[];
          console.log('✅ Found payment methods as direct array:', paymentMethodsData.length);
        }
        else {
          console.warn('❌ Could not find payment methods array in expected format');
          console.warn('Response structure:', Object.keys(response));
        }
      }
      
      console.log('🔍 Setting payment methods count:', paymentMethodsData.length);
      setPaymentMethods(paymentMethodsData);
      
      // Fetch payment method names for each payment method
      const namesMap: Record<string, string> = {};
      for (const paymentMethod of paymentMethodsData) {
        if (paymentMethod.payment_method_id) {
          const name = await fetchPaymentMethodName(paymentMethod.payment_method_id);
          namesMap[paymentMethod.payment_method_id] = name;
        }
      }
      setPaymentMethodNames(namesMap);
      
    } catch (err) {
      console.error('❌ Error fetching payment methods:', err);
      setError('Gagal mengambil data payment methods tenant. Silakan coba lagi.');
      setPaymentMethods([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch payment methods data
  useEffect(() => {
    if (tenantId) {
      fetchPaymentMethods();
    }
  }, [tenantId]);

  // Watch payment methods state changes
  useEffect(() => {
    console.log('🔍 Payment methods state updated:', paymentMethods.length, 'items');
  }, [paymentMethods]);

  // Watch payment method names state changes
  useEffect(() => {
    console.log('🔍 Payment method names updated:', Object.keys(paymentMethodNames).length, 'names');
  }, [paymentMethodNames]);

  const filteredPaymentMethods = paymentMethods.filter(paymentMethod => {
    const paymentMethodName = paymentMethodNames[paymentMethod.payment_method_id] || paymentMethod.payment_method_name || '';
    return (
      (paymentMethodName && paymentMethodName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (paymentMethod.tenant_name && paymentMethod.tenant_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      paymentMethod.fee_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paymentMethod.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const paginatedPaymentMethods = filteredPaymentMethods.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredPaymentMethods.length / itemsPerPage);

  const handleCreate = () => {
    router.push(`/tenant-payment-methods/${tenantId}/create`);
  };

  const handleEdit = (paymentMethod: TenantPaymentMethod) => {
    router.push(`/tenant-payment-methods/${tenantId}/edit/${paymentMethod.id}`);
  };

  const handleDelete = async (paymentMethod: TenantPaymentMethod) => {
    const paymentMethodName = paymentMethodNames[paymentMethod.payment_method_id] || paymentMethod.payment_method_name || 'Payment Method';
    const result = await sweetAlert.confirmDelete(paymentMethodName);

    if (result.isConfirmed) {
      try {
        // Tampilkan loading
        sweetAlert.loading('Memproses...', 'Sedang menghapus payment method');

        await deleteTenantPaymentMethodWithCookies(paymentMethod.id);

        // Reload data setelah delete berhasil
        await fetchPaymentMethods();
        
        // Tampilkan splash success
        sweetAlert.success("Berhasil!", `Payment method "${paymentMethodName}" berhasil dihapus.`);
      } catch (error) {
        // Tampilkan splash error
        if (error instanceof Error) {
          sweetAlert.error("Error!", error.message);
        } else {
          sweetAlert.error("Error!", "Terjadi kesalahan yang tidak diketahui");
        }
      }
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'inactive':
        return 'Tidak Aktif';
      default:
        return 'Tidak Diketahui';
    }
  };

  const getFeeTypeText = (feeType: string) => {
    switch (feeType) {
      case 'flat':
        return 'Flat';
      case 'percent':
        return 'Persentase';
      default:
        return feeType;
    }
  };

  const columns: Column<TenantPaymentMethod>[] = [
    {
      key: 'payment_method_name',
      header: 'PAYMENT METHOD',
      render: (_, row) => {
        const paymentMethodName = paymentMethodNames[row.payment_method_id] || row.payment_method_name || 'Payment Method';
        return (
          <div className="d-flex align-items-center gap-3">
            {row.payment_method_logo_url ? (
              <img 
                src={row.payment_method_logo_url} 
                alt={paymentMethodName} 
                width={32} 
                height={32} 
                className="rounded"
              />
            ) : (
              <div className="payment-method-icon">
                <i className="ti ti-credit-card"></i>
              </div>
            )}
            <div>
              <div className="fw-semibold text-body">{paymentMethodName}</div>
              <div className="text-muted small">Payment Method</div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'fee_type',
      header: 'FEE TYPE',
      render: (value) => {
        const feeType = value as string;
        return (
          <div>
            <span className={`badge bg-label-${feeType === 'flat' ? 'info' : 'warning'} status-badge-custom`}>
              {getFeeTypeText(feeType)}
            </span>
          </div>
        );
      }
    },
    {
      key: 'fee_value',
      header: 'FEE VALUE',
      render: (value, row) => {
        const feeValue = value as number;
        const feeType = row.fee_type as string;
        return (
          <div>
            <span className="fee-value-display">
              {feeType === 'percent' ? `${feeValue}%` : `Rp ${feeValue.toLocaleString('id-ID')}`}
            </span>
            <div className="text-muted small">
              {feeType === 'percent' ? 'Persentase' : 'Nominal Tetap'}
            </div>
          </div>
        );
      }
    },
    {
      key: 'status',
      header: 'STATUS',
      render: (value) => {
        const status = value as string;
        return (
          <Badge variant={getStatusBadgeVariant(status)}>
            {getStatusText(status)}
          </Badge>
        );
      }
    },
    {
      key: 'createdAt',
      header: 'DIBUAT',
      render: (value) => {
        const date = value as string;
        return (
          <div>
            <span className="text-body fw-medium">
              {new Date(date).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </span>
            <div className="text-muted small">
              {new Date(date).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        );
      }
    },

  ];

  if (error) {
    return (
      <AuthGuard requireAuth={true}>
        <DashboardLayout>
          <div className="container-xxl flex-grow-1 container-p-y">
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Error!</h4>
              <p>{error}</p>
              <button className="btn btn-outline-danger" onClick={() => window.location.reload()}>
                Coba Lagi
              </button>
            </div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requireAuth={true}>
      <DashboardLayout>
        <style jsx>{customStyles}</style>
        <div className="container-xxl flex-grow-1 container-p-y">
          {/* Page Header - Matching Dashboard Style */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-bold mb-1 text-primary">
                <i className="ti ti-credit-card me-2"></i>
                {pageTitle}
              </h4>
              <p className="text-muted mb-0">{pageSubtitle}</p>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-label-primary">
                <i className="ti ti-download me-1"></i>
                <span>Ekspor Data</span>
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleCreate}
              >
                <i className="ti ti-plus me-1"></i>
                <span>Tambah Payment Method</span>
              </button>
            </div>
          </div>

          {/* DataTable Card */}
          <div className="card payment-method-card">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title mb-1 text-primary">Daftar Payment Methods Tenant</h5>
                  <p className="text-muted mb-0">
                    {loading ? 'Memuat data...' : `${paymentMethods.length} payment method ditemukan`}
                  </p>
                </div>
                <div className="d-flex align-items-center gap-6">
                  <div className="flex-1" style={{ minWidth: '300px' }}>
                    <input
                      type="text"
                      placeholder="Cari berdasarkan payment method, fee type, atau status..."
                      className="form-control"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex-shrink-0">
                    <button className="btn btn-label-primary">
                      <i className="ti ti-filter me-1"></i>
                      <span>Filter Lanjutan</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <DataTable
                data={paginatedPaymentMethods}
                columns={columns}
                loading={loading}
                searchable={false}
                filterable={false}
                onEdit={handleEdit}
                onDelete={handleDelete}
                pagination={{
                  currentPage,
                  totalPages,
                  totalItems: filteredPaymentMethods.length,
                  itemsPerPage,
                  onPageChange: setCurrentPage
                }}
                className="border-0 shadow-none"
              />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
} 