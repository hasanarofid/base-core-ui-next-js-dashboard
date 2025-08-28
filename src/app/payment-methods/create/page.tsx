'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useToastContext } from '@/contexts/ToastContext';
import { createPaymentMethodWithCookies } from '@/lib/api';

const createPaymentMethodSchema = z.object({
  name: z.string().min(1, 'Nama metode pembayaran harus diisi'),
  logo_url: z.string().url('URL logo harus valid').optional().or(z.literal('')),
  code: z.string().min(1, 'Kode harus diisi'),
  type: z.enum(['VA', 'QRIS', 'EWALLET', 'CC', 'BANK_TRANSFER'], {
    message: 'Tipe harus dipilih dari opsi yang tersedia'
  }),
  status: z.enum(['active', 'inactive'])
});

type CreatePaymentMethodForm = z.infer<typeof createPaymentMethodSchema>;

export default function CreatePaymentMethodPage() {
  const router = useRouter();
  const { showSuccess, showError } = useToastContext();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreatePaymentMethodForm>({
    resolver: zodResolver(createPaymentMethodSchema),
    defaultValues: {
      logo_url: '',
      code: '',
      type: 'VA',
      status: 'active'
    }
  });

  const onSubmit = async (data: CreatePaymentMethodForm) => {
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        logo_url: data.logo_url,
        code: data.code,
        type: data.type,
        status: data.status
      };

      await createPaymentMethodWithCookies(payload);

      showSuccess('Berhasil!', 'Metode pembayaran berhasil dibuat');

      router.push('/payment-methods');
    } catch (error: unknown) {
      console.error('Error creating payment method:', error);

      if (error instanceof Error) {
        showError('Error!', error.message);
      } else {
        showError('Error!', 'Terjadi kesalahan yang tidak diketahui.');
      }
    } finally {
      setLoading(false);
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
                      Tambah Metode Pembayaran
                    </h2>
                  </div>
                  <div className="col-auto ms-auto d-print-none">
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => router.back()}
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
                <h5 className="card-title mb-1">Form Tambah Metode Pembayaran</h5>
                <p className="card-subtitle text-muted mb-0">Isi data metode pembayaran yang akan ditambahkan</p>
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
                        <label className="form-label">URL Logo</label>
                        <input
                          type="url"
                          className={`form-control ${errors.logo_url ? 'is-invalid' : ''}`}
                          placeholder="https://example.com/logo.png"
                          {...register('logo_url')}
                        />
                        {errors.logo_url && <div className="invalid-feedback">{errors.logo_url.message}</div>}
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
                        >
                          <option value="">Pilih Status</option>
                          <option value="active">Aktif</option>
                          <option value="inactive">Tidak Aktif</option>
                        </select>
                        {errors.status && <div className="invalid-feedback">{errors.status.message}</div>}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex justify-content-end gap-3 pt-4 border-top">
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => router.back()}
                      disabled={loading}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary d-grid w-100"
                      disabled={loading}
                    >
                      <i className="ti ti-device-floppy me-1"></i>
                      {loading ? 'Menyimpan...' : 'Simpan Metode'}
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
