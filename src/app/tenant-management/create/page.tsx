'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Building, User, Calendar, CreditCard } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import { CreateTenantData } from '@/types/tenant';

const createTenantSchema = z.object({
  name: z.string().min(1, 'Nama tenant harus diisi'),
  email: z.string().email('Email harus valid'),
  company: z.string().min(1, 'Nama perusahaan harus diisi'),
  phone: z.string().min(1, 'Nomor telepon harus diisi'),
  status: z.enum(['pending', 'active', 'suspended', 'inactive']),
  plan: z.enum(['basic', 'premium', 'enterprise'])
});

type CreateTenantFormData = z.infer<typeof createTenantSchema>;

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

export default function CreateTenantPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<CreateTenantFormData>({
    resolver: zodResolver(createTenantSchema),
    defaultValues: {
      status: 'pending',
      plan: 'basic'
    }
  });

  const onSubmit = async (data: CreateTenantFormData) => {
    setLoading(true);
    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Tenant data:', data);
      
      // Redirect ke halaman list
      router.push('/tenant-management');
    } catch (error) {
      console.error('Error creating tenant:', error);
    } finally {
      setLoading(false);
    }
  };

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
            Tambah Tenant Baru
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Isi informasi tenant yang akan ditambahkan
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

              {/* Plan Information */}
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Informasi Plan
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium text-gray-700 dark:text-gray-300">Basic</h5>
                    <p className="text-gray-500 dark:text-gray-400">Fitur dasar untuk startup</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-700 dark:text-gray-300">Premium</h5>
                    <p className="text-gray-500 dark:text-gray-400">Fitur lengkap untuk bisnis</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-700 dark:text-gray-300">Enterprise</h5>
                    <p className="text-gray-500 dark:text-gray-400">Fitur custom untuk enterprise</p>
                  </div>
                </div>
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
              Simpan Tenant
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 