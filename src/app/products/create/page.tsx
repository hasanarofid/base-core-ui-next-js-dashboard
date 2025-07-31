'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Package, Save, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { CreateProductData } from '@/types/product';

const createProductSchema = z.object({
  name: z.string().min(1, 'Nama produk harus diisi'),
  description: z.string().min(1, 'Deskripsi harus diisi'),
  price: z.number().min(0, 'Harga harus lebih dari 0'),
  category: z.string().min(1, 'Kategori harus dipilih'),
  stock: z.number().min(0, 'Stok harus lebih dari atau sama dengan 0'),
  status: z.enum(['active', 'inactive'])
});

type CreateProductFormData = z.infer<typeof createProductSchema>;

const categories = [
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Fashion', label: 'Fashion' },
  { value: 'Home & Garden', label: 'Home & Garden' },
  { value: 'Sports', label: 'Sports' },
  { value: 'Books', label: 'Books' },
  { value: 'Health & Beauty', label: 'Health & Beauty' }
];

const statusOptions = [
  { value: 'active', label: 'Aktif' },
  { value: 'inactive', label: 'Tidak Aktif' }
];

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      status: 'active'
    }
  });

  const onSubmit = async (data: CreateProductFormData) => {
    setLoading(true);
    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Product data:', data);
      
      // Redirect ke halaman list
      router.push('/products');
    } catch (error) {
      console.error('Error creating product:', error);
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
            <Package className="w-6 h-6 text-primary" />
            Tambah Produk Baru
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Isi informasi produk yang akan ditambahkan
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            {/* Basic Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Informasi Dasar
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="Nama Produk"
                    placeholder="Masukkan nama produk"
                    error={errors.name?.message}
                    {...register('name')}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Input
                    label="Deskripsi"
                    placeholder="Masukkan deskripsi produk"
                    error={errors.description?.message}
                    {...register('description')}
                  />
                </div>

                <div>
                  <Input
                    label="Harga (Rp)"
                    type="number"
                    placeholder="0"
                    error={errors.price?.message}
                    {...register('price', { valueAsNumber: true })}
                  />
                </div>

                <div>
                  <Input
                    label="Stok"
                    type="number"
                    placeholder="0"
                    error={errors.stock?.message}
                    {...register('stock', { valueAsNumber: true })}
                  />
                </div>

                <div>
                  <Select
                    label="Kategori"
                    placeholder="Pilih kategori"
                    options={categories}
                    error={errors.category?.message}
                    onChange={(value) => setValue('category', value)}
                  />
                </div>

                <div>
                  <Select
                    label="Status"
                    placeholder="Pilih status"
                    options={statusOptions}
                    error={errors.status?.message}
                    onChange={(value) => setValue('status', value as 'active' | 'inactive')}
                    value={watch('status')}
                  />
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
              variant="primary"
              disabled={loading}
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Menyimpan...' : 'Simpan Produk'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 