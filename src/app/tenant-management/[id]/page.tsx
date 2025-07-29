'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Edit, Building, User, Mail, Phone, Calendar, CreditCard, Activity, Clock } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Tenant } from '@/types/tenant';

// Mock data untuk demo
const mockTenants: Tenant[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    company: 'Tech Solutions Inc.',
    phone: '+62 812-3456-7890',
    status: 'active',
    plan: 'premium',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    lastLogin: '2024-01-20T14:30:00Z',
    subscriptionEnd: '2024-12-31T23:59:59Z'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@startup.co.id',
    company: 'Startup Indonesia',
    phone: '+62 821-9876-5432',
    status: 'pending',
    plan: 'basic',
    createdAt: '2024-01-18T09:15:00Z',
    updatedAt: '2024-01-18T09:15:00Z'
  },
  {
    id: '3',
    name: 'Ahmad Rahman',
    email: 'ahmad@enterprise.id',
    company: 'Enterprise Solutions',
    phone: '+62 813-4567-8901',
    status: 'active',
    plan: 'enterprise',
    createdAt: '2024-01-10T14:20:00Z',
    updatedAt: '2024-01-10T14:20:00Z',
    lastLogin: '2024-01-19T16:45:00Z',
    subscriptionEnd: '2025-06-30T23:59:59Z'
  }
];

export default function TenantDetailPage() {
  const router = useRouter();
  const params = useParams();
  const tenantId = params.id as string;
  
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        // Simulasi API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const foundTenant = mockTenants.find(t => t.id === tenantId);
        if (foundTenant) {
          setTenant(foundTenant);
        }
      } catch (error) {
        console.error('Error fetching tenant:', error);
      } finally {
        setLoading(false);
      }
    };

    if (tenantId) {
      fetchTenant();
    }
  }, [tenantId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-gray-500">Memuat data tenant...</span>
        </div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Tenant Tidak Ditemukan
          </h2>
          <p className="text-gray-500 mb-4">
            Tenant yang Anda cari tidak ditemukan atau telah dihapus.
          </p>
          <Button onClick={() => router.push('/tenant-management')}>
            Kembali ke Daftar Tenant
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'suspended': return 'danger';
      case 'inactive': return 'default';
      default: return 'default';
    }
  };

  const getPlanBadgeVariant = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'primary';
      case 'premium': return 'info';
      case 'basic': return 'default';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'pending': return 'Menunggu';
      case 'suspended': return 'Ditangguhkan';
      case 'inactive': return 'Tidak Aktif';
      default: return status;
    }
  };

  const getPlanText = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'Enterprise';
      case 'premium': return 'Premium';
      case 'basic': return 'Basic';
      default: return plan;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Building className="w-6 h-6 text-primary" />
              Detail Tenant
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Informasi lengkap tenant
            </p>
          </div>
        </div>
        <Button
          onClick={() => router.push(`/tenant-management/${tenant.id}/edit`)}
          className="flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Edit Tenant
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tenant Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {tenant.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {tenant.company}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge 
                  variant={getStatusBadgeVariant(tenant.status)}
                  className="text-xs"
                >
                  {getStatusText(tenant.status)}
                </Badge>
                <Badge 
                  variant={getPlanBadgeVariant(tenant.plan)}
                  className="text-xs"
                >
                  {getPlanText(tenant.plan)}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{tenant.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Telepon</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{tenant.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <p className={`font-medium ${tenant.status === 'active' ? 'text-green-600' : tenant.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>
                    {getStatusText(tenant.status)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Plan</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{getPlanText(tenant.plan)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Informasi Aktivitas
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tanggal Daftar</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {new Date(tenant.createdAt).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Terakhir Diupdate</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {new Date(tenant.updatedAt).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {tenant.lastLogin && (
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Login Terakhir</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {new Date(tenant.lastLogin).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              )}

              {tenant.subscriptionEnd && (
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Berakhir Langganan</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {new Date(tenant.subscriptionEnd).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tenant ID Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Informasi Sistem
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">ID Tenant</p>
                <p className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded mt-1">
                  {tenant.id}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Aksi Cepat
            </h3>
            <div className="space-y-3">
              <Button
                onClick={() => router.push(`/tenant-management/${tenant.id}/edit`)}
                className="w-full justify-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Tenant
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/tenant-management')}
                className="w-full justify-center"
              >
                Kembali ke Daftar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 