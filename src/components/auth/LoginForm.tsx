'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, Mail, Lock, User } from 'lucide-react'
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
      // Redirect ke dashboard
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
    <div className="authentication-wrapper authentication-cover authentication-bg">
      <div className="authentication-inner row">
        {/* Left Section - Illustration */}
        <div className="d-none d-lg-flex col-lg-7 p-0">
          <div className="auth-cover-bg auth-cover-bg-color d-flex justify-content-center align-items-center">
            <Image
              src="/images/auth-login-illustration-light.png"
              alt="auth-login-cover"
              width={500}
              height={500}
              className="img-fluid my-5 auth-illustration"
              priority
            />
            
            <Image
              src="/images/bg-shape-image-light.png"
              alt="auth-login-cover"
              fill
              className="platform-bg"
            />
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="d-flex col-12 col-lg-5 align-items-center p-sm-5 p-4">
          <div className="w-px-400 mx-auto">
            {/* Logo */}
            <div className="app-brand mb-4">
              <Link href="/" className="app-brand-link gap-2">
                <span className="app-brand-logo demo">
                  <svg width="32" height="22" viewBox="0 0 32 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z"
                      fill="#7367F0" />
                    <path
                      opacity="0.06"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z"
                      fill="#161616" />
                    <path
                      opacity="0.06"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z"
                      fill="#161616" />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z"
                      fill="#7367F0" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Welcome Text */}
            <h3 className="mb-1 fw-bold">Welcome to Vuexy! 👋</h3>
            <p className="mb-4">Please sign-in to your account and start the adventure</p>

            {/* Login Form */}
            <form id="formAuthentication" className="mb-3" onSubmit={handleSubmit(onSubmit)}>
              {error && (
                <div className="alert alert-danger mb-3">
                  {error}
                </div>
              )}

              {/* Input Group Container */}
              <div className="input-group-container">
                                 {/* Email Field Group */}
                 <div className="input-group mb-3">
                   <span className="input-group-text">
                     <Mail className="h-4 w-4" />
                   </span>
                   <div className="form-floating flex-grow-1">
                     <input
                       type="text"
                       className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                       id="email"
                       {...register('email')}
                       placeholder=""
                       autoFocus
                     />
                     <label htmlFor="email">Email or Username</label>
                     {errors.email && (
                       <div className="invalid-feedback">{errors.email.message}</div>
                     )}
                   </div>
                 </div>

                 {/* Password Field Group */}
                 <div className="input-group mb-3">
                   <span className="input-group-text">
                     <Lock className="h-4 w-4" />
                   </span>
                   <div className="form-floating flex-grow-1">
                     <input
                       type={showPassword ? 'text' : 'password'}
                       className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                       id="password"
                       {...register('password')}
                       placeholder=""
                     />
                     <label htmlFor="password">Password</label>
                     {errors.password && (
                       <div className="invalid-feedback">{errors.password.message}</div>
                     )}
                   </div>
                   <span className="input-group-text cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                     {showPassword ? (
                       <EyeOff className="h-4 w-4" />
                     ) : (
                       <Eye className="h-4 w-4" />
                     )}
                   </span>
                 </div>

                {/* Forgot Password Link */}
                <div className="text-end mb-3">
                  <Link href="/forgot-password" className="text-decoration-none">
                    <small>Forgot Password?</small>
                  </Link>
                </div>
              </div>

              {/* Remember Me */}
              <div className="mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="remember-me"
                  />
                  <label className="form-check-label" htmlFor="remember-me">
                    Remember Me
                  </label>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary d-grid w-100"
              >
                {isLoading ? (
                  <div className="d-flex align-items-center justify-content-center">
                    <Loader2 className="animate-spin me-2 h-4 w-4" />
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            {/* Create Account Link */}
            <p className="text-center">
              <span>New on our platform?</span>
              <Link href="/register">
                <span>Create an account</span>
              </Link>
            </p>

            {/* Divider */}
            <div className="divider my-4">
              <div className="divider-text">or</div>
            </div>

            {/* Social Login */}
            <div className="d-flex justify-content-center">
              <a href="javascript:;" className="btn btn-icon btn-label-facebook me-3">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              <a href="javascript:;" className="btn btn-icon btn-label-google-plus me-3">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </a>

              <a href="javascript:;" className="btn btn-icon btn-label-twitter">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .input-group-container {
          background: #f8f9fa;
          border-radius: 0.5rem;
          padding: 1.5rem;
          margin-bottom: 1rem;
        }
        
        .input-group {
          border: none;
          background: transparent;
        }
        
        .input-group-text {
          background: #e9ecef;
          border: 1px solid #ced4da;
          border-right: none;
          color: #6c757d;
          padding: 0.75rem 1rem;
          transition: border-color 0.2s ease-in-out, background-color 0.2s ease-in-out;
        }
        
        .input-group:focus-within .input-group-text {
          border-color: #7367F0;
          background-color: #f8f9ff;
        }
        
        .form-floating {
          position: relative;
        }
        
        .form-floating > .form-control {
          height: calc(3.5rem + 2px);
          line-height: 1.25;
          padding: 1rem 0.75rem;
          border: 1px solid #ced4da;
          border-left: none;
          border-radius: 0 0.375rem 0.375rem 0;
          transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        
        .form-floating > .form-control:focus {
          border-color: #7367F0;
          box-shadow: 0 0 0 0.2rem rgba(115, 103, 240, 0.25);
          outline: none;
        }
        
        .form-floating > label {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          padding: 1rem 0.75rem;
          pointer-events: none;
          border: 1px solid transparent;
          transform-origin: 0 0;
          transition: all 0.2s ease-in-out;
          color: #6c757d;
          font-size: 1rem;
        }
        
        .form-floating > .form-control:focus,
        .form-floating > .form-control:not(:placeholder-shown) {
          padding-top: 1.625rem;
          padding-bottom: 0.625rem;
        }
        
        .form-floating > .form-control:focus ~ label,
        .form-floating > .form-control:not(:placeholder-shown) ~ label {
          opacity: 0.75;
          transform: scale(0.85) translateY(-0.5rem) translateX(0.15rem);
          color: #7367F0;
          font-weight: 500;
        }
        
        .input-group:last-child .input-group-text:last-child {
          border-radius: 0 0.375rem 0.375rem 0;
          border-left: none;
        }
        
        .input-group:last-child .form-floating > .form-control {
          border-radius: 0;
          border-left: none;
        }
        
        .cursor-pointer {
          cursor: pointer;
        }
        
        .cursor-pointer:hover {
          background-color: #dee2e6;
        }
      `}</style>
    </div>
  )
} 