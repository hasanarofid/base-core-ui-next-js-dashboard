'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AuthGuard from '@/components/auth/AuthGuard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { PaymentMethod } from '@/types/paymentMethod';
import Image from 'next/image';
import { getPaymentMethod, deletePaymentMethodWithCookies, updatePaymentMethodStatusWithCookies } from '@/lib/api';
import { useToastContext } from '@/contexts/ToastContext';
import { confirmDelete } from '@/lib/sweetalert-config';
import { useSweetAlert } from '@/lib/sweetalert-config';

export default function PaymentMethodPage() {
  const router = useRouter();
  const { showSuccess, showError } = useToastContext();
  const sweetAlert = useSweetAlert();
  const [paymentmethods, setPaymentMethod] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  // Fetch payment methods data function
  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPaymentMethod();
      setPaymentMethod(response.data);
    } catch (err) {
      console.error('Error fetching payment methods:', err);
      setError('Gagal mengambil data metode pembayaran. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const filteredPaymentMethod = paymentmethods.filter(paymentmethod =>
    (paymentmethod.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (paymentmethod.code?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (paymentmethod.type?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    paymentmethod.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedPaymentMethods = filteredPaymentMethod.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredPaymentMethod.length / itemsPerPage);

  const handleDelete = async (paymentmethod: PaymentMethod) => {
    const result = await confirmDelete(paymentmethod.name);
  
    if (result.isConfirmed) {
      try {
        await deletePaymentMethodWithCookies(paymentmethod.id);
        setPaymentMethod((prev) => prev.filter(p => p.id !== paymentmethod.id));
        showSuccess('Berhasil!', 'Metode pembayaran dihapus.');
      } catch (error) {
        console.error('Delete error:', error);
        showError('Error!', 'Gagal menghapus metode pembayaran.');
      }
    }
  };

  const handleEdit = (paymentmethod: PaymentMethod) => {
    router.push(`/payment-methods/${paymentmethod.id}/edit`);
  };

  const handleView = (paymentmethod: PaymentMethod) => {
    router.push(`/payment-methods/${paymentmethod.id}`);
  };

  const handleStatusChange = async (paymentmethod: PaymentMethod) => {
    // Validasi: status yang diizinkan
    const allowedStatuses = ['active', 'inactive'];
    if (!allowedStatuses.includes(paymentmethod.status)) {
      sweetAlert.warning("Status tidak valid!", "Status payment method tidak valid untuk diubah.");
      return;
    }

    const result = await sweetAlert.confirm(paymentmethod.name, `Pilih status baru untuk ${paymentmethod.name}:`, {
      icon: 'question',
      confirmButtonColor: '#696cff',
      confirmButtonText: 'Ubah Status',
      cancelButtonText: 'Batal',
      input: 'select',
      inputOptions: {
        'active': 'Aktif',
        'inactive': 'Tidak Aktif'
      },
      inputValue: paymentmethod.status
    });

    if (result.value) {
      try {
        // Tampilkan loading
        sweetAlert.loading('Memproses...', 'Sedang mengubah status payment method');

        await updatePaymentMethodStatusWithCookies(paymentmethod.id, result.value);

        // Reload data setelah status change berhasil
        await fetchPaymentMethods();
        
        // Tampilkan splash success
        sweetAlert.success("Berhasil!", `Status payment method "${paymentmethod.name}" berhasil diubah menjadi ${getStatusText(result.value)}.`);
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

  const getStatusBadgeVariant = (status: PaymentMethod['status']) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'danger';
      default: return 'warning';
    }
  };

  const getStatusText = (status: PaymentMethod['status']) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'inactive': return 'Tidak Aktif';
      default: return status;
    }
  };

  const columns: Column<PaymentMethod>[] = [
    {
      key: 'name',
      header: 'LOGO',
      render: (_, row) => (
        <div className="d-flex align-items-center gap-3">
          {row.logo_url && (
            <Image 
              src={row.logo_url} 
              alt={row.name} 
              width={32} 
              height={32} 
              className="rounded"
              unoptimized={true}
            />
          )}
          <span className="fw-semibold">{row.name || '-'}</span>
        </div>
      )
    },
    {
      key: 'code',
      header: 'KODE',
      render: (value) => {
        const val = value as string | undefined;
        return <span>{val || '-'}</span>;
      }
    },
    {
      key: 'type',
      header: 'TIPE',
      render: (value) => {
        const val = value as string | undefined;
        return <span>{val || '-'}</span>;
      }
    },
    {
      key: 'status',
      header: 'STATUS',
      render: (value) => {
        const status = value as PaymentMethod['status'];
        return (
          <span className={`badge bg-label-${getStatusBadgeVariant(status)}`}>
            {getStatusText(status)}
          </span>
        );
      }
    },
    {
      key: 'createdAt',
      header: 'DIBUAT',
      render: (value) => {
        const date = value as string;
        return <span>{new Date(date).toLocaleDateString('id-ID')}</span>;
      }
    }    
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
        <div className="container-xxl flex-grow-1 container-p-y">
          {/* Page Header - Matching Dashboard Style */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="fw-bold py-3 mb-4">
                <span className="text-muted fw-light">Payment Config /</span> Konfigurasi Pembayaran
              </h4>
              <p className="text-muted mb-0">Kelola {paymentmethods.length} payment method dalam sistem</p>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-label-primary">
                <i className="ti ti-download me-1"></i>
                <span>Ekspor Data</span>
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => router.push('/payment-methods/create')}
              >
                <i className="ti ti-plus me-1"></i>
                <span>Tambah Payment Method</span>
              </button>
            </div>
          </div>

          {/* DataTable Card */}
          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title mb-1 text-primary">Daftar Payment Methods</h5>
                  <p className="text-muted mb-0">
                    {loading ? 'Memuat data...' : `${paymentmethods.length} payment method ditemukan`}
                  </p>
                </div>
                <div className="d-flex align-items-center gap-6">
                  <div className="flex-1" style={{ minWidth: '300px' }}>
                    <input
                      type="text"
                      placeholder="Cari berdasarkan nama, kode, tipe, atau status..."
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
                onView={handleView}
                onStatusChange={handleStatusChange}
                showStatusButton={() => true}
                pagination={{
                  currentPage,
                  totalPages,
                  totalItems: filteredPaymentMethod.length,
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
