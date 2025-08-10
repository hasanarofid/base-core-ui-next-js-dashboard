'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useToast } from '@/contexts/ToastContext';
import { getPaymentMethodByIdWithCookies, updatePaymentMethodWithCookies } from '@/lib/api';
import { PaymentMethod } from '@/types/paymentMethod';

const updatePaymentMethodSchema = z.object({
  name: z.string().min(1, 'Nama metode pembayaran harus diisi'),
  code: z.string().min(1, 'Kode harus diisi'),
  type: z.enum(['VA', 'QRIS', 'EWALLET', 'CC', 'BANK_TRANSFER'], {
    message: 'Tipe harus dipilih dari opsi yang tersedia'
  }),
  status: z.enum(['active', 'inactive'])
});

type UpdatePaymentMethodFormData = z.infer<typeof updatePaymentMethodSchema>;

export default function EditPaymentMethodPage() {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();
  const paymentMethodId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [method, setMethod] = useState<PaymentMethod | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UpdatePaymentMethodFormData>({
    resolver: zodResolver(updatePaymentMethodSchema)
  });

  useEffect(() => {
    const fetchMethod = async () => {
      try {
        console.log('Fetching payment method with ID:', paymentMethodId);
        const response = await getPaymentMethodByIdWithCookies(paymentMethodId);
        const methodData = response.data;
        console.log('Fetched payment method data:', methodData);
        
        setMethod(methodData);
        
        // Set form values
        setValue('name', methodData.name);
        setValue('code', methodData.code || '');
        setValue('type', methodData.type as 'VA' | 'QRIS' | 'EWALLET' | 'CC' | 'BANK_TRANSFER');
        setValue('status', methodData.status as 'active' | 'inactive');
        
        console.log('Form values set:', {
          name: methodData.name,
          code: methodData.code || '',
          type: methodData.type,
          status: methodData.status
        });
      } catch (error) {
        console.error('Failed to fetch payment method:', error);
        showToast({
          type: 'error',
          title: 'Error',
          message: 'Gagal mengambil data metode pembayaran'
        });
        router.push('/payment-methods');
      } finally {
        setLoading(false);
      }
    };

    if (paymentMethodId) fetchMethod();
  }, [paymentMethodId, setValue, showToast, router]);

  const onSubmit = async (data: UpdatePaymentMethodFormData) => {
    setUpdating(true);
    try {
      console.log('Submitting payment method update data:', data);
      console.log('Payment method ID:', paymentMethodId);
      
      const updateData = {
        name: data.name,
        code: data.code,
        type: data.type,
        status: data.status
      };
      
      console.log('Update data to be sent:', updateData);
      
      const result = await updatePaymentMethodWithCookies(paymentMethodId, updateData);
      
      console.log('Update result:', result);
      
      showToast({
        type: 'success',
        title: 'Berhasil',
        message: 'Metode pembayaran berhasil diperbarui'
      });
      
      // Refresh data setelah update
      const updatedMethod = await getPaymentMethodByIdWithCookies(paymentMethodId);
      setMethod(updatedMethod.data);
      
      router.push(`/payment-methods/${paymentMethodId}`);
    } catch (error) {
      console.error('Error updating method:', error);
      
      let errorMessage = 'Gagal memperbarui metode pembayaran';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      showToast({
        type: 'error',
        title: 'Error',
        message: errorMessage
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container-xxl flex-grow-1 container-p-y">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
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
          <div className="alert alert-warning" role="alert">
            <h4 className="alert-heading">Warning!</h4>
            <p>Metode pembayaran tidak ditemukan</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
                      Edit Metode Pembayaran
                    </h2>
                  </div>
                  <div className="col-auto ms-auto d-print-none">
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => router.push(`/payment-methods/${paymentMethodId}`)}
                    >
                      <i className="ti ti-arrow-left me-1"></i>
                      Kembali
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-1">Form Edit Metode Pembayaran</h5>
                <p className="card-subtitle text-muted mb-0">Perbarui data metode pembayaran: {method.name}</p>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">
                          Nama Metode <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                          placeholder="Masukkan nama metode"
                          {...register('name')}
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">
                          Kode <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.code ? 'is-invalid' : ''}`}
                          placeholder="Masukkan kode"
                          {...register('code')}
                        />
                        {errors.code && <div className="invalid-feedback">{errors.code.message}</div>}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">
                          Tipe <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-control ${errors.type ? 'is-invalid' : ''}`}
                          {...register('type')}
                          onChange={(e) => {
                            console.log('Type changed to:', e.target.value);
                            setValue('type', e.target.value as 'VA' | 'QRIS' | 'EWALLET' | 'CC' | 'BANK_TRANSFER');
                          }}
                        >
                          <option value="">Pilih Tipe</option>
                          <option value="VA">VA (Virtual Account)</option>
                          <option value="QRIS">QRIS</option>
                          <option value="EWALLET">E-Wallet</option>
                          <option value="CC">Credit Card</option>
                          <option value="BANK_TRANSFER">Bank Transfer</option>
                        </select>
                        {errors.type && <div className="invalid-feedback">{errors.type.message}</div>}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">
                          Status <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-control ${errors.status ? 'is-invalid' : ''}`}
                          {...register('status')}
                          onChange={(e) => {
                            console.log('Status changed to:', e.target.value);
                            setValue('status', e.target.value as 'active' | 'inactive');
                          }}
                        >
                          <option value="">Pilih Status</option>
                          <option value="active">Aktif</option>
                          <option value="inactive">Tidak Aktif</option>
                        </select>
                        {errors.status && <div className="invalid-feedback">{errors.status.message}</div>}
                      </div>
                    </div>
                  </div>

                  {/* System Information */}
                  <div className="border-top pt-4 mt-4">
                    <h6 className="text-muted mb-3">Informasi Sistem</h6>
                    <div className="row g-3">
                      <div className="col-md-4">
                        <div className="d-flex align-items-center">
                          <i className="ti ti-id text-primary me-2"></i>
                          <span className="fw-bold me-2">ID:</span>
                          <span className="font-monospace">{method.id}</span>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="d-flex align-items-center">
                          <i className="ti ti-calendar text-primary me-2"></i>
                          <span className="fw-bold me-2">Dibuat:</span>
                          <span>{new Date(method.createdAt).toLocaleDateString('id-ID')}</span>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="d-flex align-items-center">
                          <i className="ti ti-clock text-primary me-2"></i>
                          <span className="fw-bold me-2">Terakhir Diupdate:</span>
                          <span>{new Date(method.updatedAt).toLocaleDateString('id-ID')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex justify-content-end gap-3 pt-4 border-top">
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => router.back()}
                      disabled={updating}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary d-grid w-100"
                      disabled={updating}
                    >
                      <i className="ti ti-device-floppy me-1"></i>
                      {updating ? 'Memperbarui...' : 'Update Metode'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}