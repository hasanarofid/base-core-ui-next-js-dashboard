'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useToast } from '@/contexts/ToastContext';
import Swal from 'sweetalert2';

const editTenantSchema = z.object({
  name: z.string().min(1, 'Nama tenant harus diisi'),
  logo_url: z.string().url('URL logo harus valid').optional().or(z.literal('')),
  domain: z.string().url('Domain harus valid').optional().or(z.literal('')),
  email: z.string().email('Email harus valid'),
  contact_person: z.string().min(1, 'Kontak person harus diisi'),
  callbackUrl: z.string().url('URL callback harus valid').optional().or(z.literal('')),
  ipWhitelist: z.string().optional().or(z.literal('')),
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
  config_json?: Record<string, unknown>;
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
        
        // Set config_json values
        const config = tenantData.config_json || {};
        setValue('callbackUrl', (config.callbackUrl as string) || '');
        setValue('ipWhitelist', (config.ipWhitelist as string) || '');
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
      // Prepare the data with config_json
      const submitData = {
        name: data.name,
        logo_url: data.logo_url,
        domain: data.domain,
        email: data.email,
        contact_person: data.contact_person,
        config_json: {
          callbackUrl: data.callbackUrl || null,
          ipWhitelist: data.ipWhitelist || null,
        }
      };

      const response = await fetch(`/api/tenants/${tenantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (!response.ok) {
        await Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: result.message || 'Gagal memperbarui tenant',
          confirmButtonText: 'OK',
          confirmButtonColor: '#dc3545',
          customClass: {
            popup: 'swal-custom-popup'
          }
        });
        return;
      }

      // Show success alert
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Tenant berhasil diperbarui',
        confirmButtonText: 'OK',
        confirmButtonColor: '#696cff',
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: 'swal-custom-popup'
        }
      });

      // Redirect ke list tenant
      router.push('/tenant-management');
    } catch (error) {
      console.error('Error updating tenant:', error);
      
      await Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error instanceof Error ? error.message : 'Gagal memperbarui tenant',
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc3545',
        customClass: {
          popup: 'swal-custom-popup'
        }
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

  if (!tenant) {
    return (
      <DashboardLayout>
        <div className="container-xxl flex-grow-1 container-p-y">
          <div className="alert alert-warning" role="alert">
            <h4 className="alert-heading">Warning!</h4>
            <p>Tenant tidak ditemukan</p>
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
                      Tenant Management
                    </div>
                    <h2 className="page-title">
                      Edit Tenant
                    </h2>
                  </div>
                  <div className="col-auto ms-auto d-print-none">
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => router.push(`/tenant-management/${tenantId}`)}
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
                <h5 className="card-title mb-1">Form Edit Tenant</h5>
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

                <div className="col-md-6">
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

                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">URL Callback</label>
                    <input
                      type="url"
                      className={`form-control ${errors.callbackUrl ? 'is-invalid' : ''}`}
                      placeholder="https://example.com/callback"
                      {...register('callbackUrl')}
                    />
                    {errors.callbackUrl && (
                      <div className="invalid-feedback">{errors.callbackUrl.message}</div>
                    )}
                    <div className="form-text">URL untuk menerima callback dari sistem</div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">IP Whitelist</label>
                    <textarea
                      className={`form-control ${errors.ipWhitelist ? 'is-invalid' : ''}`}
                      placeholder="192.168.1.1&#10;10.0.0.1&#10;172.16.0.1"
                      rows={3}
                      {...register('ipWhitelist')}
                    />
                    {errors.ipWhitelist && (
                      <div className="invalid-feedback">{errors.ipWhitelist.message}</div>
                    )}
                    <div className="form-text">Masukkan satu IP address per baris</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex justify-content-end gap-3 pt-4 border-top">
                <button 
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => router.push(`/tenant-management/${tenantId}`)}
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
                  {updating ? 'Memperbarui...' : 'Update Tenant'}
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