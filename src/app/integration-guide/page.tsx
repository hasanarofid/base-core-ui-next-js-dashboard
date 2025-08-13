'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import AuthGuard from '@/components/auth/AuthGuard'
import { useAuth } from '@/contexts/AuthContext'

export default function IntegrationGuidePage() {
  const { user } = useAuth()

  return (
    <AuthGuard requireAuth={true}>
      <DashboardLayout>
        <div className="container-xxl flex-grow-1 container-p-y">
          <h4 className="fw-bold py-3 mb-4">
            <span className="text-muted fw-light">Integration Guide /</span> Panduan Integrasi
          </h4>

          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    <i className="ti ti-tools me-2 text-primary"></i>
                    Panduan Integrasi API
                  </h5>
                  <p className="card-subtitle text-muted mb-0">
                    Dokumentasi API / webhook untuk developer merchant
                  </p>
                </div>
                <div className="card-body">
                  <div className="alert alert-info" role="alert">
                    <h6 className="alert-heading">
                      <i className="ti ti-info-circle me-2"></i>
                      Informasi Integrasi
                    </h6>
                    <p className="mb-0">
                      Panduan lengkap untuk mengintegrasikan sistem payment gateway ke aplikasi merchant Anda.
                      Pastikan untuk membaca semua dokumentasi sebelum memulai integrasi.
                    </p>
                  </div>

                  {/* Quick Start Section */}
                  <div className="row mb-4">
                    <div className="col-12">
                      <div className="card border-primary">
                        <div className="card-header bg-primary text-white">
                          <h6 className="card-title mb-0">
                            <i className="ti ti-rocket me-2"></i>
                            Quick Start Guide
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6">
                              <h6 className="fw-bold">1. Dapatkan Kredensial API</h6>
                              <p className="text-muted">
                                Ambil Client ID dan Client Secret dari halaman API Credentials.
                              </p>
                              <a href="/api-credentials" className="btn btn-outline-primary btn-sm">
                                <i className="ti ti-key me-2"></i>
                                Lihat Kredensial
                              </a>
                            </div>
                            <div className="col-md-6">
                              <h6 className="fw-bold">2. Konfigurasi Callback</h6>
                              <p className="text-muted">
                                Atur URL callback untuk menerima notifikasi status transaksi.
                              </p>
                              <a href="/callback-config" className="btn btn-outline-primary btn-sm">
                                <i className="ti ti-settings me-2"></i>
                                Konfigurasi Callback
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* API Endpoints Section */}
                  <div className="row mb-4">
                    <div className="col-12">
                      <h6 className="fw-bold mb-3">API Endpoints</h6>
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead className="table-light">
                            <tr>
                              <th>Method</th>
                              <th>Endpoint</th>
                              <th>Description</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <span className="badge bg-success">POST</span>
                              </td>
                              <td>
                                <code>/api/v1/transactions</code>
                              </td>
                              <td>Create new transaction</td>
                              <td>
                                <span className="badge bg-success">Active</span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <span className="badge bg-info">GET</span>
                              </td>
                              <td>
                                <code>/api/v1/transactions/{'{id}'}</code>
                              </td>
                              <td>Get transaction details</td>
                              <td>
                                <span className="badge bg-success">Active</span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <span className="badge bg-warning">PUT</span>
                              </td>
                              <td>
                                <code>/api/v1/transactions/{'{id}'}/status</code>
                              </td>
                              <td>Update transaction status</td>
                              <td>
                                <span className="badge bg-success">Active</span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <span className="badge bg-info">GET</span>
                              </td>
                              <td>
                                <code>/api/v1/payment-methods</code>
                              </td>
                              <td>Get available payment methods</td>
                              <td>
                                <span className="badge bg-success">Active</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Code Examples Section */}
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <div className="card border-success">
                        <div className="card-header bg-success text-white">
                          <h6 className="card-title mb-0">
                            <i className="ti ti-code me-2"></i>
                            PHP Example
                          </h6>
                        </div>
                        <div className="card-body">
                          <pre className="bg-light p-3 rounded">
{`<?php
// Create transaction
$url = 'https://api.payment-gateway.com/v1/transactions';
$data = [
    'amount' => 100000,
    'currency' => 'IDR',
    'order_id' => 'ORD-001',
    'payment_method' => 'bank_transfer',
    'callback_url' => 'https://your-domain.com/callback'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer YOUR_CLIENT_SECRET'
]);

$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>`}
                          </pre>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="card border-primary">
                        <div className="card-header bg-primary text-white">
                          <h6 className="card-title mb-0">
                            <i className="ti ti-code me-2"></i>
                            JavaScript Example
                          </h6>
                        </div>
                        <div className="card-body">
                          <pre className="bg-light p-3 rounded">
{`// Create transaction
const createTransaction = async () => {
  const response = await fetch('https://api.payment-gateway.com/v1/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_CLIENT_SECRET'
    },
    body: JSON.stringify({
      amount: 100000,
      currency: 'IDR',
      order_id: 'ORD-001',
      payment_method: 'bank_transfer',
      callback_url: 'https://your-domain.com/callback'
    })
  });
  
  const data = await response.json();
  console.log(data);
};

createTransaction();`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Webhook Documentation */}
                  <div className="row mb-4">
                    <div className="col-12">
                      <div className="card border-warning">
                        <div className="card-header bg-warning text-white">
                          <h6 className="card-title mb-0">
                            <i className="ti ti-webhook me-2"></i>
                            Webhook Documentation
                          </h6>
                        </div>
                        <div className="card-body">
                          <h6 className="fw-bold">Callback Payload</h6>
                          <p className="text-muted">
                            Format data yang dikirim ke callback URL Anda:
                          </p>
                          <pre className="bg-light p-3 rounded">
{`{
  "transaction_id": "TRX-123456789",
  "order_id": "ORD-001",
  "status": "success",
  "amount": 100000,
  "currency": "IDR",
  "payment_method": "bank_transfer",
  "timestamp": "2024-01-15T10:30:00Z",
  "signature": "hmac_sha256_signature_here"
}`}
                          </pre>
                          
                          <h6 className="fw-bold mt-3">Signature Verification</h6>
                          <p className="text-muted">
                            Verifikasi signature untuk memastikan data berasal dari sistem kami:
                          </p>
                          <pre className="bg-light p-3 rounded">
{`// PHP Example
$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_SIGNATURE'];
$expectedSignature = hash_hmac('sha256', $payload, 'YOUR_SECRET_KEY');

if (hash_equals($expectedSignature, $signature)) {
    // Valid signature, process the data
    $data = json_decode($payload, true);
    // Handle the callback
} else {
    // Invalid signature
    http_response_code(400);
}`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SDK Downloads */}
                  <div className="row mb-4">
                    <div className="col-12">
                      <h6 className="fw-bold mb-3">SDK Downloads</h6>
                      <div className="row">
                        <div className="col-md-3">
                          <div className="card text-center">
                            <div className="card-body">
                              <i className="ti ti-brand-php text-primary" style={{ fontSize: '2rem' }}></i>
                              <h6 className="mt-2">PHP SDK</h6>
                              <button className="btn btn-outline-primary btn-sm">
                                <i className="ti ti-download me-2"></i>
                                Download
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="card text-center">
                            <div className="card-body">
                              <i className="ti ti-brand-javascript text-warning" style={{ fontSize: '2rem' }}></i>
                              <h6 className="mt-2">Node.js SDK</h6>
                              <button className="btn btn-outline-primary btn-sm">
                                <i className="ti ti-download me-2"></i>
                                Download
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="card text-center">
                            <div className="card-body">
                              <i className="ti ti-brand-python text-success" style={{ fontSize: '2rem' }}></i>
                              <h6 className="mt-2">Python SDK</h6>
                              <button className="btn btn-outline-primary btn-sm">
                                <i className="ti ti-download me-2"></i>
                                Download
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="card text-center">
                            <div className="card-body">
                              <i className="ti ti-brand-java text-danger" style={{ fontSize: '2rem' }}></i>
                              <h6 className="mt-2">Java SDK</h6>
                              <button className="btn btn-outline-primary btn-sm">
                                <i className="ti ti-download me-2"></i>
                                Download
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Support Section */}
                  <div className="row">
                    <div className="col-12">
                      <div className="card border-info">
                        <div className="card-header bg-info text-white">
                          <h6 className="card-title mb-0">
                            <i className="ti ti-headset me-2"></i>
                            Need Help?
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-4">
                              <h6 className="fw-bold">
                                <i className="ti ti-book me-2 text-primary"></i>
                                Documentation
                              </h6>
                              <p className="text-muted">
                                Baca dokumentasi lengkap untuk informasi detail.
                              </p>
                              <a href="#" className="btn btn-outline-primary btn-sm">
                                Read Docs
                              </a>
                            </div>
                            <div className="col-md-4">
                              <h6 className="fw-bold">
                                <i className="ti ti-message-circle me-2 text-success"></i>
                                Support Chat
                              </h6>
                              <p className="text-muted">
                                Chat langsung dengan tim support kami.
                              </p>
                              <button className="btn btn-outline-success btn-sm">
                                Start Chat
                              </button>
                            </div>
                            <div className="col-md-4">
                              <h6 className="fw-bold">
                                <i className="ti ti-mail me-2 text-warning"></i>
                                Email Support
                              </h6>
                              <p className="text-muted">
                                Kirim email ke support@payment-gateway.com
                              </p>
                              <a href="mailto:support@payment-gateway.com" className="btn btn-outline-warning btn-sm">
                                Send Email
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
} 