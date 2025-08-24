import React from 'react';
import { User } from '@/types/user';

interface UserDetailModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  loading?: boolean;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({
  user,
  isOpen,
  onClose,
  loading = false
}) => {
  if (!isOpen) return null;

  const getRoleDisplayName = (role: string | undefined) => {
    if (!role) return 'Role tidak tersedia';
    
    switch (role.toLowerCase()) {
      case 'superadmin':
        return 'Super Admin';
      case 'tenant_admin':
        return 'Admin Tenant';
      case 'admin_tenant':
        return 'Admin Tenant';
      case 'end_user':
        return 'End User';
      default:
        return role;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Tidak tersedia';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  const getVerificationBadgeClass = (forcePasswordChange: boolean) => {
    return forcePasswordChange ? 'badge bg-label-success rounded-pill' : 'badge bg-label-warning rounded-pill';
  };

  const getVerificationText = (forcePasswordChange: boolean) => {
    return forcePasswordChange ? 'Terverifikasi' : 'Belum Terverifikasi';
  };



  return (
    <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="ti ti-user me-2 text-primary"></i>
              Detail User
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          
          <div className="modal-body">
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">Memuat detail user...</p>
              </div>
            ) : user ? (
              <div className="row">
                {/* Informasi Dasar */}
                <div className="col-12 mb-4">
                  <div className="card border-0 bg-light-primary">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        <div className="avatar avatar-lg me-3">
                          <div className="avatar-initial rounded-circle bg-primary">
                            <i className="ti ti-user text-white"></i>
                          </div>
                        </div>
                        <div>
                          <h5 className="mb-1 text-primary">{user.full_name || user.fullName || 'Nama tidak tersedia'}</h5>
                          <p className="text-muted mb-0">{user.email}</p>
                        </div>
                      </div>
                      
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-semibold text-muted">Role</label>
                            <div>
                              <span className="badge bg-label-info rounded-pill">
                                {getRoleDisplayName(user.role)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-semibold text-muted">ID User</label>
                            <div className="text-break">
                              <code className="text-primary">{user.id}</code>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                                 {/* Status Verifikasi */}
                 <div className="col-md-6 mb-4">
                   <div className="card h-100">
                     <div className="card-header">
                       <h6 className="card-title mb-0">
                         <i className="ti ti-shield-check me-2 text-success"></i>
                         Status Verifikasi
                       </h6>
                     </div>
                     <div className="card-body">
                       <div className="mb-3">
                         <label className="form-label fw-semibold text-muted">Status Verifikasi</label>
                         <div>
                           <span className={getVerificationBadgeClass(user.force_password_change || false)}>
                             {getVerificationText(user.force_password_change || false)}
                           </span>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>

                {/* Informasi Tenant */}
                <div className="col-md-6 mb-4">
                  <div className="card h-100">
                    <div className="card-header">
                      <h6 className="card-title mb-0">
                        <i className="ti ti-building me-2 text-info"></i>
                        Informasi Tenant
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <label className="form-label fw-semibold text-muted">Tenant ID</label>
                        <div className="text-break">
                          <code className="text-info">{user.tenant_id || 'Tidak tersedia'}</code>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label fw-semibold text-muted">Nama Tenant</label>
                        <div>
                          {user.tenant?.name || 'Tidak tersedia'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informasi Timestamp */}
                <div className="col-12">
                  <div className="card">
                    <div className="card-header">
                      <h6 className="card-title mb-0">
                        <i className="ti ti-clock me-2 text-warning"></i>
                        Informasi Timestamp
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-semibold text-muted">Tanggal Dibuat</label>
                            <div>
                              {formatDate(user.createdAt || '')}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label fw-semibold text-muted">Terakhir Diupdate</label>
                            <div>
                              {formatDate(user.updatedAt || '')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <i className="ti ti-alert-circle text-warning" style={{ fontSize: '3rem' }}></i>
                <h5 className="mt-3 text-muted">Data User Tidak Ditemukan</h5>
                <p className="text-muted">Detail user tidak dapat dimuat atau user tidak ditemukan.</p>
              </div>
            )}
          </div>
          
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              <i className="ti ti-x me-1"></i>
              Tutup
            </button>
          </div>
        </div>
      </div>
      
      {/* Backdrop */}
      <div 
        className="modal-backdrop fade show" 
        onClick={onClose}
        style={{ zIndex: -1 }}
      ></div>
    </div>
  );
};

export default UserDetailModal;
