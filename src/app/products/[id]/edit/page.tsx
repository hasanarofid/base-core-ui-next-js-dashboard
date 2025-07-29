'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Package } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Product, UpdateProductData } from '@/types/product';

const updateProductSchema = z.object({
  name: z.string().min(1, 'Nama produk harus diisi'),
  description: z.string().min(1, 'Deskripsi harus diisi'),
  price: z.number().min(0, 'Harga harus lebih dari 0'),
  category: z.string().min(1, 'Kategori harus dipilih'),
  stock: z.number().min(0, 'Stok harus lebih dari atau sama dengan 0'),
  status: z.enum(['active', 'inactive'])
});

type UpdateProductFormData = z.infer<typeof updateProductSchema>;

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

// Mock data untuk demo
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Laptop Asus ROG',
    description: 'Gaming laptop dengan performa tinggi',
    price: 15000000,
    category: 'Electronics',
    stock: 25,
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'iPhone 15 Pro',
    description: 'Smartphone premium dengan kamera terbaik',
    price: 18000000,
    category: 'Electronics',
    stock: 15,
    status: 'active',
    createdAt: '2024-01-14T09:15:00Z',
    updatedAt: '2024-01-14T09:15:00Z'
  },
  {
    id: '3',
    name: 'Nike Air Max',
    description: 'Sepatu olahraga dengan teknologi Air Max',
    price: 2500000,
    category: 'Fashion',
    stock: 50,
    status: 'active',
    createdAt: '2024-01-13T14:20:00Z',
    updatedAt: '2024-01-13T14:20:00Z'
  }
];

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<UpdateProductFormData>({
    resolver: zodResolver(updateProductSchema)
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Simulasi API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const foundProduct = mockProducts.find(p => p.id === productId);
        if (foundProduct) {
          setProduct(foundProduct);
          reset({
            name: foundProduct.name,
            description: foundProduct.description,
            price: foundProduct.price,
            category: foundProduct.category,
            stock: foundProduct.stock,
            status: foundProduct.status
          });
        } else {
          // Product not found, redirect to list
          router.push('/products');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        router.push('/products');
      } finally {
        setInitialLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, router, reset]);

  const onSubmit = async (data: UpdateProductFormData) => {
    setLoading(true);
    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Updated product data:', { id: productId, ...data });
      
      // Redirect ke halaman list
      router.push('/products');
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-gray-500">Memuat data produk...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <p className="text-gray-500">Produk tidak ditemukan</p>
          <Button onClick={() => router.push('/products')} className="mt-4">
            Kembali ke Daftar Produk
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
            <Package className="w-6 h-6 text-primary" />
            Edit Produk
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Edit informasi produk: {product.name}
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
                    value={watch('category')}
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

            {/* Product Info */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Informasi Sistem
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">ID Produk:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100">{product.id}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Dibuat:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100">
                    {new Date(product.createdAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Terakhir Diupdate:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100">
                    {new Date(product.updatedAt).toLocaleDateString('id-ID')}
                  </span>
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
              Update Produk
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 