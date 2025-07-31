'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Edit, Package, Calendar, Tag, DollarSign, Box, Activity } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Product } from '@/types/product';

// Mock data untuk demo
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Laptop Asus ROG',
    description: 'Gaming laptop dengan performa tinggi yang dirancang untuk para gamer dan content creator. Dilengkapi dengan processor Intel Core i7, GPU RTX 4060, dan RAM 16GB DDR5.',
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
    description: 'Smartphone premium dengan kamera terbaik dan chip A17 Pro yang powerful. Dilengkapi dengan titanium design dan kamera 48MP.',
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
    description: 'Sepatu olahraga dengan teknologi Air Max yang memberikan kenyamanan maksimal saat berolahraga.',
    price: 2500000,
    category: 'Fashion',
    stock: 50,
    status: 'active',
    createdAt: '2024-01-13T14:20:00Z',
    updatedAt: '2024-01-13T14:20:00Z'
  }
];

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Simulasi API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const foundProduct = mockProducts.find(p => p.id === productId);
        if (foundProduct) {
          setProduct(foundProduct);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
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
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Produk Tidak Ditemukan
          </h2>
          <p className="text-gray-500 mb-4">
            Produk yang Anda cari tidak ditemukan atau telah dihapus.
          </p>
          <Button onClick={() => router.push('/products')}>
            Kembali ke Daftar Produk
          </Button>
        </div>
      </div>
    );
  }

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
              <Package className="w-6 h-6 text-primary" />
              Detail Produk
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Informasi lengkap produk
            </p>
          </div>
        </div>
        <Button
          onClick={() => router.push(`/products/${product.id}/edit`)}
          className="flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Edit Produk
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {product.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {product.description}
                </p>
              </div>
              <Badge 
                variant={product.status === 'active' ? 'success' : 'danger'}
                className="ml-4"
              >
                {product.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Tag className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Kategori</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{product.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Harga</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Rp {product.price.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Box className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Stok</p>
                  <p className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock} unit
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status Stok</p>
                  <p className={`font-medium ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {product.stock > 10 ? 'Tersedia' : product.stock > 0 ? 'Terbatas' : 'Habis'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Informasi Tambahan
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tanggal Dibuat</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {new Date(product.createdAt).toLocaleDateString('id-ID', {
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
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Terakhir Diupdate</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {new Date(product.updatedAt).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Product ID Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Informasi Sistem
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">ID Produk</p>
                <p className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded mt-1">
                  {product.id}
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
                onClick={() => router.push(`/products/${product.id}/edit`)}
                className="w-full justify-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Produk
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/products')}
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