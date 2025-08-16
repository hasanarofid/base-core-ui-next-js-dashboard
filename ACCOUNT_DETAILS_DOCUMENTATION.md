# Dokumentasi Halaman Detail Akun

## Deskripsi
Halaman detail akun (`/account-details`) menampilkan informasi lengkap tentang akun pengguna yang sedang login, termasuk informasi pribadi, keamanan akun, dan informasi tenant (jika ada). Halaman ini juga menyediakan fitur untuk mengupdate data user dan tenant.

## Fitur yang Tersedia

### 1. Informasi Pribadi
- Nama Lengkap
- Email
- ID Pengguna
- Role

### 2. Keamanan Akun
- Status Password (Aman/Perlu Diubah)
- Tenant ID
- Status Akun

### 3. Informasi Tenant (jika ada)
- Nama Tenant
- Domain
- Tenant ID
- Status Tenant

### 4. Aktivitas Terbaru
- Login berhasil
- Melihat dashboard

## API Endpoints yang Digunakan

### GET /api/user
**Deskripsi:** Mengambil data user yang sedang login

**Response:**
```json
{
  "message": "User fetched successfully",
  "user": {
    "id": "9851fd6e-28f6-414c-9620-17e7a1c2b956",
    "fullName": "Admin Tenant Naufal",
    "email": "naufalnaufal023@gmail.com",
    "role": "tenant_admin",
    "forcePasswordChange": true,
    "tenantId": "ebe984d2-cb6e-42a8-b77e-23d859dc796b",
    "tenant": {
      "id": "ebe984d2-cb6e-42a8-b77e-23d859dc796b",
      "name": "Tenant Naufal",
      "status": "active",
      "domain": "https://naufalpujimahdy.id/"
    }
  }
}
```

### PATCH /api/user
**Deskripsi:** Mengupdate data user

**Request Body:**
```json
{
  "id": "user-id",
  "fullName": "Nama Baru",
  "email": "email@baru.com"
}
```

**Response:**
```json
{
  "message": "User updated successfully",
  "user": {
    "id": "user-id",
    "fullName": "Nama Baru",
    "email": "email@baru.com",
    "role": "tenant_admin",
    "forcePasswordChange": false,
    "tenantId": "tenant-id",
    "tenant": {
      "id": "tenant-id",
      "name": "Tenant Name",
      "status": "active",
      "domain": "https://example.com"
    }
  }
}
```

### PUT /api/tenants/{id}
**Deskripsi:** Mengupdate data tenant (hanya untuk role admin_tenant)

**Request Body:**
```json
{
  "name": "Nama Tenant Baru",
  "domain": "https://domain-baru.com"
}
```

**Response:**
```json
{
  "message": "Tenant updated successfully",
  "data": {
    "id": "tenant-id",
    "name": "Nama Tenant Baru",
    "domain": "https://domain-baru.com",
    "status": "active"
  }
}
```

## Komponen UI

### Modal Edit Profile
- Form untuk mengupdate nama lengkap dan email
- Validasi input
- Loading state saat menyimpan
- Feedback success/error

### Modal Edit Tenant
- Form untuk mengupdate nama tenant dan domain
- Hanya muncul untuk role admin_tenant
- Validasi input
- Loading state saat menyimpan
- Feedback success/error

## Role-based Access Control

### Superadmin
- Dapat melihat semua informasi
- Dapat mengupdate profile sendiri
- Tidak dapat mengupdate tenant (karena tidak terikat ke tenant tertentu)

### Admin Tenant
- Dapat melihat semua informasi
- Dapat mengupdate profile sendiri
- Dapat mengupdate data tenant yang terkait

### End User
- Dapat melihat semua informasi
- Dapat mengupdate profile sendiri
- Tidak dapat mengupdate tenant

## State Management

### Local State
- `user`: Data user dari API
- `loading`: Status loading saat fetch data
- `showUpdateModal`: Status modal edit profile
- `showTenantModal`: Status modal edit tenant
- `updating`: Status loading saat update
- `updateForm`: Form data untuk update user
- `tenantForm`: Form data untuk update tenant

### Global State (AuthContext)
- User data diupdate di AuthContext setelah berhasil update profile

## Error Handling

### Network Errors
- Menampilkan toast error jika gagal fetch data
- Menampilkan toast error jika gagal update data
- Fallback ke data dari AuthContext jika API gagal

### Validation Errors
- Validasi input form
- Menampilkan pesan error yang spesifik dari API

## Styling

### Bootstrap Classes
- Menggunakan Bootstrap 5 untuk styling
- Responsive design dengan grid system
- Modal dengan backdrop
- Loading spinners
- Toast notifications

### Icons
- Menggunakan Tabler Icons
- Icon yang konsisten dengan halaman lain

## Dependencies

### External Libraries
- React Hook Form (untuk form handling)
- SweetAlert2 (untuk konfirmasi)
- Axios (untuk HTTP requests)

### Internal Components
- DashboardLayout
- SecureGuard
- ToastContext
- AuthContext

## Testing

### Unit Tests
- Test komponen AccountDetailsPage
- Test fungsi API
- Test error handling

### Integration Tests
- Test flow update profile
- Test flow update tenant
- Test role-based access

## Deployment

### Environment Variables
- `NEXT_PUBLIC_API_BASE_URL`: Base URL untuk API

### Build Process
- Tidak ada konfigurasi khusus
- Menggunakan Next.js build process standar

## Troubleshooting

### Common Issues
1. **Data tidak muncul**: Cek koneksi API dan session
2. **Update gagal**: Cek validasi input dan response API
3. **Modal tidak muncul**: Cek role user dan kondisi rendering

### Debug Steps
1. Cek console browser untuk error
2. Cek network tab untuk request/response
3. Cek AuthContext state
4. Cek API endpoint response

## Future Enhancements

### Planned Features
- Upload avatar/profile picture
- Change password functionality
- Activity log yang lebih detail
- Export data functionality
- Two-factor authentication

### Performance Improvements
- Implement caching untuk user data
- Lazy loading untuk komponen
- Optimize re-renders 