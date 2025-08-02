'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AuthGuard from '@/components/auth/AuthGuard';
import { Building, Plus, Filter, Download } from 'lucide-react';
import { DataTable, Column } from '@/components/ui/DataTable';
import { PaymentMethod } from '@/types/paymentMethod';
import Badge from '@/components/ui/Badge';
import { getPaymentMethod, approvePaymentMethodWithCookies, updatePaymentMethodStatusWithCookies, deletePaymentMethodWithCookies  } from '@/lib/api';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function PaymentMethodPage() {
  const router = useRouter();
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
    // if (paymentmethod.status === 'active') {
    //   Swal.fire({
    //     title: 'Tidak dapat menghapus!',
    //     text: 'Metode pembayaran dengan status aktif tidak dapat dihapus.',
    //     icon: 'warning',
    //     confirmButtonColor: '#3085d6',
    //   });
    //   return;
    // }
  
    const result = await Swal.fire({
      title: `Hapus metode "${paymentmethod.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    });
  
    if (result.isConfirmed) {
      try {
        await deletePaymentMethodWithCookies(paymentmethod.id); // gunakan fungsi API
        setPaymentMethod((prev) => prev.filter(p => p.id !== paymentmethod.id));
        Swal.fire('Berhasil!', 'Metode pembayaran dihapus.', 'success');
      } catch (error) {
        console.error('Delete error:', error);
        Swal.fire('Error!', 'Gagal menghapus metode pembayaran.', 'error');
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
      case 'pending': return 'warning';
      case 'suspended': return 'danger';
      default: return 'default';
    }
  };

  const getStatusText = (status: PaymentMethod['status']) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'pending': return 'Menunggu';
      case 'suspended': return 'Ditangguhkan';
      default: return status;
    }
  };

  const columns: Column<PaymentMethod>[] = [
    {
      key: 'name',
      header: 'LOGO',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          {row.logo_url && <img src={row.logo_url} alt={row.name} className="w-3 h-3" />}
          <span className="font-semibold">{row.name || '-'}</span>
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
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="fw-bold mb-1 flex items-center gap-2">
                    <Building className="w-6 h-6 text-brand-blue-3" />
                    Payment Method Master
                  </h4>
                  <p className="text-muted mb-0">Kelola dan monitor semua metode pembayaran dalam sistem Anda</p>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-outline-primary d-flex align-items-center gap-2">
                    <Download className="w-4 h-4" />
                    Ekspor Data
                  </button>
                  <button
                    className="btn btn-primary d-flex align-items-center gap-2"
                    onClick={() => router.push('/payment-methods/create')}
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Metode Pembayaran
                  </button>
                </div>
              </div>
            </div>
          </div>

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
                    <button className="btn btn-outline-primary d-flex align-items-center gap-2">
                      <Filter className="w-4 h-4" />
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
