'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import ChangePasswordModal from './ChangePasswordModal';

interface ForcePasswordChangeGuardProps {
  children: React.ReactNode;
}

export default function ForcePasswordChangeGuard({ children }: ForcePasswordChangeGuardProps) {
  const { user, isLoading, checkAuth } = useAuth();
  const pathname = usePathname();
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [hasCheckedForcePassword, setHasCheckedForcePassword] = useState(false);
  const [passwordChangeCompleted, setPasswordChangeCompleted] = useState(false);

  // Daftar halaman yang tidak memerlukan auth
  const publicPages = ['/login', '/register', '/forgot-password', '/reset-password'];

  // Reset state ketika user berubah (login/logout)
  useEffect(() => {
    if (!user) {
      setPasswordChangeCompleted(false);
      setHasCheckedForcePassword(false);
      setShowChangePasswordModal(false);
    }
  }, [user]);

  useEffect(() => {
    // Jika masih loading, tunggu
    if (isLoading) return;

    // Jika di halaman publik, tidak perlu cek force password change
    if (publicPages.includes(pathname)) {
      setHasCheckedForcePassword(true);
      return;
    }

    // Jika password change sudah selesai, tidak perlu cek lagi
    if (passwordChangeCompleted) {
      setHasCheckedForcePassword(true);
      return;
    }

    // Jika ada user dan belum dicek
    if (user && !hasCheckedForcePassword) {
      console.log('🔍 ForcePasswordChangeGuard: Checking user conditions');
      console.log('🔍 User role:', user.role);
      console.log('🔍 Force password change:', user.force_password_change);
      console.log('🔍 Current pathname:', pathname);
      
      // Force password change berlaku untuk role tenant_admin dan admin_tenant
      // Superadmin tidak terpengaruh oleh aturan ini
      if ((user.role === 'admin_tenant' || user.role === 'tenant_admin') && user.force_password_change) {
        console.log('🚨 Admin tenant needs to change password!');
        // Delay sedikit untuk memastikan modal muncul setelah halaman selesai loading
        setTimeout(() => {
          setShowChangePasswordModal(true);
        }, 500);
      } else {
        console.log('✅ User does not need to change password');
      }
      setHasCheckedForcePassword(true);
    } else if (!user && !hasCheckedForcePassword) {
      // Jika tidak ada user, set checked untuk menghindari infinite loading
      setHasCheckedForcePassword(true);
    }
  }, [user, isLoading, hasCheckedForcePassword, pathname, passwordChangeCompleted]);

  const handlePasswordChangeSuccess = async () => {
    console.log('🔄 Password changed successfully, refreshing user data...');
    // Refresh user data untuk mendapatkan data terbaru
    await checkAuth();
    setShowChangePasswordModal(false);
    // Set flag bahwa password change sudah selesai
    setPasswordChangeCompleted(true);
    console.log('✅ Password change completed, modal closed');
  };

  // Jika masih loading dan bukan di halaman publik, tampilkan loading
  if (isLoading && !publicPages.includes(pathname)) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      <ChangePasswordModal 
        isOpen={showChangePasswordModal} 
        onSuccess={handlePasswordChangeSuccess}
      />
    </>
  );
} 