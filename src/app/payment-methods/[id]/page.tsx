'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Edit, Building } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { PaymentMethod } from '@/types/paymentMethod';
import { getPaymentMethodByIdWithCookies } from '@/lib/api';

export default function PaymentMethodDetailPage() {
  const router = useRouter();
  const params = useParams();
  const methodId = params.id as string;

  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMethod = async () => {
      try {
        console.log('Fetching method with ID:', methodId);
        const response = await getPaymentMethodByIdWithCookies(methodId); // ✅ gunakan API baru
        setMethod(response.data); // pastikan `.data` sesuai struktur return
      } catch (error) {
        console.error('Error fetching method:', error);
      } finally {
        setLoading(false);
      }
    };

    if (methodId) {
      fetchMethod();
    }
  }, [methodId]);

  if (loading) {
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
      <div className="container mx-auto px-4 py-6 text-center">
        <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">Metode Tidak Ditemukan</h2>
        <p className="text-gray-500 mb-4">Data metode pembayaran tidak tersedia atau telah dihapus.</p>
        <Button onClick={() => router.push('/payment-methods')}>Kembali ke Daftar</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Building className="w-6 h-6 text-primary" />
              Detail Metode Pembayaran
            </h1>
            <p className="text-gray-600 mt-1">Informasi lengkap metode pembayaran</p>
          </div>
        </div>
        <Button onClick={() => router.push(`/payment-methods/${method.id}/edit`)} className="flex items-center gap-2">
          <Edit className="w-4 h-4" />
          Edit
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {method.logo_url && <img src={method.logo_url} alt={method.name} className="w-6 h-6 rounded" />}
            <div>
              <h2 className="text-xl font-semibold">{method.name}</h2>
              <p className="text-sm text-gray-600">{method.code}</p>
            </div>
          </div>
          <Badge variant={
            method.status === 'active'
              ? 'success'
              : method.status === 'suspended'
              ? 'danger'
              : 'warning'
          }>
            {method.status === 'active'
              ? 'Aktif'
              : method.status === 'suspended'
              ? 'Ditangguhkan'
              : 'Menunggu'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Tipe</p>
            <p className="font-medium text-gray-900">{method.type || '-'}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Tanggal Dibuat</p>
            <p className="font-medium text-gray-900">
              {new Date(method.createdAt).toLocaleDateString('id-ID', {
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Terakhir Diupdate</p>
            <p className="font-medium text-gray-900">
              {new Date(method.updatedAt).toLocaleDateString('id-ID', {
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">ID Metode</p>
            <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded mt-1">{method.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
