import React, { useState, useEffect } from 'react';
import { User } from '@/types/tenant';
import { getUser } from '@/lib/api';

interface UserInfoProps {
  className?: string;
}

export default function UserInfo({ className = '' }: UserInfoProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getUser();
        setUser(response.user);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Gagal mengambil data user');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className={`card ${className}`}>
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div className="spinner-border spinner-border-sm me-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <span>Memuat data user...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className={`card ${className}`}>
        <div className="card-body">
          <div className="alert alert-warning mb-0" role="alert">
            <i className="ti ti-alert-triangle me-2"></i>
            {error || 'Data user tidak tersedia'}
          </div>
        </div>
      </div>
    );
  }

  const getRoleBadgeClass = (role: string) => {
    switch (role.toLowerCase()) {
      case 'superadmin': return 'badge bg-label-danger rounded-pill';
      case 'admin': return 'badge bg-label-primary rounded-pill';
      case 'user': return 'badge bg-label-info rounded-pill';
      default: return 'badge bg-label-secondary rounded-pill';
    }
  };

  const getRoleText = (role: string) => {
    switch (role.toLowerCase()) {
      case 'superadmin': return 'Super Admin';
      case 'admin': return 'Admin';
      case 'user': return 'User';
      default: return role;
    }
  };

  return (
    <div className={`card ${className}`}>
      <div className="card-header">
        <h5 className="card-title mb-0 text-primary">
          <i className="ti ti-user me-2"></i>
          Informasi User
        </h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <div className="d-flex align-items-center mb-3">
              <div className="avatar avatar-lg me-3">
                <span className="avatar-initial rounded-circle bg-label-primary">
                  {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
              <div>
                <h6 className="mb-1">{user.fullName}</h6>
                <span className={getRoleBadgeClass(user.role)}>
                  {getRoleText(user.role)}
                </span>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <div className="d-flex align-items-center mb-2">
                <i className="ti ti-mail me-2 text-muted"></i>
                <span className="text-sm">{user.email}</span>
              </div>
              {user.tenant && (
                <div className="d-flex align-items-center mb-2">
                  <i className="ti ti-building me-2 text-muted"></i>
                  <span className="text-sm">{user.tenant.name}</span>
                </div>
              )}
              <div className="d-flex align-items-center">
                <i className="ti ti-shield me-2 text-muted"></i>
                <span className="text-sm">ID: {user.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 