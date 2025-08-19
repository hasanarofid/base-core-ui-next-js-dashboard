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
      // Clear session storage flags
      const keys = Object.keys(sessionStorage);
      keys.forEach(key => {
        if (key.startsWith('passwordChanged_')) {
          sessionStorage.removeItem(key);
        }
      });
      console.log('🧹 Cleared password change flags from session storage');
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

    // Cek apakah user sudah berhasil mengubah password dalam session ini
    const hasChangedPasswordInSession = sessionStorage.getItem(`passwordChanged_${user?.id}`);
    if (hasChangedPasswordInSession === 'true') {
      console.log('✅ User has already changed password in this session');
      setPasswordChangeCompleted(true);
      setHasCheckedForcePassword(true);
      return;
    }

    // Jika ada user dan belum dicek
    if (user && !hasCheckedForcePassword) {
      console.log('🔍 ForcePasswordChangeGuard: Checking user conditions');
      console.log('🔍 User role:', user.role);
      console.log('🔍 Force password change:', user.force_password_change);
      console.log('🔍 Current pathname:', pathname);
      console.log('🔍 Session storage flag:', sessionStorage.getItem(`passwordChanged_${user.id}`));
      
      // PERBAIKAN LOGIKA: 
      // forcePasswordChange = true berarti sudah berhasil ganti password (TIDAK perlu tampil modal)
      // forcePasswordChange = false berarti belum ganti password (PERLU tampil modal)
      if ((user.role === 'admin_tenant' || user.role === 'tenant_admin') && user.force_password_change === false) {
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
    console.log('🔄 Password changed successfully, updating session...');
    
    // Set flag bahwa password change sudah selesai SEBELUM refresh data
    setPasswordChangeCompleted(true);
    setShowChangePasswordModal(false);
    
    // Simpan flag di sessionStorage untuk mencegah modal muncul lagi
    if (user?.id) {
      sessionStorage.setItem(`passwordChanged_${user.id}`, 'true');
      console.log('💾 Password change flag saved to session storage');
    }
    
    // PERBAIKAN: Refresh data user untuk mendapatkan data terbaru dari backend
    // Ini penting untuk memastikan forcePasswordChange sudah berubah menjadi true
    try {
      console.log('🔄 Refreshing user data to get updated forcePasswordChange status...');
      await checkAuth();
      console.log('✅ User data refreshed successfully');
      
      // PERBAIKAN: Cek apakah forcePasswordChange sudah berubah menjadi true
      console.log('ℹ️ Checking if backend has updated forcePasswordChange status...');
    } catch (error) {
      console.error('❌ Error refreshing user data:', error);
    }
    
    console.log('✅ Password change completed, modal closed');
    console.log('ℹ️ Note: Backend should now show forcePasswordChange: true');
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