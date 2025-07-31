'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Plus } from 'lucide-react'
import { DataTable, Column } from '@/components/ui/DataTable';
import { Product } from '@/types/product';
import Badge from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

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
  },
  {
    id: '4',
    name: 'Samsung Galaxy S24',
    description: 'Smartphone Android terbaru',
    price: 12000000,
    category: 'Electronics',
    stock: 0,
    status: 'inactive',
    createdAt: '2024-01-12T11:45:00Z',
    updatedAt: '2024-01-12T11:45:00Z'
  },
  {
    id: '5',
    name: 'Adidas Ultraboost',
    description: 'Sepatu lari dengan teknologi Boost',
    price: 3200000,
    category: 'Fashion',
    stock: 30,
    status: 'active',
    createdAt: '2024-01-11T16:30:00Z',
    updatedAt: '2024-01-11T16:30:00Z'
  }
];

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1);
  };

  const handleEdit = (product: Product) => {
    router.push(`/products/${product.id}/edit`);
  };

  const handleDelete = (product: Product) => {
    if (confirm(`Apakah Anda yakin ingin menghapus produk "${product.name}"?`)) {
      setProducts(products.filter(p => p.id !== product.id));
    }
  };

  const handleView = (product: Product) => {
    router.push(`/products/${product.id}`);
  };

  const columns: Column<Product>[] = [
    {
      key: 'name',
      header: 'Nama Produk',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-blue-3 to-brand-blue-4 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
              {String(value)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{row.description}</div>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Kategori',
      sortable: true,
      render: (value) => (
        <Badge variant="default" className="text-xs">
          {String(value)}
        </Badge>
      )
    },
    {
      key: 'price',
      header: 'Harga',
      sortable: true,
      render: (value) => (
        <span className="font-medium text-gray-900 dark:text-gray-100">
          Rp {Number(value).toLocaleString('id-ID')}
        </span>
      )
    },
    {
      key: 'stock',
      header: 'Stok',
      sortable: true,
      render: (value) => (
        <span className={`font-medium ${Number(value) > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {String(value)}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (value) => (
        <Badge 
          variant={String(value) === 'active' ? 'success' : 'danger'}
          className="text-xs"
        >
          {String(value) === 'active' ? 'Aktif' : 'Tidak Aktif'}
        </Badge>
      )
    },
    {
      key: 'createdAt',
      header: 'Tanggal Dibuat',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(String(value)).toLocaleDateString('id-ID')}
        </span>
      )
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Package className="w-6 h-6 text-primary" />
            Manajemen Produk
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Kelola data produk dengan mudah
          </p>
        </div>
        <Button
          onClick={() => router.push('/products/create')}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Produk
        </Button>
      </div>

      {/* DataTable */}
      <DataTable
        data={paginatedProducts}
        columns={columns}
        loading={loading}
        searchable={true}
        filterable={true}
        onSearch={handleSearch}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        pagination={{
          currentPage,
          totalPages,
          totalItems: filteredProducts.length,
          itemsPerPage,
          onPageChange: setCurrentPage
        }}
        className="bg-white dark:bg-gray-800"
      />
    </div>
  );
} 