'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Swal from 'sweetalert2';
import AuthGuard from '@/components/auth/AuthGuard';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email harus valid'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  return (
    <AuthGuard requireAuth={false} redirectTo="/dashboard">
      <ForgotPasswordForm />
    </AuthGuard>
  );
}

function ForgotPasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setLoading(true);
    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email
        }),
      });

      const result = await response.json();

      if (response.ok) {
        await Swal.fire({
          title: 'Email Terkirim!',
          text: 'Silakan cek email Anda untuk instruksi reset password',
          icon: 'success',
          confirmButtonText: 'OK'
        });

        reset();
        router.push('/login');
      } else {
        throw new Error(result.message || 'Terjadi kesalahan saat mengirim email reset password');
      }
    } catch (error) {
      console.error('Error sending forgot password email:', error);
      
      let errorMessage = 'Terjadi kesalahan saat mengirim email reset password';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
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
            <h4>Mengirim email...</h4>
            <p>Mohon tunggu sebentar</p>
          </div>
        </div>
      )}
      
      <div className="forgot-wrapper">
        <div className="forgot-container">
          <div className="forgot-form-wrapper">
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
              <h3>Lupa Password? 🔐</h3>
              <p>Masukkan email Anda untuk reset password</p>
            </div>

            {/* Forgot Password Form */}
            <form className="forgot-form" onSubmit={handleSubmit(onSubmit)}>
              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-group">
                  <span className="input-icon">
                    <Mail className="icon" />
                  </span>
                  <input
                    type="email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    id="email"
                    {...register('email')}
                    placeholder="Masukkan email Anda"
                    autoFocus
                  />
                </div>
                {errors.email && (
                  <div className="error-text">{errors.email.message}</div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="forgot-button"
              >
                {loading ? (
                  <div className="button-content">
                    <Loader2 className="spinner" />
                    Mengirim email...
                  </div>
                ) : (
                  'Kirim Email Reset'
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

        .forgot-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 1rem;
        }
        
        .forgot-container {
          width: 100%;
          max-width: 400px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .forgot-form-wrapper {
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
        
        .forgot-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
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
        
        .error-text {
          color: #ef4444;
          font-size: 0.75rem;
        }
        
        .forgot-button {
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
        
        .forgot-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }
        
        .forgot-button:disabled {
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
          .forgot-wrapper {
            padding: 0.5rem;
          }
          
          .forgot-form-wrapper {
            padding: 1.5rem;
          }
          
          .forgot-container {
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