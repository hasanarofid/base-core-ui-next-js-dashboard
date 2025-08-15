'use client'

import React from 'react';
import Head from 'next/head';
import DashboardLayout from '@/components/layout/DashboardLayout'
import SecureGuard from '@/components/auth/SecureGuard'
import { useAuth } from '@/contexts/AuthContext'
import { usePageTitle } from '@/hooks/usePageTitle';

export default function MerchantDetailsPage() {
  const { user } = useAuth()

  // Data merchant dummy - dalam implementasi nyata akan diambil dari API
  const merchantData = {
    name: 'PT. Merchant Indonesia',
    code: 'MERCH001',
    type: 'E-commerce',
    status: 'Aktif',
    address: 'Jl. Sudirman No. 123, Jakarta Pusat',
    phone: '+62 21 1234 5678',
    email: 'contact@merchantindonesia.com',
    website: 'www.merchantindonesia.com',
    registrationDate: '2024-01-15',
    taxId: '12.345.678.9-123.456',
    bankAccount: '1234567890',
    bankName: 'Bank Central Asia (BCA)',
    settlementPeriod: 'T+1',
    commissionRate: '2.5%',
    monthlyVolume: 'Rp 500.000.000',
    totalTransactions: 1250
  }

  // Dynamic title management using custom hook
  const { fullTitle, pageTitle, pageSubtitle } = usePageTitle({
    title: 'Detail Merchant',
    subtitle: 'Informasi detail merchant dan konfigurasi',
    description: 'Kelola dan lihat informasi detail merchant dalam sistem.',
    keywords: 'merchant details, merchant profile, merchant configuration, business information'
  });

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={`${pageSubtitle}. Kelola dan lihat informasi detail merchant dalam sistem.`} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={`${pageSubtitle}. Informasi detail merchant.`} />
        <meta name="keywords" content="merchant details, merchant profile, merchant configuration, business information" />
      </Head>
      
      <SecureGuard requireAuth={true}>
        <DashboardLayout>
          <div className="container-xxl flex-grow-1 container-p-y">
            {/* Page Header - Matching Dashboard Style */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h4 className="fw-bold mb-1 text-primary">
                  <i className="ti ti-building-store me-2"></i>
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
                  <span>Edit Merchant</span>
                </button>
              </div>
            </div>

            <div className="row">
              {/* Informasi Dasar */}
              <div className="col-lg-6 mb-4">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">
                      <i className="ti ti-building-store text-primary me-2"></i>
                      Informasi Dasar
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-muted">Nama Merchant</span>
                      <span className="fw-semibold">{merchantData.name}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-muted">Kode Merchant</span>
                      <span className="fw-semibold text-muted">{merchantData.code}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-muted">Tipe Bisnis</span>
                      <span className="badge bg-label-info">{merchantData.type}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-muted">Status</span>
                      <span className="badge bg-label-success">{merchantData.status}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted">Tanggal Registrasi</span>
                      <span className="fw-semibold">{merchantData.registrationDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informasi Kontak */}
              <div className="col-lg-6 mb-4">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">
                      <i className="ti ti-map-pin text-primary me-2"></i>
                      Informasi Kontak
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <span className="text-muted d-block mb-1">Alamat</span>
                      <span className="fw-semibold">{merchantData.address}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-muted">Telepon</span>
                      <span className="fw-semibold">{merchantData.phone}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-muted">Email</span>
                      <span className="fw-semibold">{merchantData.email}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted">Website</span>
                      <a href={`https://${merchantData.website}`} className="fw-semibold text-primary" target="_blank" rel="noopener noreferrer">
                        {merchantData.website}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              {/* Informasi Keuangan */}
              <div className="col-lg-6 mb-4">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">
                      <i className="ti ti-credit-card text-primary me-2"></i>
                      Informasi Keuangan
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-muted">NPWP</span>
                      <span className="fw-semibold">{merchantData.taxId}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-muted">Bank</span>
                      <span className="fw-semibold">{merchantData.bankName}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-muted">Nomor Rekening</span>
                      <span className="fw-semibold">{merchantData.bankAccount}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-muted">Periode Settlement</span>
                      <span className="badge bg-label-warning">{merchantData.settlementPeriod}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted">Komisi</span>
                      <span className="badge bg-label-primary">{merchantData.commissionRate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistik Transaksi */}
              <div className="col-lg-6 mb-4">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">
                      <i className="ti ti-chart-bar text-primary me-2"></i>
                      Statistik Transaksi
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-muted">Volume Bulanan</span>
                      <span className="fw-semibold">{merchantData.monthlyVolume}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-muted">Total Transaksi</span>
                      <span className="fw-semibold">{merchantData.totalTransactions.toLocaleString()}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-muted">Rata-rata Transaksi</span>
                      <span className="fw-semibold">Rp 400.000</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-muted">Success Rate</span>
                      <span className="badge bg-label-success">98.5%</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted">Rating</span>
                      <div className="d-flex align-items-center">
                        <i className="ti ti-star text-warning me-1"></i>
                        <i className="ti ti-star text-warning me-1"></i>
                        <i className="ti ti-star text-warning me-1"></i>
                        <i className="ti ti-star text-warning me-1"></i>
                        <i className="ti ti-star text-muted me-1"></i>
                        <span className="fw-semibold">4.0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Konfigurasi Merchant */}
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="ti ti-settings text-primary me-2"></i>
                  Konfigurasi Merchant
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <div className="p-3 bg-light rounded">
                      <div className="d-flex align-items-center mb-2">
                        <i className="ti ti-toggle-right text-primary me-2"></i>
                        <span className="fw-semibold">Webhook URL</span>
                      </div>
                      <small className="text-muted">https://api.merchantindonesia.com/webhook</small>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="p-3 bg-light rounded">
                      <div className="d-flex align-items-center mb-2">
                        <i className="ti ti-key text-primary me-2"></i>
                        <span className="fw-semibold">API Key</span>
                      </div>
                      <small className="text-muted">merch_sk_test_1234567890abcdef</small>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="p-3 bg-light rounded">
                      <div className="d-flex align-items-center mb-2">
                        <i className="ti ti-shield text-primary me-2"></i>
                        <span className="fw-semibold">Security Level</span>
                      </div>
                      <span className="badge bg-label-success">High</span>
                    </div>
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