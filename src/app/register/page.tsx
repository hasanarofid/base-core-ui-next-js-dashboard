'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Mail, Lock, User, Loader2, Building, Globe, Phone, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import Swal from 'sweetalert2';
import AuthGuard from '@/components/auth/AuthGuard';

const registerSchema = z.object({
  name: z.string().min(1, 'Nama tenant harus diisi'),
  logo_url: z.string().url('URL logo harus valid'),
  domain: z.string().url('Domain harus valid'),
  email: z.string().email('Email harus valid'),
  contact_person: z.string().min(1, 'Kontak person harus diisi')
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  return (
    <AuthGuard requireAuth={false} redirectTo="/dashboard">
      <RegisterForm />
    </AuthGuard>
  );
}

function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      logo_url: '',
      domain: '',
      email: '',
      contact_person: ''
    }
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    setErrorMessage(''); // Clear previous error
    
    try {
      const response = await fetch('/api/tenants/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        await Swal.fire({
          title: 'Berhasil!',
          text: 'Tenant berhasil dibuat! Email konfirmasi telah dikirim untuk aktivasi akun.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        
        reset();
        setErrorMessage('');
        router.push('/login');
      } else {
        // Tampilkan error di atas form, bukan popup
        setErrorMessage(result.message || 'Gagal mendaftarkan tenant baru');
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMsg = 'Terjadi kesalahan saat mendaftar tenant';
      if (error instanceof Error) {
        errorMsg = error.message;
      }
      
      // Tampilkan error di atas form
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

      
      <div className="register-wrapper">
        <div className="register-container">
          <div className="register-form-wrapper">
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
              <h3>Daftar Tenant Baru 🏢</h3>
              <p>Silakan isi informasi tenant Anda untuk memulai</p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="error-message">
                {errorMessage}
              </div>
            )}

            {/* Register Form */}
            <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
              {/* Tenant Name Field */}
              <div className="form-group">
                <label htmlFor="name">Nama Tenant</label>
                <div className="input-group">
                  <span className="input-icon">
                    <Building className="icon" />
                  </span>
                  <input
                    type="text"
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    id="name"
                    {...register('name')}
                    placeholder="Masukkan nama tenant"
                    autoFocus
                  />
                </div>
                {errors.name && (
                  <div className="error-text">{errors.name.message}</div>
                )}
              </div>

              {/* Logo URL Field */}
              <div className="form-group">
                <label htmlFor="logo_url">URL Logo</label>
                <div className="input-group">
                  <span className="input-icon">
                    <ImageIcon className="icon" />
                  </span>
                  <input
                    type="url"
                    className={`form-input ${errors.logo_url ? 'error' : ''}`}
                    id="logo_url"
                    {...register('logo_url')}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                {errors.logo_url && (
                  <div className="error-text">{errors.logo_url.message}</div>
                )}
              </div>

              {/* Domain Field */}
              <div className="form-group">
                <label htmlFor="domain">Domain</label>
                <div className="input-group">
                  <span className="input-icon">
                    <Globe className="icon" />
                  </span>
                  <input
                    type="url"
                    className={`form-input ${errors.domain ? 'error' : ''}`}
                    id="domain"
                    {...register('domain')}
                    placeholder="https://yourdomain.com"
                  />
                </div>
                {errors.domain && (
                  <div className="error-text">{errors.domain.message}</div>
                )}
              </div>

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
                    placeholder="admin@yourdomain.com"
                  />
                </div>
                {errors.email && (
                  <div className="error-text">{errors.email.message}</div>
                )}
              </div>

              {/* Contact Person Field */}
              <div className="form-group">
                <label htmlFor="contact_person">Kontak Person</label>
                <div className="input-group">
                  <span className="input-icon">
                    <Phone className="icon" />
                  </span>
                  <input
                    type="text"
                    className={`form-input ${errors.contact_person ? 'error' : ''}`}
                    id="contact_person"
                    {...register('contact_person')}
                    placeholder="082391782895"
                  />
                </div>
                {errors.contact_person && (
                  <div className="error-text">{errors.contact_person.message}</div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="register-button"
              >
                {loading ? (
                  <div className="button-content">
                    <Loader2 className="spinner" />
                    Sedang membuat tenant...
                  </div>
                ) : (
                  'Daftar Tenant'
                )}
              </button>
            </form>

            {/* Login Link */}
            <p className="login-link">
              <span>Sudah punya akun? </span>
              <Link href="/login">Masuk di sini</Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Pastikan SweetAlert memiliki z-index yang lebih tinggi */
        .swal2-container {
          z-index: 10000 !important;
        }

        .register-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 1rem;
        }
        
        .register-container {
          width: 100%;
          max-width: 400px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .register-form-wrapper {
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
        
        .register-form {
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
        
        .error-message {
          color: #ef4444;
          font-size: 0.875rem;
          margin-bottom: 1rem;
          text-align: center;
          padding: 0.75rem;
          background-color: #fef3f2;
          border: 1px solid #fcd3c7;
          border-radius: 8px;
        }
        
        .register-button {
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
        
        .register-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }
        
        .register-button:disabled {
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
          .register-wrapper {
            padding: 0.5rem;
          }
          
          .register-form-wrapper {
            padding: 1.5rem;
          }
          
          .register-container {
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