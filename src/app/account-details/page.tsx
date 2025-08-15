'use client'

import React from 'react';
import Head from 'next/head';
import DashboardLayout from '@/components/layout/DashboardLayout'
import SecureGuard from '@/components/auth/SecureGuard'
import { useAuth } from '@/contexts/AuthContext'
import { usePageTitle } from '@/hooks/usePageTitle';

export default function AccountDetailsPage() {
  const { user } = useAuth()

  // Dynamic title management using custom hook
  const { fullTitle, pageTitle, pageSubtitle } = usePageTitle({
    title: 'Detail Akun',
    subtitle: 'Informasi detail akun pengguna',
    description: 'Kelola dan lihat informasi detail akun pengguna dalam sistem.',
    keywords: 'account details, user profile, account security, user management'
  });

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={`${pageSubtitle}. Kelola dan lihat informasi detail akun pengguna dalam sistem.`} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={`${pageSubtitle}. Informasi detail akun pengguna.`} />
        <meta name="keywords" content="account details, user profile, account security, user management" />
      </Head>
      
      <SecureGuard requireAuth={true}>
        <DashboardLayout>
          <div className="container-xxl flex-grow-1 container-p-y">
            {/* Page Header - Matching Dashboard Style */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h4 className="fw-bold mb-1 text-primary">
                  <i className="ti ti-user me-2"></i>
                  {pageTitle}
                </h4>
                <p className="text-muted mb-0">{pageSubtitle}</p>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-label-primary">
                  <i className="ti ti-download me-1"></i>
                  <span>Export Data</span>
                </button>
                <button className="btn btn-primary">
                  <i className="ti ti-edit me-1"></i>
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>

            <div className="row">
              {/* Informasi Pribadi */}
              <div className="col-lg-6 mb-4">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">
                      <i className="ti ti-user text-primary me-2"></i>
                      Informasi Pribadi
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-muted">Nama Lengkap</span>
                      <span className="fw-semibold">{user?.fullName || '-'}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-muted">Email</span>
                      <span className="fw-semibold">{user?.email || '-'}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-muted">ID Pengguna</span>
                      <span className="fw-semibold text-muted">{user?.id || '-'}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted">Role</span>
                      <span className="badge bg-label-primary">{user?.role || '-'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Keamanan Akun */}
              <div className="col-lg-6 mb-4">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">
                      <i className="ti ti-shield text-primary me-2"></i>
                      Keamanan Akun
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-muted">Status Password</span>
                      <span className={`badge ${user?.force_password_change ? 'bg-label-danger' : 'bg-label-success'}`}>
                        {user?.force_password_change ? 'Perlu Diubah' : 'Aman'}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-muted">Tenant ID</span>
                      <span className="fw-semibold text-muted">{user?.tenantId || '-'}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted">Status Akun</span>
                      <span className="badge bg-label-success">Aktif</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Aktivitas Terbaru */}
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="ti ti-history text-primary me-2"></i>
                  Aktivitas Terbaru
                </h5>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center mb-3 p-3 bg-light rounded">
                  <div className="flex-shrink-0 me-3">
                    <i className="ti ti-login text-success fs-4"></i>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-1">Login berhasil</h6>
                    <small className="text-muted">Baru saja</small>
                  </div>
                </div>
                <div className="d-flex align-items-center p-3 bg-light rounded">
                  <div className="flex-shrink-0 me-3">
                    <i className="ti ti-eye text-primary fs-4"></i>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-1">Melihat dashboard</h6>
                    <small className="text-muted">2 menit yang lalu</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </SecureGuard>
    </>
  )
} 