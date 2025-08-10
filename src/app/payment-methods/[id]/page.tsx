'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { PaymentMethod } from '@/types/paymentMethod';
import { getPaymentMethodByIdWithCookies } from '@/lib/api';

export default function PaymentMethodDetailPage() {
  const router = useRouter();
  const params = useParams();
  const methodId = params.id as string;

  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMethod = async () => {
      try {
        console.log('Fetching method with ID:', methodId);
        const response = await getPaymentMethodByIdWithCookies(methodId); // ✅ gunakan API baru
        setMethod(response.data); // pastikan `.data` sesuai struktur return
      } catch (error) {
        console.error('Error fetching method:', error);
      } finally {
        setLoading(false);
      }
    };

    if (methodId) {
      fetchMethod();
    }
  }, [methodId]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container-xxl flex-grow-1 container-p-y">
          <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Memuat data metode...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!method) {
    return (
      <DashboardLayout>
        <div className="container-xxl flex-grow-1 container-p-y">
          <div className="card">
            <div className="card-body text-center py-5">
              <i className="ti ti-building text-muted mb-3" style={{ fontSize: '3rem' }}></i>
              <h4 className="mb-2">Metode Tidak Ditemukan</h4>
              <p className="mb-4">Data metode pembayaran tidak tersedia atau telah dihapus.</p>
              <button 
                className="btn btn-primary"
                onClick={() => router.push('/payment-methods')}
              >
                Kembali ke Daftar
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'suspended':
        return 'danger';
      default:
        return 'warning';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'suspended':
        return 'Ditangguhkan';
      default:
        return 'Menunggu';
    }
  };

  return (
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
                      Detail Metode Pembayaran
                    </h2>
                  </div>
                  <div className="col-auto ms-auto d-print-none">
                    <button 
                      className="btn btn-outline-primary me-2"
                      onClick={() => router.back()}
                    >
                      <i className="ti ti-arrow-left me-1"></i>
                      Kembali
                    </button>
                    <button 
                      className="btn btn-primary"
                      onClick={() => router.push(`/payment-methods/${method.id}/edit`)}
                    >
                      <i className="ti ti-edit me-1"></i>
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Card */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    {method.logo_url && (
                      <Image 
                        src={method.logo_url} 
                        alt={method.name} 
                        width={32} 
                        height={32} 
                        className="rounded"
                        unoptimized={true}
                      />
                    )}
                    <div>
                      <h5 className="card-title mb-1">{method.name}</h5>
                      <p className="card-subtitle text-muted mb-0">{method.code}</p>
                    </div>
                  </div>
                  <span className={`badge bg-label-${getStatusBadgeVariant(method.status)}`}>
                    {getStatusText(method.status)}
                  </span>
                </div>
              </div>
              <div className="card-body">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-3">
                      <i className="ti ti-tag text-primary me-2"></i>
                      <span className="fw-bold me-2">Tipe:</span>
                      <span>{method.type || '-'}</span>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-3">
                      <i className="ti ti-calendar text-primary me-2"></i>
                      <span className="fw-bold me-2">Tanggal Dibuat:</span>
                      <span>
                        {new Date(method.createdAt).toLocaleDateString('id-ID', {
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric', 
                          hour: '2-digit', 
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-3">
                      <i className="ti ti-clock text-primary me-2"></i>
                      <span className="fw-bold me-2">Terakhir Diupdate:</span>
                      <span>
                        {new Date(method.updatedAt).toLocaleDateString('id-ID', {
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric', 
                          hour: '2-digit', 
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-3">
                      <i className="ti ti-id text-primary me-2"></i>
                      <span className="fw-bold me-2">ID Metode:</span>
                      <span className="font-monospace bg-light px-2 py-1 rounded">{method.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
