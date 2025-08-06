'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Building } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/contexts/ToastContext';
import { createPaymentMethodWithCookies } from '@/lib/api';

const createPaymentMethodSchema = z.object({
  name: z.string().min(1, 'Nama metode pembayaran harus diisi'),
  logo_url: z.string().url('URL logo harus valid').optional().or(z.literal('')),
  code: z.string().min(1, 'Kode harus diisi'),
  type: z.string().min(1, 'Tipe harus diisi')
});

type CreatePaymentMethodForm = z.infer<typeof createPaymentMethodSchema>;

export default function CreatePaymentMethodPage() {
  const router = useRouter();
  const { showToast } = useToast();
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
      type: ''
    }
  });

  const onSubmit = async (data: CreatePaymentMethodForm) => {
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        logo_url: data.logo_url,
        code: data.code,
        type: data.type
      };

      await createPaymentMethodWithCookies(payload);

      showToast({
        type: 'success',
        title: 'Berhasil!',
        message: 'Metode pembayaran berhasil dibuat',
        duration: 3000
      });

      router.push('/payment-methods');
    } catch (error: unknown) {
      console.error('Error creating payment method:', error);

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
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="page-header d-flex align-items-center justify-content-between mb-6">
          <div className="page-title">
            <div className="page-pretitle">Payment Method</div>
            <h2 className="page-title d-flex align-items-center gap-2">
              <Building className="w-6 h-6 text-brand-blue-3" />
              Tambah Metode Pembayaran
            </h2>
          </div>
          <div className="page-actions">
            <button
              className="btn btn-outline-primary d-flex align-items-center gap-2 px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 border-2 hover:border-brand-blue-3"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>
          </div>
        </div>

        <Card className="max-w-4xl mx-auto">
          <div className="card-header">
            <h4 className="card-title mb-1">Form Tambah Metode Pembayaran</h4>
            <p className="card-subtitle text-muted mb-0">Isi data metode pembayaran yang akan ditambahkan</p>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                    <input
                      type="text"
                      className={`form-control ${errors.type ? 'is-invalid' : ''}`}
                      placeholder="Masukkan tipe"
                      {...register('type')}
                    />
                    {errors.type && <div className="invalid-feedback">{errors.type.message}</div>}
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-3 pt-4 border-top">
                <button
                  type="button"
                  className="btn btn-outline-primary d-flex align-items-center gap-2 px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 border-2 hover:border-brand-blue-3"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  <span>Batal</span>
                </button>
                <button
                  type="submit"
                  className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 bg-gradient-to-r from-brand-blue-3 to-brand-blue-4 hover:from-brand-blue-4 hover:to-brand-blue-5"
                  disabled={loading}
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Menyimpan...' : 'Simpan Metode'}</span>
                </button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
