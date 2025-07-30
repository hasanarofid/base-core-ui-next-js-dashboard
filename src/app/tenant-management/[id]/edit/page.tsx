'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Building, User, Calendar, CreditCard } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import { Tenant, UpdateTenantData } from '@/types/tenant';

const updateTenantSchema = z.object({
  name: z.string().min(1, 'Nama tenant harus diisi'),
  email: z.string().email('Email harus valid'),
  company: z.string().min(1, 'Nama perusahaan harus diisi'),
  phone: z.string().min(1, 'Nomor telepon harus diisi'),
  status: z.enum(['pending', 'active', 'suspended', 'inactive']),
  plan: z.enum(['basic', 'premium', 'enterprise'])
});

type UpdateTenantFormData = z.infer<typeof updateTenantSchema>;

const statusOptions = [
  { value: 'pending', label: 'Menunggu Approval' },
  { value: 'active', label: 'Aktif' },
  { value: 'suspended', label: 'Ditangguhkan' },
  { value: 'inactive', label: 'Tidak Aktif' }
];

const planOptions = [
  { value: 'basic', label: 'Basic Plan' },
  { value: 'premium', label: 'Premium Plan' },
  { value: 'enterprise', label: 'Enterprise Plan' }
];

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

export default function EditTenantPage() {
  const router = useRouter();
  const params = useParams();
  const tenantId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<UpdateTenantFormData>({
    resolver: zodResolver(updateTenantSchema)
  });

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        // Simulasi API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const foundTenant = mockTenants.find(t => t.id === tenantId);
        if (foundTenant) {
          setTenant(foundTenant);
          reset({
            name: foundTenant.name,
            email: foundTenant.email,
            company: foundTenant.company,
            phone: foundTenant.phone,
            status: foundTenant.status,
            plan: foundTenant.plan
          });
        } else {
          // Tenant not found, redirect to list
          router.push('/tenant-management');
        }
      } catch (error) {
        console.error('Error fetching tenant:', error);
        router.push('/tenant-management');
      } finally {
        setInitialLoading(false);
      }
    };

    if (tenantId) {
      fetchTenant();
    }
  }, [tenantId, router, reset]);

  const onSubmit = async (data: UpdateTenantFormData) => {
    setLoading(true);
    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Updated tenant data:', { id: tenantId, ...data });
      
      // Redirect ke halaman list
      router.push('/tenant-management');
    } catch (error) {
      console.error('Error updating tenant:', error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
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
          <p className="text-gray-500">Tenant tidak ditemukan</p>
          <Button onClick={() => router.push('/tenant-management')} className="mt-4">
            Kembali ke Daftar Tenant
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
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
            Edit Tenant
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Edit informasi tenant: {tenant.name}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            {/* Basic Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Informasi Dasar
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="Nama Tenant"
                    placeholder="Masukkan nama tenant"
                    error={errors.name?.message}
                    {...register('name')}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Input
                    label="Nama Perusahaan"
                    placeholder="Masukkan nama perusahaan"
                    error={errors.company?.message}
                    {...register('company')}
                  />
                </div>

                <div>
                  <Input
                    label="Email"
                    type="email"
                    placeholder="tenant@company.com"
                    error={errors.email?.message}
                    {...register('email')}
                  />
                </div>

                <div>
                  <Input
                    label="Nomor Telepon"
                    placeholder="+62 812-3456-7890"
                    error={errors.phone?.message}
                    {...register('phone')}
                  />
                </div>
              </div>
            </div>

            {/* Subscription Information */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Informasi Langganan
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Select
                    label="Status"
                    placeholder="Pilih status"
                    options={statusOptions}
                    error={errors.status?.message}
                    onChange={(value) => setValue('status', value as 'pending' | 'active' | 'suspended' | 'inactive')}
                    value={watch('status')}
                  />
                </div>

                <div>
                  <Select
                    label="Plan"
                    placeholder="Pilih plan"
                    options={planOptions}
                    error={errors.plan?.message}
                    onChange={(value) => setValue('plan', value as 'basic' | 'premium' | 'enterprise')}
                    value={watch('plan')}
                  />
                </div>
              </div>
            </div>

            {/* Tenant Info */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Informasi Sistem
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">ID Tenant:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100">{tenant.id}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Dibuat:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100">
                    {new Date(tenant.createdAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Terakhir Diupdate:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100">
                    {new Date(tenant.updatedAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
                {tenant.lastLogin && (
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Login Terakhir:</span>
                    <span className="ml-2 text-gray-900 dark:text-gray-100">
                      {new Date(tenant.lastLogin).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Batal
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Update Tenant
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 