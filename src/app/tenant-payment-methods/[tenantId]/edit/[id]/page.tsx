'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useToast } from '@/contexts/ToastContext';
import { updateTenantPaymentMethodWithCookies, getPaymentMethodWithCookies, getTenantPaymentMethodsWithCookies } from '@/lib/api';
import { PaymentMethod } from '@/types/paymentMethod';
import { TenantPaymentMethod } from '@/types/tenantPaymentMethod';
import Link from 'next/link';

const updateTenantPaymentMethodSchema = z.object({
  payment_method_id: z.string().min(1, 'Payment method harus dipilih'),
  fee_type: z.enum(['flat', 'percent'], {
    message: 'Tipe fee harus dipilih dari opsi yang tersedia'
  }),
  fee_value: z.number().min(0, 'Fee value harus lebih dari atau sama dengan 0'),
  status: z.enum(['active', 'inactive'])
});

type UpdateTenantPaymentMethodForm = z.infer<typeof updateTenantPaymentMethodSchema>;

export default function EditTenantPaymentMethodPage() {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(true);
  const [tenantPaymentMethod, setTenantPaymentMethod] = useState<TenantPaymentMethod | null>(null);

  const tenantId = params.tenantId as string;
  const paymentMethodId = params.id as string;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<UpdateTenantPaymentMethodForm>({
    resolver: zodResolver(updateTenantPaymentMethodSchema)
  });

  // Fetch payment method data and available payment methods
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setLoadingPaymentMethods(true);

        // Fetch available payment methods
        const paymentMethodsResponse = await getPaymentMethodWithCookies();
        setPaymentMethods(paymentMethodsResponse.data);

        // Fetch current tenant payment method data
        // Since individual endpoint might not exist, we'll get from list and filter
        const tenantPaymentMethodsResponse = await getTenantPaymentMethodsWithCookies(tenantId);
        const allPaymentMethods = tenantPaymentMethodsResponse.data;
        const paymentMethodData = allPaymentMethods.find((pm: TenantPaymentMethod) => pm.id === paymentMethodId);
        
        if (!paymentMethodData) {
          throw new Error('Payment method tidak ditemukan');
        }
        
        console.log('🔍 Found payment method data:', paymentMethodData);
        setTenantPaymentMethod(paymentMethodData);

        // Set form values
        setValue('payment_method_id', paymentMethodData.payment_method_id);
        setValue('fee_type', paymentMethodData.fee_type);
        setValue('fee_value', paymentMethodData.fee_value);
        setValue('status', paymentMethodData.status);

        console.log('🔍 Form values set successfully');

      } catch (error) {
        console.error('Error fetching data:', error);
        showToast({
          type: 'error',
          title: 'Error',
          message: error instanceof Error ? error.message : 'Gagal mengambil data payment method'
        });
        // Don't redirect immediately, let user see the error
      } finally {
        setLoading(false);
        setLoadingPaymentMethods(false);
      }
    };

    if (tenantId && paymentMethodId) {
      console.log('🔍 Fetching data for tenant:', tenantId, 'payment method:', paymentMethodId);
      fetchData();
    }
  }, [tenantId, paymentMethodId, setValue, showToast]);

  const onSubmit = async (data: UpdateTenantPaymentMethodForm) => {
    setUpdating(true);
    try {
      const payload = {
        payment_method_id: data.payment_method_id,
        fee_type: data.fee_type,
        fee_value: data.fee_value,
        status: data.status
      };

      await updateTenantPaymentMethodWithCookies(paymentMethodId, payload);

      showToast({
        type: 'success',
        title: 'Berhasil!',
        message: 'Payment method tenant berhasil diperbarui',
        duration: 3000
      });

      router.push(`/tenant-payment-methods/${tenantId}`);
    } catch (error: unknown) {
      console.error('Error updating tenant payment method:', error);

      if (error instanceof Error) {
        showToast({
          type: 'error',
          title: 'Error!',
          message: error.message,
          duration: 5000
        });
      } else {
        showToast({
          type: 'error',
          title: 'Error!',
          message: 'Terjadi kesalahan yang tidak diketahui.',
          duration: 5000
        });
      }
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

  // Show error state if no payment method data
  if (!tenantPaymentMethod) {
    return (
      <DashboardLayout>
        <div className="container-xxl flex-grow-1 container-p-y">
          <div className="row">
            <div className="col-12">
              <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
                <h1 className="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0">
                  Edit Payment Method Tenant
                </h1>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link href="/dashboard">Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link href="/tenant-management">Tenant Management</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link href={`/tenant-payment-methods/${tenantId}`}>Payment Methods</Link>
                  </li>
                  <li className="breadcrumb-item active">Edit Payment Method</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body text-center py-5">
                  <div className="mb-4">
                    <i className="ti ti-alert-circle text-danger" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h4 className="text-danger mb-3">Gagal Memuat Data</h4>
                  <p className="text-muted mb-4">
                    Terjadi kesalahan saat memuat data payment method. Silakan coba lagi.
                  </p>
                  <div className="d-flex justify-content-center gap-2">
                    <button 
                      className="btn btn-primary"
                      onClick={() => window.location.reload()}
                    >
                      <i className="ti ti-refresh me-1"></i>
                      Coba Lagi
                    </button>
                    <Link
                      href={`/tenant-payment-methods/${tenantId}`}
                      className="btn btn-outline-secondary"
                    >
                      <i className="ti ti-arrow-left me-1"></i>
                      Kembali ke List
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container-xxl flex-grow-1 container-p-y">
        {/* Header */}
        <div className="row">
          <div className="col-12">
            <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
              <h1 className="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0">
                Edit Payment Method Tenant
              </h1>
              <ul className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link href="/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="/tenant-management">Tenant Management</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href={`/tenant-payment-methods/${tenantId}`}>Payment Methods</Link>
                </li>
                <li className="breadcrumb-item active">Edit Payment Method</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Form Edit Payment Method Tenant</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label">
                          Payment Method <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-control ${errors.payment_method_id ? 'is-invalid' : ''}`}
                          {...register('payment_method_id')}
                          disabled={loadingPaymentMethods}
                        >
                          <option value="">Pilih Payment Method</option>
                          {paymentMethods.map((method) => (
                            <option key={method.id} value={method.id}>
                              {method.name} ({method.type})
                            </option>
                          ))}
                        </select>
                        {errors.payment_method_id && (
                          <div className="invalid-feedback">{errors.payment_method_id.message}</div>
                        )}
                        {loadingPaymentMethods && (
                          <div className="form-text">Loading payment methods...</div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label">
                          Tipe Fee <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-control ${errors.fee_type ? 'is-invalid' : ''}`}
                          {...register('fee_type')}
                        >
                          <option value="flat">Flat (Nominal Tetap)</option>
                          <option value="percent">Persentase (%)</option>
                        </select>
                        {errors.fee_type && (
                          <div className="invalid-feedback">{errors.fee_type.message}</div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label">
                          Nilai Fee <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className={`form-control ${errors.fee_value ? 'is-invalid' : ''}`}
                          placeholder="Masukkan nilai fee"
                          {...register('fee_value', { valueAsNumber: true })}
                        />
                        {errors.fee_value && (
                          <div className="invalid-feedback">{errors.fee_value.message}</div>
                        )}
                        <div className="form-text">
                          Masukkan nilai fee sesuai dengan tipe yang dipilih
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label">
                          Status <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-control ${errors.status ? 'is-invalid' : ''}`}
                          {...register('status')}
                        >
                          <option value="active">Aktif</option>
                          <option value="inactive">Tidak Aktif</option>
                        </select>
                        {errors.status && (
                          <div className="invalid-feedback">{errors.status.message}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row mt-4">
                    <div className="col-12">
                      <div className="d-flex gap-2">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={updating || loadingPaymentMethods}
                        >
                          {updating ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Menyimpan...
                            </>
                          ) : (
                            <>
                              <i className="ti ti-device-floppy me-1"></i>
                              Simpan Perubahan
                            </>
                          )}
                        </button>
                        <Link
                          href={`/tenant-payment-methods/${tenantId}`}
                          className="btn btn-outline-secondary"
                        >
                          <i className="ti ti-arrow-left me-1"></i>
                          Kembali
                        </Link>
                      </div>
                    </div>
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