'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
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

      if (response.ok) {
        await Swal.fire({
          title: 'Password Berhasil Diubah!',
          text: 'Password Anda telah berhasil diubah. Silakan login dengan password baru.',
          icon: 'success',
          confirmButtonText: 'OK'
        });

        reset();
        router.push('/login');
      } else {
        throw new Error(result.message || 'Terjadi kesalahan saat reset password');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      
      let errorMessage = 'Terjadi kesalahan saat reset password';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      
      await Swal.fire({
        title: 'Gagal!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner">
              <Loader2 className="spinner-icon" />
            </div>
            <h4>Mengubah password...</h4>
            <p>Mohon tunggu sebentar</p>
          </div>
        </div>
      )}
      
      <div className="reset-wrapper">
        <div className="reset-container">
          <div className="reset-form-wrapper">
            {/* Logo */}
            <div className="app-brand">
              <Link href="/" className="app-brand-link">
                <div className="app-brand-logo">
                  <Image
                    src="/logo.jpeg"
                    alt="Innovia Logo"
                    width={32}
                    height={32}
                    className="logo-image"
                    priority
                  />
                </div>
                <span className="app-brand-text">Innovia</span>
              </Link>
            </div>

            {/* Welcome Text */}
            <div className="welcome-text">
              <h3>Reset Password 🔐</h3>
              <p>Masukkan password baru untuk akun Anda</p>
            </div>

            {/* Reset Password Form */}
            <form className="reset-form" onSubmit={handleSubmit(onSubmit)}>
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
                className="reset-button"
              >
                {loading ? (
                  <div className="button-content">
                    <Loader2 className="spinner" />
                    Mengubah password...
                  </div>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
                
            {/* Login Link */}
            <p className="login-link">
              <span>Ingat password? </span>
              <Link href="/login">Masuk di sini</Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        
        .loading-content {
          text-align: center;
          color: white;
        }
        
        .loading-spinner {
          margin-bottom: 1rem;
        }
        
        .spinner-icon {
          width: 3rem;
          height: 3rem;
          animation: spin 1s linear infinite;
        }
        
        .loading-content h4 {
          margin-bottom: 0.5rem;
          font-size: 1.25rem;
          font-weight: 600;
        }
        
        .loading-content p {
          margin: 0;
          opacity: 0.8;
          font-size: 0.875rem;
        }

        .reset-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 1rem;
        }
        
        .reset-container {
          width: 100%;
          max-width: 400px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .reset-form-wrapper {
          padding: 2rem;
        }
        
        .app-brand {
          text-align: center;
          margin-bottom: 1.5rem;
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
          margin-bottom: 1.5rem;
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
          margin: 0;
        }
        
        .reset-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .error-alert {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #ef4444;
          padding: 0.75rem;
          border-radius: 8px;
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
        
        .input-icon .icon {
          width: 1rem;
          height: 1rem;
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
        
        .password-toggle .icon {
          width: 1rem;
          height: 1rem;
        }
        
        .password-toggle:hover {
          color: #6b7280;
        }
        
        .error-text {
          color: #ef4444;
          font-size: 0.75rem;
        }
        
        .reset-button {
          width: 100%;
          padding: 0.875rem 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        
        .reset-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }
        
        .reset-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
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
        
        .login-link {
          text-align: center;
          font-size: 0.875rem;
          color: #6b7280;
          margin: 1rem 0 0 0;
        }
        
        .login-link a {
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
        }
        
        .login-link a:hover {
          color: #5a6fd8;
        }
        
        .icon {
          width: 1rem;
          height: 1rem;
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @media (max-width: 480px) {
          .reset-wrapper {
            padding: 0.5rem;
          }
          
          .reset-form-wrapper {
            padding: 1.5rem;
          }
          
          .reset-container {
            border-radius: 8px;
          }
          
          .welcome-text h3 {
            font-size: 1.25rem;
          }
          
          .app-brand-text {
            font-size: 1.125rem;
          }
        }
      `}</style>
    </>
  );
} 