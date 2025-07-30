import React, { useState, useEffect } from 'react';
import { User } from '@/types/tenant';
import { getUser } from '@/lib/api';
import { User as UserIcon, Mail, Shield, Building } from 'lucide-react';
import Badge from '@/components/ui/Badge';

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
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error || 'Data user tidak tersedia'}
          </div>
        </div>
      </div>
    );
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case 'superadmin': return 'danger';
      case 'admin': return 'primary';
      case 'user': return 'info';
      default: return 'default';
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
        <h5 className="card-title mb-0">
          <UserIcon className="w-5 h-5 me-2" />
          Informasi User
        </h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <div className="d-flex align-items-center mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-blue-3 to-brand-blue-4 rounded-full flex items-center justify-center text-white font-semibold text-lg me-3">
                {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div>
                <h6 className="mb-1">{user.fullName}</h6>
                <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                  {getRoleText(user.role)}
                </Badge>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{user.email}</span>
              </div>
              {user.tenant && (
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{user.tenant.name}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-500" />
                <span className="text-sm">ID: {user.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 