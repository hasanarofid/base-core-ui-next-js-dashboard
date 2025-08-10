'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useToast } from '@/contexts/ToastContext';
import { createUserWithCookies } from '@/lib/api';
import { Tenant } from '@/types/tenant';

const createUserSchema = z.object({
  full_name: z.string().min(1, 'Nama lengkap harus diisi'),
  email: z.string().email('Email harus valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  role: z.string().min(1, 'Role harus dipilih'),
  tenant_id: z.string().optional(),
  isVerified: z.boolean(),
  force_password_change: z.boolean()
});

type CreateUserForm = z.infer<typeof createUserSchema>;

export default function CreateUserPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loadingTenants, setLoadingTenants] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      role: '',
      tenant_id: '',
      isVerified: false,
      force_password_change: false
    }
  });

  // Fetch tenants for dropdown
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setLoadingTenants(true);
        // Import getTenantsWithCookies dynamically to avoid circular dependency
        const { getTenantsWithCookies } = await import('@/lib/api');
        const response = await getTenantsWithCookies();
        setTenants(response.data || []);
      } catch (error) {
        console.error('Error fetching tenants:', error);
        showToast({
          type: 'error',
          title: 'Error!',
          message: 'Gagal mengambil data tenants',
          duration: 5000
        });
      } finally {
        setLoadingTenants(false);
      }
    };

    fetchTenants();
  }, [showToast]);

  const onSubmit = async (data: CreateUserForm) => {
    setLoading(true);
    try {
      const payload = {
        fullName: data.full_name,
        email: data.email,
        password: data.password,
        role: data.role,
        tenant_id: data.tenant_id || null,
        isVerified: data.isVerified,
        force_password_change: data.force_password_change
      };

      console.log('Sending user data:', payload);

      await createUserWithCookies(payload);
      console.log('User created successfully');
      
      showToast({
        type: 'success',
        title: 'Berhasil!',
        message: 'User berhasil dibuat',
        duration: 3000
      });
      
      // Redirect ke halaman list
      router.push('/user-management');
    } catch (error: unknown) {
      console.error('Error creating user:', error);
      
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
                      User Management
                    </div>
                    <h2 className="page-title">
                      Tambah User Baru
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
                <h5 className="card-title mb-1">Form Tambah User</h5>
                <p className="card-subtitle text-muted mb-0">Isi data user yang akan ditambahkan</p>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">
                          Nama Lengkap <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${errors.full_name ? 'is-invalid' : ''}`}
                          placeholder="Masukkan nama lengkap"
                          {...register('full_name')}
                        />
                        {errors.full_name && (
                          <div className="invalid-feedback">{errors.full_name.message}</div>
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

                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">
                          Password <span className="text-danger">*</span>
                        </label>
                        <input
                          type="password"
                          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                          placeholder="Masukkan password"
                          {...register('password')}
                        />
                        {errors.password && (
                          <div className="invalid-feedback">{errors.password.message}</div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">
                          Role <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-control ${errors.role ? 'is-invalid' : ''}`}
                          {...register('role')}
                        >
                          <option value="">Pilih Role</option>
                          <option value="superadmin">Super Admin</option>
                          <option value="admin_tenant">Admin Tenant</option>
                          <option value="end_user">End User</option>
                        </select>
                        {errors.role && (
                          <div className="invalid-feedback">{errors.role.message}</div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">Tenant (Opsional)</label>
                        <select
                          className="form-control"
                          {...register('tenant_id')}
                          disabled={loadingTenants}
                        >
                          <option value="">Pilih Tenant</option>
                          {tenants.map((tenant) => (
                            <option key={tenant.id} value={tenant.id}>
                              {tenant.name} ({tenant.domain || 'No Domain'})
                            </option>
                          ))}
                        </select>
                        {loadingTenants && (
                          <div className="form-text">Memuat data tenants...</div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">Status Verifikasi</label>
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="isVerified"
                            {...register('isVerified')}
                          />
                          <label className="form-check-label" htmlFor="isVerified">
                            User sudah terverifikasi
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label className="form-label">Force Password Change</label>
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="force_password_change"
                            {...register('force_password_change')}
                          />
                          <label className="form-check-label" htmlFor="force_password_change">
                            User harus ganti password saat login pertama
                          </label>
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
                      {loading ? 'Menyimpan...' : 'Simpan User'}
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