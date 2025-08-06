'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Lock, Eye, EyeOff, Loader2, Building, Shield, Users } from 'lucide-react';
import Swal from 'sweetalert2';
import AuthGuard from '@/components/auth/AuthGuard';

const resetPasswordSchema = z.object({
  new_password: z.string().min(6, 'Password minimal 6 karakter'),
  confirm_password: z.string().min(6, 'Konfirmasi password minimal 6 karakter'),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Password tidak cocok",
  path: ["confirm_password"],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  return (
    <AuthGuard requireAuth={false} redirectTo="/dashboard">
      <ResetPasswordForm />
    </AuthGuard>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      new_password: '',
      confirm_password: ''
    }
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/reset-password/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: data.new_password
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Terjadi kesalahan saat reset password');
      }

      // Tampilkan splash success
      Swal.fire({
        title: "Password Berhasil Diubah!",
        text: "Password Anda telah berhasil diubah. Silakan login dengan password baru.",
        icon: "success",
        confirmButtonColor: "#28a745",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
      });

      // Reset form
      reset();
      
      // Redirect ke login setelah 3 detik
      setTimeout(() => {
        router.push('/login');
      }, 3000);

    } catch (error) {
      console.error('Error resetting password:', error);
      
      let errorMessage = 'Terjadi kesalahan saat reset password';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      
      // Tampilkan splash error
      Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#dc3545",
        timer: 5000,
        timerProgressBar: true
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* Left Section - Illustration */}
        <div className="auth-left">
          <div className="auth-bg">
            <div className="gradient-bg"></div>
            <div className="bg-element bg-element-1"></div>
            <div className="bg-element bg-element-2"></div>
            <div className="bg-element bg-element-3"></div>
            
            <div className="auth-content">
              <div className="auth-header">
                <div className="auth-icon">
                  <Building className="icon" />
                </div>
                <h1>Tenant System</h1>
                <p>Platform Manajemen Tenant Terdepan</p>
              </div>
              
              <div className="feature-grid">
                <div className="feature-card">
                  <div className="feature-icon">
                    <Building className="icon" />
                  </div>
                  <h3>Multi-Tenant</h3>
                  <p>Kelola multiple tenant</p>
                </div>
                
                <div className="feature-card">
                  <div className="feature-icon">
                    <Shield className="icon" />
                  </div>
                  <h3>Secure</h3>
                  <p>Keamanan data enterprise</p>
                </div>
                
                <div className="feature-card">
                  <div className="feature-icon">
                    <Users className="icon" />
                  </div>
                  <h3>Scalable</h3>
                  <p>Tumbuh bersama bisnis</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Reset Password Form */}
        <div className="auth-right">
          <div className="login-form-container">
            {/* Logo */}
            <div className="app-brand">
              <Link href="/" className="app-brand-link">
                <div className="app-brand-logo">
                  <Image
                    src="/logo.jpeg"
                    alt="Tenant System Logo"
                    width={32}
                    height={32}
                    className="logo-image"
                    priority
                  />
                </div>
                <span className="app-brand-text">Tenant System</span>
              </Link>
            </div>

            {/* Welcome Text */}
            <div className="welcome-text">
              <h3>Reset Password 🔐</h3>
              <p>Masukkan password baru untuk akun Anda</p>
            </div>

            {/* Reset Password Form */}
            <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
              {error && (
                <div className="error-alert">
                  <svg className="error-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              {/* New Password Field */}
              <div className="form-group">
                <label htmlFor="new_password">Password Baru</label>
                <div className="input-group">
                  <span className="input-icon">
                    <Lock className="icon" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`form-input ${errors.new_password ? 'error' : ''}`}
                    id="new_password"
                    {...register('new_password')}
                    placeholder="Masukkan password baru"
                    autoFocus
                  />
                  <span 
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="icon" />
                    ) : (
                      <Eye className="icon" />
                    )}
                  </span>
                </div>
                {errors.new_password && (
                  <div className="error-text">{errors.new_password.message}</div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="form-group">
                <label htmlFor="confirm_password">Konfirmasi Password</label>
                <div className="input-group">
                  <span className="input-icon">
                    <Lock className="icon" />
                  </span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`form-input ${errors.confirm_password ? 'error' : ''}`}
                    id="confirm_password"
                    {...register('confirm_password')}
                    placeholder="Konfirmasi password baru"
                  />
                  <span 
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="icon" />
                    ) : (
                      <Eye className="icon" />
                    )}
                  </span>
                </div>
                {errors.confirm_password && (
                  <div className="error-text">{errors.confirm_password.message}</div>
                )}
              </div>

              {/* Reset Password Button */}
              <button
                type="submit"
                disabled={loading}
                className="login-button"
              >
                {loading ? (
                  <div className="button-content">
                    <Loader2 className="spinner" />
                    Mengubah Password...
                  </div>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
                
            {/* Login Link */}
            <p className="register-link">
              <span>Ingat password? </span>
              <Link href="/login">Masuk di sini</Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-wrapper {
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .login-container {
          display: flex;
          width: 100%;
          height: 100%;
          max-width: 1000px;
          max-height: 700px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .auth-left {
          flex: 1;
          position: relative;
          display: none;
        }
        
        @media (min-width: 1024px) {
          .auth-left {
            display: block;
          }
        }
        
        .auth-bg {
          position: relative;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        
        .gradient-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .bg-element {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .bg-element-1 {
          top: 8%;
          left: 8%;
          width: 60px;
          height: 60px;
        }
        
        .bg-element-2 {
          top: 15%;
          right: 15%;
          width: 40px;
          height: 40px;
          animation-delay: 1s;
        }
        
        .bg-element-3 {
          bottom: 15%;
          left: 15%;
          width: 70px;
          height: 70px;
          animation-delay: 2s;
        }
        
        .auth-content {
          position: relative;
          z-index: 10;
          text-align: center;
          color: white;
          padding: 2rem;
          max-width: 400px;
        }
        
        .auth-header {
          margin-bottom: 2rem;
        }
        
        .auth-icon {
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          backdrop-filter: blur(10px);
        }
        
        .auth-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .auth-header p {
          font-size: 1.1rem;
          opacity: 0.9;
          margin-bottom: 2rem;
        }
        
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1rem;
          margin-top: 2rem;
        }
        
        .feature-card {
          background: rgba(255, 255, 255, 0.1);
          padding: 1rem;
          border-radius: 12px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .feature-icon {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.5rem;
        }
        
        .feature-icon .icon {
          width: 1.25rem;
          height: 1.25rem;
          color: white;
        }
        
        .feature-card h3 {
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: white;
        }
        
        .feature-card p {
          font-size: 0.75rem;
          opacity: 0.8;
          color: white;
        }
        
        .auth-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          overflow-y: auto;
          max-height: 100vh;
          scroll-behavior: smooth;
        }
        
        .auth-right::-webkit-scrollbar {
          width: 6px;
        }
        
        .auth-right::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        
        .auth-right::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        
        .auth-right::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
        
        .login-form-container {
          width: 100%;
          max-width: 400px;
          min-height: fit-content;
          padding: 1rem 0 2rem 0;
        }
        
        .app-brand {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .app-brand-link {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          color: #374151;
          font-weight: 600;
          font-size: 1.25rem;
        }
        
        .app-brand-logo {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .logo-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .app-brand-text {
          font-size: 1.25rem;
          font-weight: 600;
          color: #374151;
        }
        
        .welcome-text {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .welcome-text h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.5rem;
        }
        
        .welcome-text p {
          color: #6b7280;
          font-size: 0.875rem;
        }
        
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .error-alert {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #ef4444;
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }
        
        .error-icon {
          width: 0.875rem;
          height: 0.875rem;
          flex-shrink: 0;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .form-group label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }
        
        .input-group {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .input-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          z-index: 10;
        }
        
        .form-input {
          width: 100%;
          padding: 0.75rem 0.75rem 0.75rem 2.5rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.875rem;
          transition: all 0.2s;
          background: white;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .form-input.error {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
        
        .password-toggle {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          cursor: pointer;
          z-index: 10;
        }
        
        .password-toggle:hover {
          color: #6b7280;
        }
        
        .error-text {
          color: #ef4444;
          font-size: 0.75rem;
          margin-top: 0.25rem;
        }
        
        .login-button {
          width: 100%;
          padding: 0.75rem 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .login-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        
        .login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .button-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .spinner {
          animation: spin 1s linear infinite;
        }
        
        .register-link {
          text-align: center;
          font-size: 0.875rem;
          color: #6b7280;
          margin: 1rem 0 0 0;
        }
        
        .register-link a {
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
        }
        
        .register-link a:hover {
          color: #5a6fd8;
        }
        
        .icon {
          width: 1rem;
          height: 1rem;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @media (max-width: 1023px) {
          .login-container {
            max-height: none;
            border-radius: 0;
            box-shadow: none;
          }
          
          .auth-right {
            padding: 1rem;
            overflow-y: auto;
            max-height: 100vh;
          }
          
          .login-form-container {
            max-width: 100%;
            min-height: fit-content;
            padding: 1rem 0 2rem 0;
          }
          
          .auth-content {
            padding: 1rem;
          }
          
          .auth-header h1 {
            font-size: 2rem;
          }
          
          .auth-header p {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
} 