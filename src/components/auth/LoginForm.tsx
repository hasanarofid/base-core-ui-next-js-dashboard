'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Lock, Mail, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'

const loginSchema = z.object({
  email: z.string().min(1, 'Email atau username harus diisi'),
  password: z.string().min(1, 'Password harus diisi'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const { login } = useAuth()
  const { showToast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError('')

    try {
      await login(data.email, data.password)
      showToast({
        type: 'success',
        title: 'Login Berhasil',
        message: 'Selamat datang kembali!'
      })
      // Redirect sudah ditangani di AuthContext
    } catch (error: unknown) {
      console.error('Login error:', error)
      
      let errorMessage = 'Terjadi kesalahan saat login'
      
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { 
          response?: { 
            data?: { message?: string },
            status?: number 
          } 
        }
        if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message
        } else if (apiError.response?.status === 401) {
          errorMessage = 'Email atau password salah'
        } else if (apiError.response?.status === 500) {
          errorMessage = 'Server error, silakan coba lagi nanti'
        } else if (apiError.response?.status === 0) {
          errorMessage = 'Tidak dapat terhubung ke server'
        }
      }
      
      setError(errorMessage)
      showToast({
        type: 'error',
        title: 'Login Gagal',
        message: errorMessage
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner">
              <Loader2 className="spinner-icon" />
            </div>
            <h4>Sedang masuk...</h4>
            <p>Mohon tunggu sebentar</p>
          </div>
        </div>
      )}
      
      <div className="login-wrapper">
        <div className="login-container">
          <div className="login-form-wrapper">
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
              <h3>Selamat Datang! 👋</h3>
              <p>Masuk ke akun Anda untuk mengelola tenant</p>
            </div>

            {/* Login Form */}
            <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
              {/* Error Alert */}
              {error && (
                <div className="error-alert">
                  <svg className="error-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email">Email atau Username</label>
                <div className="input-group">
                  <span className="input-icon">
                    <Mail className="icon" />
                  </span>
                  <input
                    type="text"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    id="email"
                    {...register('email')}
                    placeholder="Masukkan email atau username"
                    autoFocus
                  />
                </div>
                {errors.email && (
                  <div className="error-text">{errors.email.message}</div>
                )}
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-group">
                  <span className="input-icon">
                    <Lock className="icon" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    id="password"
                    {...register('password')}
                    placeholder="Masukkan password"
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
                {errors.password && (
                  <div className="error-text">{errors.password.message}</div>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="form-options">
                <div className="checkbox-group">
                  <input
                    className="checkbox"
                    type="checkbox"
                    id="remember-me"
                  />
                  <label htmlFor="remember-me">Ingat saya</label>
                </div>
                <Link href="/forgot-password" className="forgot-link">
                  Lupa password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="login-button"
              >
                {isLoading ? (
                  <div className="button-content">
                    <Loader2 className="spinner" />
                    Sedang masuk...
                  </div>
                ) : (
                  'Masuk ke Sistem'
                )}
              </button>
            </form>

            {/* Register Link */}
            <p className="register-link">
              <span>Belum punya akun? </span>
              <Link href="/register">Daftar sekarang</Link>
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

        .login-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 1rem;
        }
        
        .login-container {
          width: 100%;
          max-width: 400px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .login-form-wrapper {
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
        
        .login-form {
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
        
        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .checkbox {
          width: 1rem;
          height: 1rem;
          border: 1px solid #d1d5db;
          border-radius: 4px;
        }
        
        .checkbox-group label {
          font-size: 0.875rem;
          color: #374151;
          margin: 0;
        }
        
        .forgot-link {
          font-size: 0.875rem;
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
        }
        
        .forgot-link:hover {
          color: #5a6fd8;
        }
        
        .login-button {
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
        
        .login-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }
        
        .login-button:disabled {
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
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @media (max-width: 480px) {
          .login-wrapper {
            padding: 0.5rem;
          }
          
          .login-form-wrapper {
            padding: 1.5rem;
          }
          
          .login-container {
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
  )
} 