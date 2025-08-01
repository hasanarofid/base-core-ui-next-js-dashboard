'use client';

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Search, Filter, Edit, Trash2, Eye, CheckCircle, Settings } from 'lucide-react';
import { Button } from './Button';
import Input from './Input';

export interface Column<T> {
  key: string;
  header: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
  };
  onSearch?: (search: string) => void;
  onFilter?: (filters: Record<string, unknown>) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  onApprove?: (item: T) => void;
  onStatusChange?: (item: T) => void;
  showApproveButton?: (item: T) => boolean;
  showStatusButton?: (item: T) => boolean;
  showDeleteButton?: (item: T) => boolean;
  actions?: boolean;
  className?: string;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  loading = false,
  searchable = true,
  filterable = true,
  pagination,
  onSearch,
  onEdit,
  onDelete,
  onView,
  onApprove,
  onStatusChange,
  showApproveButton,
  showStatusButton,
  showDeleteButton,
  actions = true,
  className = ''
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const handleSort = (key: string) => {
    const column = columns.find(col => col.key === key);
    if (!column?.sortable) return;

    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof T];
      const bValue = b[sortConfig.key as keyof T];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSearch(e.target.value);
  };

  const renderCell = (column: Column<T>, row: T) => {
    const value = row[column.key as keyof T];
    
    if (column.render) {
      return column.render(value, row);
    }

    return <span className="text-sm text-gray-700 dark:text-gray-300">{String(value)}</span>;
  };

  const renderSortIcon = (key: string) => {
    if (!columns.find(col => col.key === key)?.sortable) return null;
    
    if (sortConfig?.key === key) {
      return sortConfig.direction === 'asc' ? '↑' : '↓';
    }
    return '↕';
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header with Search and Filters */}
      {(searchable || filterable) && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            {searchable && (
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Cari..."
                    value={searchTerm}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                </div>
              </div>
            )}
            {filterable && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600 ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors' : ''
                  }`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    {column.header}
                    {column.sortable && (
                      <span className="text-gray-400 text-xs">{renderSortIcon(column.key)}</span>
                    )}
                  </div>
                </th>
              ))}
              {actions && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-48 border-b border-gray-200 dark:border-gray-600">
                  AKSI
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800">
            {loading ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue-3"></div>
                    <span className="ml-3 text-gray-500 dark:text-gray-400 font-medium">Memuat data...</span>
                  </div>
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-12 text-center">
                  <div className="text-gray-500 dark:text-gray-400">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <Search className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-lg font-semibold mb-2">Tidak ada data yang ditemukan</p>
                    <p className="text-sm">Coba ubah filter atau kata kunci pencarian Anda</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedData.map((row, index) => (
                <tr
                  key={row.id}
                  className={`transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    index % 2 === 0 
                      ? 'bg-white dark:bg-gray-800' 
                      : 'bg-gray-50/50 dark:bg-gray-700/50'
                  } border-b border-gray-100 dark:border-gray-700 last:border-b-0`}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4">
                      {renderCell(column, row)}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {onView && (
                          <button
                            onClick={() => onView(row)}
                            className="btn btn-outline-success d-flex align-items-center justify-content-center w-10 h-10 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 border-2 hover:border-green-500 bg-white hover:bg-green-50"
                            title="Lihat Detail"
                          >
                            <Eye className="w-4 h-4 text-green-600" />
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="btn btn-outline-warning d-flex align-items-center justify-content-center w-10 h-10 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 border-2 hover:border-yellow-500 bg-white hover:bg-yellow-50"
                            title="Edit Data"
                          >
                            <Edit className="w-4 h-4 text-yellow-600" />
                          </button>
                        )}
                        {onApprove && (!showApproveButton || showApproveButton(row)) && (
                          <button
                            onClick={() => onApprove(row)}
                            className="btn btn-outline-primary d-flex align-items-center justify-content-center w-10 h-10 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 border-2 hover:border-blue-500 bg-white hover:bg-blue-50"
                            title="Approve Tenant"
                          >
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                          </button>
                        )}
                        {onStatusChange && (!showStatusButton || showStatusButton(row)) && (
                          <button
                            onClick={() => onStatusChange(row)}
                            className="btn btn-outline-purple d-flex align-items-center justify-content-center w-10 h-10 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
                            title="Ubah Status"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                        )}
                        {onDelete && (!showDeleteButton || showDeleteButton(row)) && (
                          <button
                            onClick={() => onDelete(row)}
                            className="btn btn-outline-danger d-flex align-items-center justify-content-center w-10 h-10 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 border-2 hover:border-red-500 bg-white hover:bg-red-50"
                            title="Hapus Data"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              Menampilkan <span className="font-bold text-brand-blue-3">{((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}</span> - <span className="font-bold text-brand-blue-3">{Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}</span> dari <span className="font-bold text-brand-blue-3">{pagination.totalItems}</span> data
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="flex items-center gap-1 bg-white border-brand-blue-3 text-brand-blue-3 hover:bg-brand-blue-3 hover:text-white transition-all duration-200"
              >
                <ChevronLeft className="w-4 h-4" />
                Sebelumnya
              </Button>
              
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600 dark:text-gray-400 px-3">
                  Halaman {pagination.currentPage} dari {pagination.totalPages}
                </span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="flex items-center gap-1 bg-white border-brand-blue-3 text-brand-blue-3 hover:bg-brand-blue-3 hover:text-white transition-all duration-200"
              >
                Selanjutnya
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 