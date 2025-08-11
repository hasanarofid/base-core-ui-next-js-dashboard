'use client';

import React, { useState, useMemo } from 'react';

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
  onVerifyEmail?: (item: T) => void;
  onVerifyUser?: (item: T) => void;
  onResetPassword?: (item: T) => void;
  showApproveButton?: (item: T) => boolean;
  showStatusButton?: (item: T) => boolean;
  showDeleteButton?: (item: T) => boolean;
  showVerifyEmailButton?: (item: T) => boolean;
  showVerifyUserButton?: (item: T) => boolean;
  showResetPasswordButton?: (item: T) => boolean;
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
  onVerifyEmail,
  onVerifyUser,
  onResetPassword,
  showApproveButton,
  showStatusButton,
  showDeleteButton,
  showVerifyEmailButton,
  showVerifyUserButton,
  showResetPasswordButton,
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

    return <span className="text-body">{String(value)}</span>;
  };

  const renderSortIcon = (key: string) => {
    if (!columns.find(col => col.key === key)?.sortable) return null;
    
    if (sortConfig?.key === key) {
      return (
        <i className={`ti ${sortConfig.direction === 'asc' ? 'ti-chevron-up' : 'ti-chevron-down'} ti-xs`}></i>
      );
    }
    return <i className="ti ti-selector ti-xs text-muted"></i>;
  };

  return (
    <div className={`${className}`}>
      {/* Header with Search and Filters */}
      {(searchable || filterable) && (
        <div className="card-header border-bottom">
          <div className="row">
            {searchable && (
              <div className="col-md-8">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="ti ti-search ti-sm"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Cari..."
                    value={searchTerm}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}
            {filterable && (
              <div className="col-md-4">
                <button className="btn btn-label-primary">
                  <i className="ti ti-filter ti-sm me-1"></i>
                  Filter
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-hover table-striped">
          <thead className="table-light">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`text-nowrap ${column.sortable ? 'cursor-pointer' : ''}`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="d-flex align-items-center">
                    <span className="text-uppercase fw-medium">{column.header}</span>
                    {column.sortable && (
                      <span className="ms-1">{renderSortIcon(column.key)}</span>
                    )}
                  </div>
                </th>
              ))}
              {actions && (
                <th className="text-nowrap text-center">
                  <span className="text-uppercase fw-medium">AKSI</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-5">
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <span className="text-muted">Memuat data...</span>
                  </div>
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-5">
                  <div className="text-muted">
                    <div className="mb-3">
                      <i className="ti ti-search ti-lg text-muted"></i>
                    </div>
                    <h6 className="text-muted mb-2">Tidak ada data yang ditemukan</h6>
                    <p className="text-muted mb-0">Coba ubah filter atau kata kunci pencarian Anda</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedData.map((row) => (
                <tr key={row.id}>
                  {columns.map((column) => (
                    <td key={column.key} className="align-middle">
                      {renderCell(column, row)}
                    </td>
                  ))}
                  {actions && (
                    <td className="align-middle text-center">
                      <div className="d-flex justify-content-center gap-1">
                        {onView && (
                          <button
                            onClick={() => onView(row)}
                            className="btn btn-sm btn-label-success"
                            title="Lihat Detail"
                          >
                            <i className="ti ti-eye"></i>
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="btn btn-sm btn-label-warning"
                            title="Edit Data"
                          >
                            <i className="ti ti-edit"></i>
                          </button>
                        )}
                        {onApprove && (!showApproveButton || showApproveButton(row)) && (
                          <button
                            onClick={() => onApprove(row)}
                            className="btn btn-sm btn-label-primary"
                            title="Approve Tenant"
                          >
                            <i className="ti ti-check"></i>
                          </button>
                        )}
                        {onStatusChange && (!showStatusButton || showStatusButton(row)) && (
                          <button
                            onClick={() => onStatusChange(row)}
                            className="btn btn-sm btn-label-info"
                            title="Ubah Status"
                          >
                            <i className="ti ti-settings"></i>
                          </button>
                        )}
                        {onDelete && (!showDeleteButton || showDeleteButton(row)) && (
                          <button
                            onClick={() => onDelete(row)}
                            className="btn btn-sm btn-label-danger"
                            title="Hapus Data"
                          >
                            <i className="ti ti-trash"></i>
                          </button>
                        )}
                        {onVerifyEmail && (!showVerifyEmailButton || showVerifyEmailButton(row)) && (
                          <button
                            onClick={() => onVerifyEmail(row)}
                            className="btn btn-sm btn-label-info"
                            title="Verifikasi Email"
                          >
                            <i className="ti ti-mail"></i>
                          </button>
                        )}
                        {onVerifyUser && (!showVerifyUserButton || showVerifyUserButton(row)) && (
                          <button
                            onClick={() => onVerifyUser(row)}
                            className="btn btn-sm btn-label-success"
                            title="Verifikasi User"
                          >
                            <i className="ti ti-user-check"></i>
                          </button>
                        )}
                        {onResetPassword && (!showResetPasswordButton || showResetPasswordButton(row)) && (
                          <button
                            onClick={() => onResetPassword(row)}
                            className="btn btn-sm btn-label-warning"
                            title="Reset Password"
                          >
                            <i className="ti ti-key"></i>
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
        <div className="card-footer border-top">
          <div className="d-flex align-items-center justify-content-between">
            <div className="text-muted">
              Menampilkan <span className="fw-semibold text-primary">{((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}</span> - <span className="fw-semibold text-primary">{Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}</span> dari <span className="fw-semibold text-primary">{pagination.totalItems}</span> data
            </div>
            <nav aria-label="Page navigation">
              <ul className="pagination pagination-sm m-0">
                {/* First Page */}
                <li className={`page-item first ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => pagination.onPageChange(1)}
                    disabled={pagination.currentPage === 1}
                    title="Halaman Pertama"
                  >
                    <i className="ti ti-chevrons-left ti-xs"></i>
                  </button>
                </li>
                
                {/* Previous Page */}
                <li className={`page-item prev ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    title="Halaman Sebelumnya"
                  >
                    <i className="ti ti-chevron-left ti-xs"></i>
                  </button>
                </li>

                {/* Page Numbers */}
                {(() => {
                  const pageNumbers = [];
                  const maxPages = 5;
                  let startPage = Math.max(1, pagination.currentPage - Math.floor(maxPages / 2));
                  const endPage = Math.min(pagination.totalPages, startPage + maxPages - 1);

                  // Adjust startPage if we're near the end
                  if (endPage - startPage < maxPages - 1) {
                    startPage = Math.max(1, endPage - maxPages + 1);
                  }

                  for (let i = startPage; i <= endPage; i++) {
                    pageNumbers.push(
                      <li key={i} className={`page-item ${i === pagination.currentPage ? 'active' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => pagination.onPageChange(i)}
                        >
                          {i}
                        </button>
                      </li>
                    );
                  }

                  // Add ellipsis if needed
                  if (startPage > 1) {
                    pageNumbers.unshift(
                      <li key="start-ellipsis" className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    );
                  }

                  if (endPage < pagination.totalPages) {
                    pageNumbers.push(
                      <li key="end-ellipsis" className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    );
                  }

                  return pageNumbers;
                })()}
                
                {/* Next Page */}
                <li className={`page-item next ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    title="Halaman Selanjutnya"
                  >
                    <i className="ti ti-chevron-right ti-xs"></i>
                  </button>
                </li>

                {/* Last Page */}
                <li className={`page-item last ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => pagination.onPageChange(pagination.totalPages)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    title="Halaman Terakhir"
                  >
                    <i className="ti ti-chevrons-right ti-xs"></i>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
} 