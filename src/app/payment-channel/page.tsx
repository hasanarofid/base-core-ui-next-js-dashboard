'use client'

import React from 'react';
import Head from 'next/head';
import DashboardLayout from '@/components/layout/DashboardLayout'
import SecureGuard from '@/components/auth/SecureGuard'
import { useAuth } from '@/contexts/AuthContext'
import { usePageTitle } from '@/hooks/usePageTitle';

export default function PaymentChannelPage() {
  const { user } = useAuth()

  // Data payment channels dummy
  const paymentChannels = [
    {
      id: 1,
      name: 'Bank Transfer',
      code: 'BANK_TRANSFER',
      status: 'Aktif',
      icon: 'ti ti-building-bank',
      description: 'Transfer antar bank domestik',
      processingTime: 'Instan - 1 hari',
      fee: 'Rp 4.500',
      minAmount: 'Rp 10.000',
      maxAmount: 'Rp 100.000.000',
      successRate: '99.2%',
      banks: ['BCA', 'BNI', 'BRI', 'Mandiri', 'CIMB Niaga']
    },
    {
      id: 2,
      name: 'E-Wallet',
      code: 'E_WALLET',
      status: 'Aktif',
      icon: 'ti ti-device-mobile',
      description: 'Pembayaran melalui dompet digital',
      processingTime: 'Instan',
      fee: 'Rp 2.000',
      minAmount: 'Rp 1.000',
      maxAmount: 'Rp 10.000.000',
      successRate: '98.8%',
      providers: ['GoPay', 'OVO', 'DANA', 'LinkAja', 'ShopeePay']
    },
    {
      id: 3,
      name: 'Virtual Account',
      code: 'VIRTUAL_ACCOUNT',
      status: 'Aktif',
      icon: 'ti ti-credit-card',
      description: 'Virtual account untuk pembayaran',
      processingTime: 'Instan',
      fee: 'Rp 3.000',
      minAmount: 'Rp 10.000',
      maxAmount: 'Rp 50.000.000',
      successRate: '99.5%',
      banks: ['BCA', 'BNI', 'BRI', 'Mandiri']
    },
    {
      id: 4,
      name: 'QRIS',
      code: 'QRIS',
      status: 'Aktif',
      icon: 'ti ti-qrcode',
      description: 'Pembayaran melalui QRIS',
      processingTime: 'Instan',
      fee: 'Rp 1.000',
      minAmount: 'Rp 1.000',
      maxAmount: 'Rp 5.000.000',
      successRate: '99.0%',
      providers: ['Semua E-Wallet', 'Mobile Banking']
    },
    {
      id: 5,
      name: 'Credit Card',
      code: 'CREDIT_CARD',
      status: 'Nonaktif',
      icon: 'ti ti-credit-card',
      description: 'Pembayaran dengan kartu kredit',
      processingTime: 'Instan',
      fee: '2.5%',
      minAmount: 'Rp 10.000',
      maxAmount: 'Rp 25.000.000',
      successRate: '97.5%',
      providers: ['Visa', 'Mastercard', 'JCB']
    }
  ]

  // Dynamic title management using custom hook
  const { fullTitle, pageTitle, pageSubtitle } = usePageTitle({
    title: 'Payment Channel',
    subtitle: 'Kelola channel pembayaran yang tersedia',
    description: 'Kelola dan konfigurasi channel pembayaran dalam sistem.',
    keywords: 'payment channel, payment method, payment configuration, payment gateway'
  });

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={`${pageSubtitle}. Kelola dan konfigurasi channel pembayaran dalam sistem.`} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={`${pageSubtitle}. Kelola channel pembayaran.`} />
        <meta name="keywords" content="payment channel, payment method, payment configuration, payment gateway" />
      </Head>
      
      <SecureGuard requireAuth={true}>
        <DashboardLayout>
          <div className="container-xxl flex-grow-1 container-p-y">
            {/* Page Header - Matching Dashboard Style */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h4 className="fw-bold mb-1 text-primary">
                  <i className="ti ti-credit-card me-2"></i>
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
                  <i className="ti ti-plus me-1"></i>
                  <span>Tambah Channel</span>
                </button>
              </div>
            </div>

            {/* Statistik */}
            <div className="row mb-4">
              <div className="col-lg-3 col-md-6 mb-3">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <p className="text-muted mb-1">Total Channel</p>
                        <h4 className="fw-bold mb-0">{paymentChannels.length}</h4>
                      </div>
                      <div className="avatar">
                        <div className="avatar-initial rounded bg-label-primary">
                          <i className="ti ti-credit-card"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 mb-3">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <p className="text-muted mb-1">Channel Aktif</p>
                        <h4 className="fw-bold mb-0 text-success">
                          {paymentChannels.filter(ch => ch.status === 'Aktif').length}
                        </h4>
                      </div>
                      <div className="avatar">
                        <div className="avatar-initial rounded bg-label-success">
                          <i className="ti ti-check"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 mb-3">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <p className="text-muted mb-1">Success Rate</p>
                        <h4 className="fw-bold mb-0 text-info">98.8%</h4>
                      </div>
                      <div className="avatar">
                        <div className="avatar-initial rounded bg-label-info">
                          <i className="ti ti-chart-line"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 mb-3">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <p className="text-muted mb-1">Total Transaksi</p>
                        <h4 className="fw-bold mb-0 text-warning">12.5K</h4>
                      </div>
                      <div className="avatar">
                        <div className="avatar-initial rounded bg-label-warning">
                          <i className="ti ti-receipt"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Daftar Payment Channel */}
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Daftar Payment Channel</h5>
              </div>
              <div className="card-body">
                {paymentChannels.map((channel) => (
                  <div key={channel.id} className="border-bottom pb-3 mb-3">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex align-items-center">
                        <div className="avatar me-3">
                          <div className="avatar-initial rounded bg-label-primary">
                            <i className={channel.icon}></i>
                          </div>
                        </div>
                        <div>
                          <h6 className="mb-1">{channel.name}</h6>
                          <p className="text-muted mb-0">{channel.description}</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span className={`badge ${channel.status === 'Aktif' ? 'bg-label-success' : 'bg-label-danger'}`}>
                          {channel.status}
                        </span>
                        <div className="dropdown">
                          <button className="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                            <i className="ti ti-dots-vertical"></i>
                          </button>
                          <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="#"><i className="ti ti-edit me-2"></i>Edit</a></li>
                            <li><a className="dropdown-item" href="#"><i className="ti ti-settings me-2"></i>Konfigurasi</a></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><a className="dropdown-item text-danger" href="#"><i className="ti ti-power me-2"></i>Nonaktifkan</a></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="row">
                      <div className="col-md-3 mb-2">
                        <small className="text-muted d-block">Kode Channel</small>
                        <span className="fw-semibold">{channel.code}</span>
                      </div>
                      <div className="col-md-3 mb-2">
                        <small className="text-muted d-block">Waktu Proses</small>
                        <span className="fw-semibold">{channel.processingTime}</span>
                      </div>
                      <div className="col-md-3 mb-2">
                        <small className="text-muted d-block">Biaya</small>
                        <span className="fw-semibold">{channel.fee}</span>
                      </div>
                      <div className="col-md-3 mb-2">
                        <small className="text-muted d-block">Success Rate</small>
                        <span className="fw-semibold">{channel.successRate}</span>
                      </div>
                    </div>
                    
                    <div className="row mt-2">
                      <div className="col-md-6">
                        <small className="text-muted d-block">Limit Transaksi</small>
                        <span className="fw-semibold">Min: {channel.minAmount} | Max: {channel.maxAmount}</span>
                      </div>
                      <div className="col-md-6">
                        <small className="text-muted d-block">
                          {channel.banks ? 'Bank Tersedia' : 'Provider Tersedia'}
                        </small>
                        <div className="d-flex flex-wrap gap-1 mt-1">
                          {(channel.banks || channel.providers)?.map((item, index) => (
                            <span key={index} className="badge bg-label-info">{item}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Konfigurasi Global */}
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="ti ti-settings text-primary me-2"></i>
                  Konfigurasi Global
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <div className="p-3 bg-light rounded">
                      <div className="d-flex align-items-center mb-2">
                        <i className="ti ti-clock text-primary me-2"></i>
                        <span className="fw-semibold">Timeout Transaksi</span>
                      </div>
                      <p className="mb-0">15 menit</p>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="p-3 bg-light rounded">
                      <div className="d-flex align-items-center mb-2">
                        <i className="ti ti-refresh text-primary me-2"></i>
                        <span className="fw-semibold">Retry Limit</span>
                      </div>
                      <p className="mb-0">3 kali</p>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="p-3 bg-light rounded">
                      <div className="d-flex align-items-center mb-2">
                        <i className="ti ti-bell text-primary me-2"></i>
                        <span className="fw-semibold">Notifikasi</span>
                      </div>
                      <span className="badge bg-label-success">Aktif</span>
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