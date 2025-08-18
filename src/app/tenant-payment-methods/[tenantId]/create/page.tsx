'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AuthGuard from '@/components/auth/AuthGuard';
import { useToast } from '@/contexts/ToastContext';
import { createTenantPaymentMethodWithCookies, getPaymentMethodWithCookies } from '@/lib/api';
import { PaymentMethod } from '@/types/paymentMethod';
import { useSweetAlert } from '@/lib/sweetalert-config';
import Link from 'next/link';

const createTenantPaymentMethodSchema = z.object({
  payment_method_id: z.string().min(1, 'Payment method harus dipilih'),
  fee_type: z.enum(['flat', 'percent'], {
    message: 'Tipe fee harus dipilih dari opsi yang tersedia'
  }),
  fee_value: z.number().min(0.01, 'Fee value harus lebih dari 0')
});

type CreateTenantPaymentMethodForm = z.infer<typeof createTenantPaymentMethodSchema>;

export default function CreateTenantPaymentMethodPage() {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();
  const sweetAlert = useSweetAlert();
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(true);

  const tenantId = params.tenantId as string;

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateTenantPaymentMethodForm>({
    resolver: zodResolver(createTenantPaymentMethodSchema),
    defaultValues: {
      fee_type: 'flat',
      fee_value: 0.01
    }
  });

  // Fetch available payment methods
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setLoadingPaymentMethods(true);
        console.log('🔍 Fetching payment methods...');
        const response = await getPaymentMethodWithCookies();
        console.log('✅ Payment methods response:', response);
        setPaymentMethods(response.data);
      } catch (error) {
        console.error('❌ Error fetching payment methods:', error);
        showToast({
          type: 'error',
          title: 'Error',
          message: 'Gagal mengambil data payment methods'
        });
      } finally {
        setLoadingPaymentMethods(false);
      }
    };

    fetchPaymentMethods();
  }, [showToast]);

  const onSubmit = async (data: CreateTenantPaymentMethodForm) => {
    setLoading(true);
    try {
      console.log('🔍 Submitting form data:', data);
      
      const payload = {
        payment_method_id: data.payment_method_id,
        fee_type: data.fee_type,
        fee_value: data.fee_value
      };

      console.log('🔍 API payload:', payload);

      // Tampilkan loading SweetAlert
      sweetAlert.loading('Memproses...', 'Sedang menyimpan data payment method');

      const response = await createTenantPaymentMethodWithCookies(tenantId, {
        ...payload,
        tenant_id: tenantId
      });
      console.log('✅ API response:', response);

      // Tampilkan success SweetAlert
      sweetAlert.success("Berhasil!", "Payment method tenant berhasil dibuat.");

      // Redirect setelah delay singkat
      setTimeout(() => {
        router.push(`/tenant-payment-methods/${tenantId}`);
      }, 1500);

    } catch (error: unknown) {
      console.error('❌ Error creating tenant payment method:', error);

      let errorMessage = 'Terjadi kesalahan yang tidak diketahui.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String(error.message);
      }

      // Tampilkan error SweetAlert
      sweetAlert.error("Error!", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard requireAuth={true}>
      <DashboardLayout>
        <div className="container-xxl flex-grow-1 container-p-y">
        {/* Header */}
        <div className="row">
          <div className="col-12">
            <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
              <h1 className="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0">
                Tambah Payment Method Tenant
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
                <li className="breadcrumb-item active">Tambah Payment Method</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Form Payment Method Tenant</h5>
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
                          min="0.01"
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


                  </div>

                  <div className="row mt-4">
                    <div className="col-12">
                      <div className="d-flex gap-2">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={loading || loadingPaymentMethods}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Menyimpan...
                            </>
                          ) : (
                            <>
                              <i className="ti ti-device-floppy me-1"></i>
                              Simpan
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
      </AuthGuard>
    );
  } 