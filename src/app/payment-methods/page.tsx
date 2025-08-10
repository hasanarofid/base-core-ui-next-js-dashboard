'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AuthGuard from '@/components/auth/AuthGuard';
import { DataTable, Column } from '@/components/ui/DataTable';
import { PaymentMethod } from '@/types/paymentMethod';
import Image from 'next/image';
import { getPaymentMethod, deletePaymentMethodWithCookies } from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';
import { confirmDelete } from '@/lib/sweetalert-config';

export default function PaymentMethodPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [paymentmethods, setPaymentMethod] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  useEffect(() => {
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
        showToast({
          type: 'success',
          title: 'Berhasil!',
          message: 'Metode pembayaran dihapus.',
          duration: 3000
        });
      } catch (error) {
        console.error('Delete error:', error);
        showToast({
          type: 'error',
          title: 'Error!',
          message: 'Gagal menghapus metode pembayaran.',
          duration: 5000
        });
      }
    }
  };

  const handleEdit = (paymentmethod: PaymentMethod) => {
    router.push(`/payment-methods/${paymentmethod.id}/edit`);
  };

  const handleView = (paymentmethod: PaymentMethod) => {
    router.push(`/payment-methods/${paymentmethod.id}`);
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
          {/* Page Header */}
          <div className="row">
            <div className="col-12">
              <div className="page-header d-print-none">
                <div className="container-xl">
                  <div className="row g-2 align-items-center">
                    <div className="col">
                      <div className="page-pretitle">
                        Payment Methods
                      </div>
                      <h2 className="page-title">
                        Payment Method Master
                      </h2>
                    </div>
                    <div className="col-auto ms-auto d-print-none">
                      <button className="btn btn-outline-primary me-2">
                        <i className="ti ti-download me-1"></i>
                        Ekspor Data
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => router.push('/payment-methods/create')}
                      >
                        <i className="ti ti-plus me-1"></i>
                        Tambah Metode Pembayaran
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="card-title mb-1">Daftar Metode Pembayaran</h5>
                    <p className="text-muted mb-0">
                      {loading ? 'Memuat data...' : `${paymentmethods.length} metode ditemukan`}
                    </p>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Cari metode pembayaran..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn btn-outline-primary">
                      <i className="ti ti-filter me-1"></i>
                      Filter
                    </button>
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
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
