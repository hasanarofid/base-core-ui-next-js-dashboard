'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Swal from 'sweetalert2';

const changePasswordSchema = z.object({
  new_password: z.string().min(6, 'Password minimal 6 karakter'),
  confirm_password: z.string().min(6, 'Konfirmasi password minimal 6 karakter'),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Password tidak cocok",
  path: ["confirm_password"],
});

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

interface ChangePasswordModalProps {
  isOpen: boolean;
  onSuccess: () => void;
}

export default function ChangePasswordModal({ isOpen, onSuccess }: ChangePasswordModalProps) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      new_password: '',
      confirm_password: ''
    }
  });

  useEffect(() => {
    if (isOpen) {
      showChangePasswordModal();
    }
  }, [isOpen]);

  const showChangePasswordModal = () => {
    Swal.fire({
      title: 'Ganti Password Wajib',
      html: `
        <div class="text-start">
          <p class="text-muted mb-4">Sebagai Admin Tenant, Anda harus mengganti password terlebih dahulu sebelum dapat mengakses sistem.</p>
          
          <form id="changePasswordForm">
            <div class="mb-3">
              <label class="form-label" for="currentPassword">Password Saat Ini</label>
              <div class="input-group input-group-merge">
                <input
                  type="password"
                  id="currentPassword"
                  class="form-control"
                  placeholder="Masukkan password saat ini"
                  required
                />
                <span class="input-group-text cursor-pointer" id="toggleCurrentPassword">
                  <i class="ti ti-eye-off"></i>
                </span>
              </div>
              <div class="invalid-feedback" id="currentPasswordError"></div>
            </div>
            
            <div class="mb-3">
              <label class="form-label" for="newPassword">Password Baru</label>
              <div class="input-group input-group-merge">
                <input
                  type="password"
                  id="newPassword"
                  class="form-control"
                  placeholder="Masukkan password baru"
                  required
                />
                <span class="input-group-text cursor-pointer" id="toggleNewPassword">
                  <i class="ti ti-eye-off"></i>
                </span>
              </div>
              <div class="invalid-feedback" id="newPasswordError"></div>
            </div>
            
            <div class="mb-3">
              <label class="form-label" for="confirmPassword">Konfirmasi Password</label>
              <div class="input-group input-group-merge">
                <input
                  type="password"
                  id="confirmPassword"
                  class="form-control"
                  placeholder="Konfirmasi password baru"
                  required
                />
                <span class="input-group-text cursor-pointer" id="toggleConfirmPassword">
                  <i class="ti ti-eye-off"></i>
                </span>
              </div>
              <div class="invalid-feedback" id="confirmPasswordError"></div>
            </div>
          </form>
        </div>
      `,
      showCancelButton: false,
      showCloseButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonText: 'Ganti Password',
      confirmButtonColor: '#696cff',
      showLoaderOnConfirm: true,
      customClass: {
        popup: 'change-password-modal'
      },
      didOpen: () => {
        // Tambahkan class ke body untuk mengidentifikasi modal change password
        document.body.setAttribute('data-change-password-modal', 'true');
        
        // Tambahkan class ke modal container
        const modalContainer = document.querySelector('.swal2-container');
        if (modalContainer) {
          modalContainer.setAttribute('data-change-password-modal', 'true');
        }
        
        // Event listeners untuk toggle password visibility
        const toggleCurrentPassword = document.getElementById('toggleCurrentPassword');
        const toggleNewPassword = document.getElementById('toggleNewPassword');
        const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
        const currentPasswordInput = document.getElementById('currentPassword') as HTMLInputElement;
        const newPasswordInput = document.getElementById('newPassword') as HTMLInputElement;
        const confirmPasswordInput = document.getElementById('confirmPassword') as HTMLInputElement;

        if (toggleCurrentPassword && currentPasswordInput) {
          toggleCurrentPassword.addEventListener('click', () => {
            const type = currentPasswordInput.type === 'password' ? 'text' : 'password';
            currentPasswordInput.type = type;
            const icon = toggleCurrentPassword.querySelector('i');
            if (icon) {
              icon.className = type === 'password' ? 'ti ti-eye-off' : 'ti ti-eye';
            }
          });
        }

        if (toggleNewPassword && newPasswordInput) {
          toggleNewPassword.addEventListener('click', () => {
            const type = newPasswordInput.type === 'password' ? 'text' : 'password';
            newPasswordInput.type = type;
            const icon = toggleNewPassword.querySelector('i');
            if (icon) {
              icon.className = type === 'password' ? 'ti ti-eye-off' : 'ti ti-eye';
            }
          });
        }

        if (toggleConfirmPassword && confirmPasswordInput) {
          toggleConfirmPassword.addEventListener('click', () => {
            const type = confirmPasswordInput.type === 'password' ? 'text' : 'password';
            confirmPasswordInput.type = type;
            const icon = toggleConfirmPassword.querySelector('i');
            if (icon) {
              icon.className = type === 'password' ? 'ti ti-eye-off' : 'ti ti-eye';
            }
          });
        }
      },
      willClose: () => {
        // Hapus class dari body saat modal ditutup
        document.body.removeAttribute('data-change-password-modal');
        
        // Hapus class dari modal container
        const modalContainer = document.querySelector('.swal2-container');
        if (modalContainer) {
          modalContainer.removeAttribute('data-change-password-modal');
        }
      },
      preConfirm: async () => {
        const currentPassword = (document.getElementById('currentPassword') as HTMLInputElement)?.value;
        const newPassword = (document.getElementById('newPassword') as HTMLInputElement)?.value;
        const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement)?.value;
        
        // Reset error messages
        const currentPasswordError = document.getElementById('currentPasswordError');
        const newPasswordError = document.getElementById('newPasswordError');
        const confirmPasswordError = document.getElementById('confirmPasswordError');
        if (currentPasswordError) currentPasswordError.textContent = '';
        if (newPasswordError) newPasswordError.textContent = '';
        if (confirmPasswordError) confirmPasswordError.textContent = '';
        
        // Validation
        if (!currentPassword) {
          if (currentPasswordError) currentPasswordError.textContent = 'Password saat ini harus diisi';
          return false;
        }
        
        if (!newPassword) {
          if (newPasswordError) newPasswordError.textContent = 'Password baru harus diisi';
          return false;
        }
        
        if (newPassword.length < 6) {
          if (newPasswordError) newPasswordError.textContent = 'Password minimal 6 karakter';
          return false;
        }
        
        if (!confirmPassword) {
          if (confirmPasswordError) confirmPasswordError.textContent = 'Konfirmasi password harus diisi';
          return false;
        }
        
        if (newPassword !== confirmPassword) {
          if (confirmPasswordError) confirmPasswordError.textContent = 'Konfirmasi password tidak cocok';
          return false;
        }
        
        if (currentPassword === newPassword) {
          if (newPasswordError) newPasswordError.textContent = 'Password baru tidak boleh sama dengan password saat ini';
          return false;
        }
        
        try {
          const response = await fetch('/api/change-password', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              currentPassword: currentPassword,
              newPassword: newPassword
            }),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Gagal mengubah password');
          }
          
          return true;
        } catch (error) {
          Swal.showValidationMessage(`Gagal mengubah password: ${error instanceof Error ? error.message : 'Unknown error'}`);
          return false;
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Berhasil!',
          text: 'Password berhasil diubah. Anda akan diarahkan ke dashboard.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#696cff',
        }).then(() => {
          onSuccess();
        });
      }
    });
  };

  return null; // Component tidak render apapun, hanya menampilkan SweetAlert
} 