'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, ArrowRight, Building, Shield, Users, Loader2 } from 'lucide-react';
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

      if (!response.ok) {
        throw new Error(result.message || 'Terjadi kesalahan saat mengirim email reset password');
      }

      // Tampilkan splash success
      Swal.fire({
        title: "Email Terkirim!",
        text: "Silakan cek email Anda untuk instruksi reset password",
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
      console.error('Error sending forgot password email:', error);
      
      // Tampilkan splash error
      if (error instanceof Error) {
        Swal.fire({
          title: "Error!",
          text: error.message,
          icon: "error",
          confirmButtonColor: "#dc3545",
          timer: 5000,
          timerProgressBar: true
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Terjadi kesalahan yang tidak diketahui",
          icon: "error",
          confirmButtonColor: "#dc3545",
          timer: 5000,
          timerProgressBar: true
        });
      }
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

        {/* Right Section - Forgot Password Form */}
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
              <h3>Lupa Password? 🔐</h3>
              <p>Masukkan email Anda untuk reset password</p>
            </div>

            {/* Forgot Password Form */}
            <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
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
                    placeholder="john@example.com"
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
                className="login-button"
              >
                {loading ? (
                  <div className="button-content">
                    <Loader2 className="spinner" />
                    Mengirim Email...
                  </div>
                ) : (
                  <div className="button-content">
                    Kirim Email Reset
                    <ArrowRight className="icon" />
                  </div>
                )}
              </button>
            </form>
                
            {/* Divider */}
            {/* <div className="divider">
              <span>atau</span>
            </div> */}

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
        
        .auth-icon .icon {
          width: 2.5rem;
          height: 2.5rem;
          color: white;
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
          background: white;
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
        
        .divider {
          text-align: center;
          margin: 1rem 0;
          position: relative;
        }
        
        .divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #e5e7eb;
        }
        
        .divider span {
          background: white;
          padding: 0 1rem;
          color: #6b7280;
          font-size: 0.875rem;
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