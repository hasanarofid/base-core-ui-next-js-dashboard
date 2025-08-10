'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';

import { useToast } from '@/contexts/ToastContext';
import Image from 'next/image';

interface Tenant {
  id: string;
  name: string;
  logo_url: string;
  domain: string;
  email: string;
  contact_person: string;
  status: string;
  client_id?: string;
  client_key?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export default function TenantViewPage() {
  const router = useRouter();
  const params = useParams();

  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tenantId = params.id as string;

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/tenants/${tenantId}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Gagal mengambil data tenant');
        }
        
        setTenant(data.data || data); // Handle both response formats
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Terjadi kesalahan yang tidak diketahui');
        }
      } finally {
        setLoading(false);
      }
    };

    if (tenantId) {
      fetchTenant();
    }
  }, [tenantId]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'suspended':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'pending':
        return 'Menunggu';
      case 'suspended':
        return 'Ditangguhkan';
      default:
        return 'Tidak Aktif';
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

  if (error || !tenant) {
    return (
      <DashboardLayout>
        <div className="container-xxl flex-grow-1 container-p-y">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error!</h4>
            <p>{error || 'Tenant tidak ditemukan'}</p>
            <button 
              className="btn btn-outline-primary mt-3"
              onClick={() => router.push('/tenant-management')}
            >
              Kembali ke Daftar Tenant
            </button>
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
            <div className="page-header d-print-none">
              <div className="container-xl">
                <div className="row g-2 align-items-center">
                  <div className="col">
                    <div className="page-pretitle">
                      Tenant Management
                    </div>
                    <h2 className="page-title">
                      Detail Tenant
                    </h2>
                  </div>
                  <div className="col-auto ms-auto d-print-none">
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-outline-primary"
                        onClick={() => router.push('/tenant-management')}
                      >
                        <i className="ti ti-arrow-left me-1"></i>
                        Kembali
                      </button>
                      <button 
                        className="btn btn-primary"
                        onClick={() => router.push(`/tenant-management/${tenantId}/edit`)}
                      >
                        <i className="ti ti-edit me-1"></i>
                        Edit Tenant
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tenant Information */}
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="card mb-4">
              <div className="card-header d-flex align-items-center justify-content-between">
                <div>
                  <h5 className="card-title mb-1">Informasi Tenant</h5>
                  <p className="card-subtitle text-muted mb-0">Data lengkap tenant dalam sistem</p>
                </div>
                <span className={`badge bg-label-${getStatusBadgeVariant(tenant.status)} rounded-pill`}>
                  {getStatusText(tenant.status)}
                </span>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-3 p-3 bg-light rounded">
                      <div className="flex-shrink-0">
                        <div className="avatar avatar-md bg-label-primary rounded">
                          <i className="ti ti-user"></i>
                        </div>
                      </div>
                      <div className="flex-grow-1 min-w-0">
                        <p className="text-muted mb-1 small fw-medium">Nama Tenant</p>
                        <h6 className="mb-0 text-truncate fw-semibold">{tenant.name}</h6>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-3 p-3 bg-light rounded">
                      <div className="flex-shrink-0">
                        <div className="avatar avatar-md bg-label-success rounded">
                          <i className="ti ti-world"></i>
                        </div>
                      </div>
                      <div className="flex-grow-1 min-w-0">
                        <p className="text-muted mb-1 small fw-medium">Domain</p>
                        <h6 className="mb-0 text-truncate fw-semibold">{tenant.domain}</h6>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-3 p-3 bg-light rounded">
                      <div className="flex-shrink-0">
                        <div className="avatar avatar-md bg-label-info rounded">
                          <i className="ti ti-mail"></i>
                        </div>
                      </div>
                      <div className="flex-grow-1 min-w-0">
                        <p className="text-muted mb-1 small fw-medium">Email</p>
                        <h6 className="mb-0 text-truncate fw-semibold">{tenant.email}</h6>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-3 p-3 bg-light rounded">
                      <div className="flex-shrink-0">
                        <div className="avatar avatar-md bg-label-warning rounded">
                          <i className="ti ti-phone"></i>
                        </div>
                      </div>
                      <div className="flex-grow-1 min-w-0">
                        <p className="text-muted mb-1 small fw-medium">Kontak Person</p>
                        <h6 className="mb-0 text-truncate fw-semibold">{tenant.contact_person}</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Information */}
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-1">Informasi Client</h5>
                <p className="card-subtitle text-muted mb-0">Kredensial untuk integrasi API</p>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded">
                      <p className="text-muted mb-2 small fw-medium">Client ID</p>
                      <code className="bg-white p-2 rounded d-block text-break fw-semibold small border">{tenant.client_id || 'Tidak tersedia'}</code>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded">
                      <p className="text-muted mb-2 small fw-medium">Client Key</p>
                      <code className="bg-white p-2 rounded d-block text-break fw-semibold small border">
                        {tenant.client_key ? `${tenant.client_key.substring(0, 8)}...` : 'Tidak tersedia'}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            {/* Activity Information */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title mb-1">Aktivitas</h5>
                <p className="card-subtitle text-muted mb-0">Riwayat aktivitas tenant</p>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center gap-3 p-3 bg-light rounded mb-3">
                  <div className="flex-shrink-0">
                    <div className="avatar avatar-md bg-label-secondary rounded">
                      <i className="ti ti-calendar"></i>
                    </div>
                  </div>
                  <div className="flex-grow-1 min-w-0">
                    <p className="text-muted mb-1 small">Login Terakhir</p>
                    <h6 className="mb-0 fw-semibold">
                      {tenant.lastLogin 
                        ? new Date(tenant.lastLogin).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'Belum pernah login'
                      }
                    </h6>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3 p-3 bg-light rounded">
                  <div className="flex-shrink-0">
                    <div className="avatar avatar-md bg-label-primary rounded">
                      <i className="ti ti-calendar"></i>
                    </div>
                  </div>
                  <div className="flex-grow-1 min-w-0">
                    <p className="text-muted mb-1 small">Tanggal Pendaftaran</p>
                    <h6 className="mb-0 fw-semibold">
                      {new Date(tenant.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </h6>
                  </div>
                </div>
              </div>
            </div>

            {/* Logo Preview */}
            {tenant.logo_url && (
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-1">Logo Tenant</h5>
                  <p className="card-subtitle text-muted mb-0">Preview logo tenant</p>
                </div>
                <div className="card-body text-center p-4">
                  <Image 
                    src={tenant.logo_url} 
                    alt={`Logo ${tenant.name}`}
                    width={300}
                    height={250}
                    className="rounded shadow-sm"
                    style={{ maxHeight: '250px', maxWidth: '100%' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                    unoptimized={true}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 