import Swal from 'sweetalert2';

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
      showConfirmButton: false
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
      timerProgressBar: true
    });
  },

  // Warning alert
  warning: (title: string, text?: string) => {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      confirmButtonColor: '#ffab00'
    });
  },

  // Info alert
  info: (title: string, text?: string) => {
    return Swal.fire({
      title,
      text,
      icon: 'info',
      confirmButtonColor: '#03c3ec'
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
      cancelButtonText: 'Batal'
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
      cancelButtonText: 'Batal'
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
      inputValue: newStatus
    }
  );
};

export default Swal; 