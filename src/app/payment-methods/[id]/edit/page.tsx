'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, CreditCard } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { getPaymentMethodByIdWithCookies, updatePaymentMethodWithCookies } from '@/lib/api';
import { PaymentMethod } from '@/types/paymentMethod';

const updatePaymentMethodSchema = z.object({
  name: z.string().min(1, 'Nama metode pembayaran harus diisi'),
  code: z.string().min(1, 'Kode harus diisi'),
  type: z.string().optional().or(z.literal('')),
  status: z.enum(['active', 'pending', 'suspended'])
});

type UpdatePaymentMethodFormData = z.infer<typeof updatePaymentMethodSchema>;

const statusOptions = [
  { value: 'active', label: 'Aktif' },
  { value: 'pending', label: 'Menunggu' },
  { value: 'suspended', label: 'Ditangguhkan' }
];

export default function EditPaymentMethodPage() {
  const router = useRouter();
  const params = useParams();
  const paymentMethodId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<UpdatePaymentMethodFormData>({
    resolver: zodResolver(updatePaymentMethodSchema)
  });

  useEffect(() => {
    const fetchMethod = async () => {
      try {
        const response = await getPaymentMethodByIdWithCookies(paymentMethodId);
        setMethod(response.data);
        reset({
          name: response.data.name,
          code: response.data.code,
          type: response.data.type || '',
          status: response.data.status as 'active' | 'pending' | 'suspended'
        });
      } catch (error) {
        console.error('Failed to fetch payment method:', error);
        router.push('/payment-methods');
      } finally {
        setInitialLoading(false);
      }
    };

    if (paymentMethodId) fetchMethod();
  }, [paymentMethodId, router, reset]);

  const onSubmit = async (data: UpdatePaymentMethodFormData) => {
    setLoading(true);
    try {
      await updatePaymentMethodWithCookies(paymentMethodId, data);
      router.push('/payment-methods');
    } catch (error) {
      console.error('Error updating method:', error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-gray-500">Memuat data metode...</span>
        </div>
      </div>
    );
  }

  if (!method) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <p className="text-gray-500">Metode pembayaran tidak ditemukan</p>
          <Button onClick={() => router.push('/payment-methods')} className="mt-4">
            Kembali ke Daftar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-primary" />
            Edit Metode Pembayaran
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Edit informasi metode pembayaran: {method.name}
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nama Metode"
                placeholder="Masukkan nama metode"
                error={errors.name?.message}
                {...register('name')}
              />
              <Input
                label="Kode"
                placeholder="Masukkan kode"
                error={errors.code?.message}
                {...register('code')}
              />
              <Input
                label="Tipe (opsional)"
                placeholder="Masukkan tipe"
                error={errors.type?.message}
                {...register('type')}
              />
              <Select
                label="Status"
                placeholder="Pilih status"
                options={statusOptions}
                error={errors.status?.message}
                onChange={(val) => setValue('status', val as 'active' | 'pending' | 'suspended')}
                value={watch('status')}
              />
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Informasi Sistem</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">ID:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100">{method.id}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Dibuat:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100">
                    {new Date(method.createdAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Terakhir Diupdate:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100">
                    {new Date(method.updatedAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Batal
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              <Save className="w-4 h-4" />
              <span>{loading ? 'Memperbarui...' : 'Update Metode'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}