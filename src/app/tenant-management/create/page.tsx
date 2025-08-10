'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useToast } from '@/contexts/ToastContext';
import { createTenantWithCookies } from '@/lib/api';

const createTenantSchema = z.object({
  name: z.string().min(1, 'Nama tenant harus diisi'),
  logo_url: z.string().url('URL logo harus valid').optional().or(z.literal('')),
  domain: z.string().url('Domain harus valid').optional().or(z.literal('')),
  email: z.string().email('Email harus valid'),
  contact_person: z.string().min(1, 'Kontak person harus diisi')
});

type CreateTenantForm = z.infer<typeof createTenantSchema>;

export default function CreateTenantPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateTenantForm>({
    resolver: zodResolver(createTenantSchema),
    defaultValues: {
      logo_url: 'https://naufalpujimahdy.id/template/assets/static/images/bg/profile.webp',
      domain: 'https://naufalpujimahdy.ss/',
      email: 'naufalnaufal023@gmail.com',
      contact_person: '082391782895'
    }
  });

  const onSubmit = async (data: CreateTenantForm) => {
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        logo_url: data.logo_url,
        domain: data.domain,
        email: data.email,
        contact_person: data.contact_person
      };

      console.log('Sending tenant data:', payload);

      // Gunakan API route internal yang akan menangani cookies
      await createTenantWithCookies(payload);
      console.log('Tenant created successfully');
      
      showToast({
        type: 'success',
        title: 'Berhasil!',
        message: 'Tenant berhasil dibuat',
        duration: 3000
      });
      
      // Redirect ke halaman list
      router.push('/tenant-management');
    } catch (error: unknown) {
      console.error('Error creating tenant:', error);
      
      // Handle error response
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
      <div className="container-xxl flex-grow-1 container-p-y">
        {/* Page Header */}
        <div className="row">
          <div className="col-12">
            <div className="page-header d-print-none">
              <div className="container-xl">
                <div className="row g-2 align-items-center">
                  <div className="col">
                    <div className="page-pretitle">
                      Tenant Management
                    </div>
                    <h2 className="page-title">
                      Tambah Tenant Baru
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
                <h5 className="card-title mb-1">Form Tambah Tenant</h5>
                <p className="card-subtitle text-muted mb-0">Isi data tenant yang akan ditambahkan</p>
              </div>
              <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">
                      Nama Tenant <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      placeholder="Masukkan nama tenant"
                      {...register('name')}
                    />
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name.message}</div>
                    )}
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
                    {errors.logo_url && (
                      <div className="invalid-feedback">{errors.logo_url.message}</div>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Domain</label>
                    <input
                      type="url"
                      className={`form-control ${errors.domain ? 'is-invalid' : ''}`}
                      placeholder="https://example.com"
                      {...register('domain')}
                    />
                    {errors.domain && (
                      <div className="invalid-feedback">{errors.domain.message}</div>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      placeholder="email@example.com"
                      {...register('email')}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email.message}</div>
                    )}
                  </div>
                </div>

                <div className="col-6">
                  <div className="form-group">
                    <label className="form-label">
                      Kontak Person <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.contact_person ? 'is-invalid' : ''}`}
                      placeholder="Masukkan nomor kontak"
                      {...register('contact_person')}
                    />
                    {errors.contact_person && (
                      <div className="invalid-feedback">{errors.contact_person.message}</div>
                    )}
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
                  {loading ? 'Menyimpan...' : 'Simpan Tenant'}
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