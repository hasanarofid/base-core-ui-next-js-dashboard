'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Users } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { createUserWithCookies } from '@/lib/api';
import { Tenant } from '@/types/tenant';
import Swal from 'sweetalert2';

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
  const [loading, setLoading] = useState(false);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loadingTenants, setLoadingTenants] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
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
        Swal.fire({
          title: "Error!",
          text: "Gagal mengambil data tenants",
          icon: "error",
          confirmButtonColor: "#dc3545",
        });
      } finally {
        setLoadingTenants(false);
      }
    };

    fetchTenants();
  }, []);

  const onSubmit = async (data: CreateUserForm) => {
    setLoading(true);
    try {
      const payload = {
        full_name: data.full_name,
        email: data.email,
        password: data.password,
        role: data.role,
        tenant_id: data.tenant_id || null,
        isVerified: data.isVerified,
        force_password_change: data.force_password_change
      };

      console.log('Sending user data:', payload);

      const result = await createUserWithCookies(payload);
      console.log('User created successfully:', result);
      
      // Tampilkan splash success
      Swal.fire({
        title: "Berhasil!",
        text: "User berhasil dibuat",
        icon: "success",
        confirmButtonColor: "#28a745",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
      });
      
      // Redirect ke halaman list
      router.push('/user-management');
    } catch (error: unknown) {
      console.error('Error creating user:', error);
      
      // Tampilkan splash error
      if (error instanceof Error) {
        Swal.fire({
          title: "Error!",
          text: error.message,
          icon: "error",
          confirmButtonColor: "#dc3545",
          timer: 5000,
          timerProgressBar: true
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Terjadi kesalahan yang tidak diketahui.",
          icon: "error",
          confirmButtonColor: "#dc3545",
          timer: 5000,
          timerProgressBar: true
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="d-flex align-items-center gap-3 mb-4">
            <button
              onClick={() => router.back()}
              className="btn btn-outline-secondary d-flex align-items-center gap-2 px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>
            <div className="d-flex align-items-center gap-2">
              <Users className="w-6 h-6 text-brand-blue-3" />
              <h1 className="text-2xl font-bold text-gray-900 mb-0">Tambah User Baru</h1>
            </div>
          </div>
          <p className="text-gray-600 mb-0">Buat user baru untuk sistem Anda</p>
        </div>

        {/* Form Card */}
        <Card className="shadow-lg border-0">
          <div className="card-header bg-gradient-to-r from-brand-blue-3 to-brand-blue-4 text-white">
            <h5 className="card-title mb-0 d-flex align-items-center gap-2">
              <Users className="w-5 h-5" />
              <span>Informasi User</span>
            </h5>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="row">
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
                  <span>{loading ? 'Menyimpan...' : 'Simpan User'}</span>
                </button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
} 