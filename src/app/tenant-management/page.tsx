'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout'
import AuthGuard from '@/components/auth/AuthGuard'
import { Building, Plus, User, Mail, Phone, Calendar, CreditCard } from 'lucide-react'
import Button from '@/components/ui/Button';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Tenant } from '@/types/tenant';
import Badge from '@/components/ui/Badge';

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
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah@digitalagency.com',
    company: 'Digital Agency Pro',
    phone: '+62 814-5678-9012',
    status: 'suspended',
    plan: 'premium',
    createdAt: '2024-01-05T11:45:00Z',
    updatedAt: '2024-01-19T10:30:00Z',
    lastLogin: '2024-01-15T09:20:00Z',
    subscriptionEnd: '2024-11-30T23:59:59Z'
  },
  {
    id: '5',
    name: 'Michael Chen',
    email: 'michael@techstartup.id',
    company: 'Tech Startup Indonesia',
    phone: '+62 815-6789-0123',
    status: 'inactive',
    plan: 'basic',
    createdAt: '2023-12-20T08:30:00Z',
    updatedAt: '2024-01-10T15:20:00Z',
    lastLogin: '2024-01-05T12:10:00Z',
    subscriptionEnd: '2024-01-31T23:59:59Z'
  }
];

export default function TenantManagementPage() {
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>(mockTenants);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.phone.includes(searchTerm)
  );

  const paginatedTenants = filteredTenants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredTenants.length / itemsPerPage);

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1);
  };

  const handleEdit = (tenant: Tenant) => {
    router.push(`/tenant-management/${tenant.id}/edit`);
  };

  const handleDelete = (tenant: Tenant) => {
    if (confirm(`Apakah Anda yakin ingin menghapus tenant "${tenant.name}"?`)) {
      setTenants(tenants.filter(t => t.id !== tenant.id));
    }
  };

  const handleView = (tenant: Tenant) => {
    router.push(`/tenant-management/${tenant.id}`);
  };

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

  const columns: Column<Tenant>[] = [
    {
      key: 'name',
      header: 'Tenant',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-gray-100">{row.name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{row.company}</div>
        </div>
      )
    },
    {
      key: 'email',
      header: 'Kontak',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="flex items-center gap-1 text-sm">
            <Mail className="w-3 h-3 text-gray-400" />
            <span className="text-gray-900 dark:text-gray-100">{row.email}</span>
          </div>
          <div className="flex items-center gap-1 text-sm mt-1">
            <Phone className="w-3 h-3 text-gray-400" />
            <span className="text-gray-500 dark:text-gray-400">{row.phone}</span>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (value) => (
        <Badge 
          variant={getStatusBadgeVariant(value)}
          className="text-xs"
        >
          {getStatusText(value)}
        </Badge>
      )
    },
    {
      key: 'plan',
      header: 'Plan',
      sortable: true,
      render: (value) => (
        <Badge 
          variant={getPlanBadgeVariant(value)}
          className="text-xs"
        >
          {getPlanText(value)}
        </Badge>
      )
    },
    {
      key: 'lastLogin',
      header: 'Login Terakhir',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-gray-400" />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {value ? new Date(value).toLocaleDateString('id-ID') : 'Belum login'}
          </span>
        </div>
      )
    },
    {
      key: 'createdAt',
      header: 'Tanggal Daftar',
      sortable: true,
      render: (value) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(value).toLocaleDateString('id-ID')}
        </span>
      )
    }
  ];

  return (
    <AuthGuard requireAuth={true}>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Building className="w-6 h-6 text-primary" />
                Tenant Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Kelola tenant, approve, suspend, dan update tenant
              </p>
            </div>
            <Button
              onClick={() => router.push('/tenant-management/create')}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Tambah Tenant
            </Button>
          </div>

          {/* DataTable */}
          <DataTable
            data={paginatedTenants}
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
              totalItems: filteredTenants.length,
              itemsPerPage,
              onPageChange: setCurrentPage
            }}
            className="bg-white dark:bg-gray-800"
          />
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
} 