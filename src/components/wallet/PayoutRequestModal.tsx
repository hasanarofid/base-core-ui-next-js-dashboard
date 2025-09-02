import React, { useState } from 'react'
import { WalletData } from '@/types/wallet'

interface PayoutRequestModalProps {
  walletData: WalletData
  onClose: () => void
  onSubmit: (payoutData: {
    amount: number
    bank: {
      code: string
      accountNo: string
      accountName: string
    }
    notes: string
  }) => void
}

export function PayoutRequestModal({
  walletData,
  onClose,
  onSubmit
}: PayoutRequestModalProps) {
  const [formData, setFormData] = useState({
    amount: '',
    bankCode: '014', // Default BCA
    accountNo: '',
    accountName: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Bank options
  const bankOptions = [
    { code: '014', name: 'BCA' },
    { code: '008', name: 'Mandiri' },
    { code: '009', name: 'BNI' },
    { code: '002', name: 'BRI' },
    { code: '022', name: 'CIMB Niaga' },
    { code: '011', name: 'Danamon' },
    { code: '013', name: 'Permata' },
    { code: '016', name: 'HSBC' }
  ]

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Jumlah harus lebih dari 0'
    } else if (parseFloat(formData.amount) > walletData.available_amount) {
      newErrors.amount = `Jumlah tidak boleh melebihi saldo tersedia (${formatCurrency(walletData.available_amount, walletData.currency)})`
    }
    
    if (!formData.accountNo) {
      newErrors.accountNo = 'Nomor rekening harus diisi'
    }
    
    if (!formData.accountName) {
      newErrors.accountName = 'Nama pemilik rekening harus diisi'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      await onSubmit({
        amount: parseFloat(formData.amount),
        bank: {
          code: formData.bankCode,
          accountNo: formData.accountNo,
          accountName: formData.accountName
        },
        notes: formData.notes
      })
    } catch (error) {
      console.error('Error submitting payout request:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="ti ti-cash me-2 text-success" />
              Request Payout
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            />
          </div>
          
          <div className="modal-body">
            {/* Wallet Info */}
            <div className="alert alert-info mb-4">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <strong>Available Balance:</strong> 
                  <span className="text-success fw-bold ms-2">
                    {formatCurrency(walletData.available_amount, walletData.currency)}
                  </span>
                </div>
                <div className="col-md-6">
                  <strong>Currency:</strong> 
                  <span className="badge bg-label-primary ms-2">{walletData.currency}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Jumlah Payout <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">{walletData.currency}</span>
                      <input
                        type="number"
                        className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                        placeholder="Masukkan jumlah"
                        value={formData.amount}
                        onChange={(e) => handleInputChange('amount', e.target.value)}
                        min="1"
                        max={walletData.available_amount}
                        step="1000"
                      />
                    </div>
                    {errors.amount && (
                      <div className="invalid-feedback d-block">{errors.amount}</div>
                    )}
                    <small className="text-muted">
                      Maksimal: {formatCurrency(walletData.available_amount, walletData.currency)}
                    </small>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Bank <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      value={formData.bankCode}
                      onChange={(e) => handleInputChange('bankCode', e.target.value)}
                    >
                      {bankOptions.map(bank => (
                        <option key={bank.code} value={bank.code}>
                          {bank.name} ({bank.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Nomor Rekening <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.accountNo ? 'is-invalid' : ''}`}
                      placeholder="Masukkan nomor rekening"
                      value={formData.accountNo}
                      onChange={(e) => handleInputChange('accountNo', e.target.value)}
                    />
                    {errors.accountNo && (
                      <div className="invalid-feedback d-block">{errors.accountNo}</div>
                    )}
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Nama Pemilik Rekening <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.accountName ? 'is-invalid' : ''}`}
                      placeholder="Masukkan nama pemilik rekening"
                      value={formData.accountName}
                      onChange={(e) => handleInputChange('accountName', e.target.value)}
                    />
                    {errors.accountName && (
                      <div className="invalid-feedback d-block">{errors.accountName}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Catatan (Opsional)</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Tambahkan catatan untuk payout ini..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                />
              </div>

              <div className="alert alert-warning">
                <i className="ti ti-alert-triangle me-2"></i>
                <strong>Perhatian:</strong> Pastikan data bank yang dimasukkan sudah benar. 
                Payout akan diproses dalam 1-3 hari kerja setelah permintaan disetujui.
              </div>
            </form>
          </div>
          
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={handleSubmit}
              disabled={loading || !formData.amount || parseFloat(formData.amount) <= 0}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Memproses...
                </>
              ) : (
                <>
                  <i className="ti ti-send me-2"></i>
                  Kirim Permintaan Payout
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
