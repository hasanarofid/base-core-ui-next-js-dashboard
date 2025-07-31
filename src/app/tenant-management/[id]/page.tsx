'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Badge from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, Edit, Calendar, Mail, Phone, Globe, User, Building, Download } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

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
  const { showToast } = useToast();
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
        return 'default';
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
            <Button 
              variant="outline" 
              onClick={() => router.push('/tenant-management')}
              className="mt-3"
            >
              Kembali ke Daftar Tenant
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container-xxl flex-grow-1 container-p-y">
        {/* Header */}
        <div className="page-header d-print-none">
          <div className="container-xl">
            <div className="row g-2 align-items-center">
              <div className="col">
                <div className="page-pretitle">
                  Tenant Management
                </div>
                <h2 className="page-title d-flex align-items-center gap-2">
                  <Building className="w-5 h-5" />
                  Detail Tenant
                </h2>
              </div>
              <div className="col-auto ms-auto d-print-none">
                <div className="d-flex gap-2">
                  <button className="btn btn-outline-primary d-flex align-items-center gap-2 px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 border-2 hover:border-brand-blue-3">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali</span>
                  </button>
                  <button 
                    className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 bg-gradient-to-r from-brand-blue-3 to-brand-blue-4 hover:from-brand-blue-4 hover:to-brand-blue-5"
                    onClick={() => router.push(`/tenant-management/${tenantId}/edit`)}
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Tenant</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tenant Information */}
        <div className="row g-5">
          <div className="col-lg-7">
            <Card className="mb-4">
              <div className="card-header d-flex align-items-center justify-content-between">
                <div>
                  <h4 className="card-title mb-1">Informasi Tenant</h4>
                  <p className="card-subtitle text-muted mb-0">Data lengkap tenant dalam sistem</p>
                </div>
                <Badge 
                  variant={getStatusBadgeVariant(tenant.status)}
                  className="text-sm px-4 py-2 font-semibold rounded-full shadow-sm border-0"
                >
                  {getStatusText(tenant.status)}
                </Badge>
              </div>
              <div className="card-body">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-5 p-4 bg-light rounded-lg">
                      <div className="w-14 h-14 rounded-lg bg-primary bg-opacity-10 d-flex align-items-center justify-content-center flex-shrink-0">
                        <User className="w-7 h-7 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-muted mb-2 fw-medium">Nama Tenant</p>
                        <h6 className="mb-0 text-truncate fw-bold">{tenant.name}</h6>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-5 p-4 bg-light rounded-lg">
                      <div className="w-14 h-14 rounded-lg bg-success bg-opacity-10 d-flex align-items-center justify-content-center flex-shrink-0">
                        <Globe className="w-7 h-7 text-success" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-muted mb-2 fw-medium">Domain</p>
                        <h6 className="mb-0 text-truncate fw-bold">{tenant.domain}</h6>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-5 p-4 bg-light rounded-lg">
                      <div className="w-14 h-14 rounded-lg bg-info bg-opacity-10 d-flex align-items-center justify-content-center flex-shrink-0">
                        <Mail className="w-7 h-7 text-info" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-muted mb-2 fw-medium">Email</p>
                        <h6 className="mb-0 text-truncate fw-bold">{tenant.email}</h6>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-5 p-4 bg-light rounded-lg">
                      <div className="w-14 h-14 rounded-lg bg-warning bg-opacity-10 d-flex align-items-center justify-content-center flex-shrink-0">
                        <Phone className="w-7 h-7 text-warning" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-muted mb-2 fw-medium">Kontak Person</p>
                        <h6 className="mb-0 text-truncate fw-bold">{tenant.contact_person}</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Client Information */}
            <Card>
              <div className="card-header">
                <h4 className="card-title mb-1">Informasi Client</h4>
                <p className="card-subtitle text-muted mb-0">Kredensial untuk integrasi API</p>
              </div>
              <div className="card-body">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="p-4 bg-light rounded-lg">
                      <p className="text-muted mb-3 fw-medium">Client ID</p>
                      <code className="bg-white p-3 rounded d-block text-break fw-bold fs-6 border">{tenant.client_id || 'Tidak tersedia'}</code>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-4 bg-light rounded-lg">
                      <p className="text-muted mb-3 fw-medium">Client Key</p>
                      <code className="bg-white p-3 rounded d-block text-break fw-bold fs-6 border">
                        {tenant.client_key ? `${tenant.client_key.substring(0, 8)}...` : 'Tidak tersedia'}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="col-lg-5">
            {/* Activity Information */}
            <Card className="mb-4">
              <div className="card-header">
                <h4 className="card-title mb-1">Aktivitas</h4>
                <p className="card-subtitle text-muted mb-0">Riwayat aktivitas tenant</p>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center gap-5 p-4 bg-light rounded-lg mb-4">
                  <div className="w-14 h-14 rounded-lg bg-secondary bg-opacity-10 d-flex align-items-center justify-content-center flex-shrink-0">
                    <Calendar className="w-7 h-7 text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-muted mb-2 fw-medium">Login Terakhir</p>
                    <h6 className="mb-0 fw-bold">
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
                <div className="d-flex align-items-center gap-5 p-4 bg-light rounded-lg">
                  <div className="w-14 h-14 rounded-lg bg-primary bg-opacity-10 d-flex align-items-center justify-content-center flex-shrink-0">
                    <Calendar className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-muted mb-2 fw-medium">Tanggal Pendaftaran</p>
                    <h6 className="mb-0 fw-bold">
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
            </Card>

            {/* Logo Preview */}
            {tenant.logo_url && (
              <Card>
                <div className="card-header">
                  <h4 className="card-title mb-1">Logo Tenant</h4>
                  <p className="card-subtitle text-muted mb-0">Preview logo tenant</p>
                </div>
                <div className="card-body text-center p-4">
                  <img 
                    src={tenant.logo_url} 
                    alt={`Logo ${tenant.name}`}
                    className="img-fluid rounded shadow-sm"
                    style={{ maxHeight: '250px', maxWidth: '100%' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 