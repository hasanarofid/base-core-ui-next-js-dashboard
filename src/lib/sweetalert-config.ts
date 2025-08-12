import Swal from 'sweetalert2';
import { useTheme } from '@/contexts/ThemeContext';

// Import custom CSS
import '@/styles/sweetalert-custom.css';

// Fungsi helper untuk SweetAlert2 yang konsisten dengan theme Vuexy
export const showAlert = {
  // Success alert
  success: (title: string, text?: string) => {
    return Swal.fire({
      title,
      text,
      icon: 'success',
      confirmButtonColor: '#71dd37',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      allowOutsideClick: true,
      allowEscapeKey: true,
      backdrop: false,
      customClass: {
        popup: 'swal2-popup-custom',
        confirmButton: 'swal2-confirm-success'
      }
    });
  },

  // Error alert
  error: (title: string, text?: string) => {
    return Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonColor: '#ff3e1d',
      timer: 5000,
      timerProgressBar: true,
      allowOutsideClick: true,
      allowEscapeKey: true,
      backdrop: false,
      customClass: {
        popup: 'swal2-popup-custom'
      }
    });
  },

  // Warning alert
  warning: (title: string, text?: string) => {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      confirmButtonColor: '#ffab00',
      allowOutsideClick: true,
      allowEscapeKey: true,
      backdrop: false,
      customClass: {
        popup: 'swal2-popup-custom'
      }
    });
  },

  // Info alert
  info: (title: string, text?: string) => {
    return Swal.fire({
      title,
      text,
      icon: 'info',
      confirmButtonColor: '#03c3ec',
      allowOutsideClick: true,
      allowEscapeKey: true,
      backdrop: false,
      customClass: {
        popup: 'swal2-popup-custom'
      }
    });
  },

  // Loading alert
  loading: (title?: string, text?: string) => {
    return Swal.fire({
      title: title || 'Memproses...',
      text: text || 'Mohon tunggu sebentar',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      backdrop: false,
      customClass: {
        popup: 'swal2-popup-custom'
      },
      didOpen: () => {
        Swal.showLoading();
      }
    });
  },

  // Confirm dialog
  confirm: (title: string, text?: string, options?: Record<string, unknown>) => {
    return Swal.fire({
      title,
      text,
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
      reverseButtons: true,
      confirmButtonColor: '#696cff',
      cancelButtonColor: '#6d788d',
      allowOutsideClick: true,
      allowEscapeKey: true,
      backdrop: false,
      customClass: {
        popup: 'swal2-popup-custom'
      },
      ...options
    });
  }
};

// Fungsi untuk menutup loading
export const closeLoading = () => {
  Swal.close();
};

// Fungsi untuk menampilkan loading
export const showLoading = (title?: string, text?: string) => {
  return showAlert.loading(title, text);
};

// Fungsi untuk menampilkan konfirmasi delete
export const confirmDelete = (itemName: string) => {
  return showAlert.confirm(
    `Apakah Anda yakin ingin menghapus "${itemName}"?`,
    'Data yang dihapus tidak dapat dikembalikan!',
    {
      icon: 'warning',
      confirmButtonColor: '#ff3e1d',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      customClass: {
        popup: 'swal2-popup-custom',
        confirmButton: 'swal2-confirm-danger'
      }
    }
  );
};

// Fungsi untuk menampilkan konfirmasi approve
export const confirmApprove = (itemName: string) => {
  return showAlert.confirm(
    `Apakah Anda yakin ingin approve "${itemName}"?`,
    'Status akan berubah menjadi aktif.',
    {
      icon: 'question',
      confirmButtonColor: '#71dd37',
      confirmButtonText: 'Ya, approve!',
      cancelButtonText: 'Batal',
      customClass: {
        popup: 'swal2-popup-custom',
        confirmButton: 'swal2-confirm-success'
      }
    }
  );
};

// Fungsi untuk menampilkan konfirmasi status change
export const confirmStatusChange = (itemName: string, newStatus: string) => {
  return showAlert.confirm(
    `Ubah Status "${itemName}"`,
    `Pilih status baru untuk ${itemName}:`,
    {
      icon: 'question',
      confirmButtonColor: '#696cff',
      confirmButtonText: 'Ubah Status',
      cancelButtonText: 'Batal',
      input: 'select',
      inputOptions: {
        'pending': 'Pending',
        'active': 'Aktif',
        'suspended': 'Ditangguhkan'
      },
      inputValue: newStatus,
      customClass: {
        popup: 'swal2-popup-custom'
      }
    }
  );
};

// Hook untuk menggunakan SweetAlert dengan tema dinamis
export const useSweetAlert = () => {
  const { isDarkMode } = useTheme();
  
  const showAlertWithTheme = {
    success: (title: string, text?: string) => {
      return Swal.fire({
        title,
        text,
        icon: 'success',
        confirmButtonColor: '#71dd37',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: true,
        allowEscapeKey: true,
        backdrop: false,
        customClass: {
          popup: `swal2-popup-custom ${isDarkMode ? 'dark-style' : 'light-style'}`,
          confirmButton: 'swal2-confirm-success'
        }
      });
    },

    error: (title: string, text?: string) => {
      return Swal.fire({
        title,
        text,
        icon: 'error',
        confirmButtonColor: '#ff3e1d',
        timer: 5000,
        timerProgressBar: true,
        allowOutsideClick: true,
        allowEscapeKey: true,
        backdrop: false,
        customClass: {
          popup: `swal2-popup-custom ${isDarkMode ? 'dark-style' : 'light-style'}`
        }
      });
    },

    warning: (title: string, text?: string) => {
      return Swal.fire({
        title,
        text,
        icon: 'warning',
        confirmButtonColor: '#ffab00',
        allowOutsideClick: true,
        allowEscapeKey: true,
        backdrop: false,
        customClass: {
          popup: `swal2-popup-custom ${isDarkMode ? 'dark-style' : 'light-style'}`
        }
      });
    },

    info: (title: string, text?: string) => {
      return Swal.fire({
        title,
        text,
        icon: 'info',
        confirmButtonColor: '#03c3ec',
        allowOutsideClick: true,
        allowEscapeKey: true,
        backdrop: false,
        customClass: {
          popup: `swal2-popup-custom ${isDarkMode ? 'dark-style' : 'light-style'}`
        }
      });
    },

    loading: (title?: string, text?: string) => {
      return Swal.fire({
        title: title || 'Memproses...',
        text: text || 'Mohon tunggu sebentar',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        backdrop: false,
        customClass: {
          popup: `swal2-popup-custom ${isDarkMode ? 'dark-style' : 'light-style'}`
        },
        didOpen: () => {
          Swal.showLoading();
        }
      });
    },

    confirm: (title: string, text?: string, options?: Record<string, unknown>) => {
      return Swal.fire({
        title,
        text,
        showCancelButton: true,
        confirmButtonText: 'Ya',
        cancelButtonText: 'Batal',
        reverseButtons: true,
        confirmButtonColor: '#696cff',
        cancelButtonColor: '#6d788d',
        allowOutsideClick: true,
        allowEscapeKey: true,
        backdrop: false,
        customClass: {
          popup: `swal2-popup-custom ${isDarkMode ? 'dark-style' : 'light-style'}`
        },
        ...options
      });
    },

    confirmDelete: (itemName: string) => {
      return Swal.fire({
        title: `Apakah Anda yakin ingin menghapus "${itemName}"?`,
        text: 'Data yang dihapus tidak dapat dikembalikan!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal',
        reverseButtons: true,
        confirmButtonColor: '#ff3e1d',
        cancelButtonColor: '#6d788d',
        allowOutsideClick: true,
        allowEscapeKey: true,
        backdrop: false,
        customClass: {
          popup: `swal2-popup-custom ${isDarkMode ? 'dark-style' : 'light-style'}`,
          confirmButton: 'swal2-confirm-danger'
        }
      });
    },

    confirmApprove: (itemName: string) => {
      return Swal.fire({
        title: `Apakah Anda yakin ingin approve "${itemName}"?`,
        text: 'Status akan berubah menjadi aktif.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Ya, approve!',
        cancelButtonText: 'Batal',
        reverseButtons: true,
        confirmButtonColor: '#71dd37',
        cancelButtonColor: '#6d788d',
        allowOutsideClick: true,
        allowEscapeKey: true,
        backdrop: false,
        customClass: {
          popup: `swal2-popup-custom ${isDarkMode ? 'dark-style' : 'light-style'}`,
          confirmButton: 'swal2-confirm-success'
        }
      });
    },

    closeLoading: () => {
      Swal.close();
    }
  };

  return showAlertWithTheme;
};

export default Swal; 