'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Building } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

import { Card } from '@/components/ui/Card';
import { useToast } from '@/contexts/ToastContext';

const editTenantSchema = z.object({
  name: z.string().min(1, 'Nama tenant harus diisi'),
  logo_url: z.string().url('URL logo harus valid').optional().or(z.literal('')),
  domain: z.string().url('Domain harus valid').optional().or(z.literal('')),
  email: z.string().email('Email harus valid'),
  contact_person: z.string().min(1, 'Kontak person harus diisi'),
});

type EditTenantForm = z.infer<typeof editTenantSchema>;

interface Tenant {
  id: string;
  name: string;
  logo_url?: string;
  domain?: string;
  email: string;
  contact_person: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditTenantPage() {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EditTenantForm>({
    resolver: zodResolver(editTenantSchema),
  });

  const tenantId = params.id as string;

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const response = await fetch(`/api/tenants/${tenantId}`);
        const data = await response.json();

        if (!response.ok) {
          showToast({ 
            type: 'error', 
            title: 'Error', 
            message: data.message || 'Gagal mengambil data tenant' 
          });
          router.push('/tenant-management');
          return;
        }

        const tenantData = data.data || data;
        setTenant(tenantData);
        
        // Set form values
        setValue('name', tenantData.name);
        setValue('logo_url', tenantData.logo_url || '');
        setValue('domain', tenantData.domain || '');
        setValue('email', tenantData.email);
        setValue('contact_person', tenantData.contact_person);
      } catch (error) {
        console.error('Error fetching tenant:', error);
        showToast({ 
          type: 'error', 
          title: 'Error', 
          message: 'Gagal mengambil data tenant' 
        });
        router.push('/tenant-management');
      } finally {
        setLoading(false);
      }
    };

    if (tenantId) {
      fetchTenant();
    }
  }, [tenantId, setValue, showToast, router]);

  const onSubmit = async (data: EditTenantForm) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/tenants/${tenantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        showToast({ 
          type: 'error', 
          title: 'Error', 
          message: result.message || 'Gagal memperbarui tenant' 
        });
        return;
      }

      showToast({ 
        type: 'success', 
        title: 'Berhasil', 
        message: 'Tenant berhasil diperbarui' 
      });
      router.push(`/tenant-management/${tenantId}`);
    } catch (error) {
      console.error('Error updating tenant:', error);
      showToast({ 
        type: 'error', 
        title: 'Error', 
        message: 'Gagal memperbarui tenant' 
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue-3 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data tenant...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!tenant) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-gray-600">Tenant tidak ditemukan</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="page-header d-flex align-items-center justify-content-between mb-6">
          <div className="page-title">
            <div className="page-pretitle">
              Tenant Management
            </div>
            <h2 className="page-title d-flex align-items-center gap-2">
              <Building className="w-6 h-6 text-brand-blue-3" />
              Edit Tenant
            </h2>
          </div>
          <div className="page-actions">
            <button 
              className="btn btn-outline-primary d-flex align-items-center gap-2 px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 border-2 hover:border-brand-blue-3"
              onClick={() => router.push(`/tenant-management/${tenantId}`)}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <Card className="max-w-4xl mx-auto">
          <div className="card-header">
            <h4 className="card-title mb-1">Form Edit Tenant</h4>
            <p className="card-subtitle text-muted mb-0">Perbarui data tenant yang ada</p>
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
                  className="btn btn-outline-primary d-flex align-items-center gap-2 px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 border-2 hover:border-brand-blue-3"
                  onClick={() => router.push(`/tenant-management/${tenantId}`)}
                  disabled={updating}
                >
                  <span>Batal</span>
                </button>
                <button
                  type="submit"
                  className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 bg-gradient-to-r from-brand-blue-3 to-brand-blue-4 hover:from-brand-blue-4 hover:to-brand-blue-5"
                  disabled={updating}
                >
                  <Save className="w-4 h-4" />
                  <span>{updating ? 'Memperbarui...' : 'Update Tenant'}</span>
                </button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
} 