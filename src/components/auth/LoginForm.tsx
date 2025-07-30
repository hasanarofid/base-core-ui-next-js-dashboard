'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Lock, Mail, Eye, EyeOff, Loader2, Building, Shield, Users } from 'lucide-react';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'

const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
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
      router.push('/dashboard')
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

        {/* Right Section - Login Form */}
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
              <h3>Selamat Datang! 👋</h3>
              <p>Masuk ke akun Anda untuk mengelola tenant</p>
            </div>

            {/* Login Form */}
            <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
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

              {/* Sign In Button */}
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
                
            {/* Divider */}
            {/* <div className="divider">
              <span>atau</span>
            </div> */}

            {/* Create Account Link */}
            <p className="register-link">
              <span>Belum punya akun? </span>
              <Link href="/register">Daftar sekarang</Link>
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
          padding: 1.5rem;
        }
        
        .auth-header {
          margin-bottom: 1.5rem;
        }
        
        .auth-icon {
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.75rem;
        }
        
        .auth-header h1 {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 0.25rem;
        }
        
        .auth-header p {
          font-size: 1.25rem;
          opacity: 0.9;
        }
        
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          max-width: 300px;
          margin: 0 auto;
        }
        
        .feature-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(4px);
          border-radius: 6px;
          padding: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .feature-icon {
          width: 24px;
          height: 24px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.25rem;
        }
        
        .feature-card h3 {
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 0.125rem;
        }
        
        .feature-card p {
          font-size: 1rem;
          opacity: 0.8;
        }
        
        .auth-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }
        
        .login-form-container {
          width: 100%;
          max-width: 400px;
        }
        
        .app-brand {
          text-align: center;
          margin-bottom: 1rem;
        }
        
        .app-brand-link {
          display: inline-flex;
          align-items: center;
          gap: 1rem;
          text-decoration: none;
          color: inherit;
        }
        
        .app-brand-logo {
          display: flex;
          align-items: center;
        }
        
        .logo-image {
          border-radius: 4px;
          object-fit: cover;
        }
        
        .app-brand-text {
          font-size: 1.5rem;
          font-weight: bold;
          color: #333;
        }
        
        .welcome-text {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        
        .welcome-text h3 {
          font-size: 1.5rem;
          font-weight: bold;
          color: #333;
          margin-bottom: 0.125rem;
        }
        
        .welcome-text p {
          font-size: 1rem;
          color: #666;
        }
        
        .login-form {
          margin-bottom: 0.75rem;
        }
        
        .error-alert {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 0.5rem;
          border-radius: 4px;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
        }
        
        .error-icon {
          width: 0.875rem;
          height: 0.875rem;
          flex-shrink: 0;
        }
        
        .form-group {
          margin-bottom: 0.75rem;
        }
        
        .form-group label {
          display: block;
          font-size: 0.75rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.25rem;
        }
        
        .input-group {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .input-icon {
          position: absolute;
          left: 0.5rem;
          display: flex;
          align-items: center;
          color: #6b7280;
          z-index: 10;
        }
        
        .form-input {
          width: 100%;
          padding: 0.5rem 0.5rem 0.5rem 2rem;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 0.75rem;
          background: white;
          transition: all 0.2s;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
        }
        
        .form-input.error {
          border-color: #dc2626;
        }
        
        .password-toggle {
          position: absolute;
          right: 0.5rem;
          display: flex;
          align-items: center;
          color: #6b7280;
          cursor: pointer;
          z-index: 10;
        }
        
        .password-toggle:hover {
          color: #374151;
        }
        
        .error-text {
          color: #dc2626;
          font-size: 0.625rem;
          margin-top: 0.125rem;
        }
        
        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }
        
        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        
        .checkbox {
          width: 0.875rem;
          height: 0.875rem;
          border: 1px solid #d1d5db;
          border-radius: 2px;
        }
        
        .checkbox-group label {
          font-size: 0.75rem;
          color: #374151;
          margin: 0;
        }
        
        .forgot-link {
          font-size: 0.75rem;
          color: #667eea;
          text-decoration: none;
        }
        
        .forgot-link:hover {
          color: #5a6fd8;
        }
        
        .login-button {
          width: 100%;
          padding: 0.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .login-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
          transform: translateY(-1px);
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
          margin: 0.75rem 0;
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
          padding: 0 0.75rem;
          color: #6b7280;
          font-size: 0.75rem;
        }
        
        .register-link {
          text-align: center;
          font-size: 0.75rem;
          color: #6b7280;
          margin: 0;
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
          width: 0.875rem;
          height: 0.875rem;
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
          }
          
          .login-form-container {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  )
} 