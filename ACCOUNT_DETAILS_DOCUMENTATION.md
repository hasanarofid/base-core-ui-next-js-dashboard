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
- Status Password (Aman/Perlu Diubah) - **DIPERBAIKI: Sekarang sesuai dengan database**
- Tenant ID
- Status Akun - **DIPERBAIKI: Sekarang sesuai dengan database**

### 3. Informasi Tenant (jika ada)
- Nama Tenant
- Domain
- Tenant ID
- Status Tenant

### 4. Aktivitas Terbaru
- Login berhasil
- Melihat dashboard

## Perbaikan yang Telah Dilakukan

### 1. **Data Tidak Berubah Setelah Update** ✅
**Masalah:** Setelah berhasil update akun, data tidak berubah di halaman dan perlu refresh manual.

**Solusi:**
- Menambahkan `fetchUserData()` setelah update berhasil
- Menambahkan `checkAuth()` untuk refresh auth context
- Menambahkan tombol "Refresh Data" untuk manual refresh

### 2. **Status Akun Tidak Sesuai Database** ✅
**Masalah:** Status akun selalu menampilkan "Aktif" tanpa memperhatikan data dari database.

**Solusi:**
- Menambahkan field `status` di interface `UserData`
- Membuat helper function `getAccountStatus()` yang menggunakan data dari database
- Membuat helper function `getAccountStatusBadgeClass()` untuk styling badge

### 3. **Status Password Tidak Sesuai Database** ✅
**Masalah:** Status password tidak sesuai dengan field `forcePasswordChange` dari database.

**Solusi:**
- Membuat helper function `getPasswordStatus()` yang menggunakan `forcePasswordChange` dari database
- Membuat helper function `getPasswordStatusBadgeClass()` untuk styling badge
- Menambahkan fallback ke auth context jika data database tidak tersedia

### 4. **API Endpoint Restriction** ✅
**Masalah:** API endpoint `/api/user` hanya bisa diakses oleh `admin_tenant`.

**Solusi:**
- Menghapus validasi role yang membatasi akses
- Semua user yang sudah login berhak mengakses data mereka sendiri
- Validasi role sudah ditangani oleh backend

## API Endpoints yang Digunakan

### GET /api/auth/me
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
    "status": "active",
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
    "status": "active",
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

## Helper Functions

### `getAccountStatus()`
Mengembalikan status akun berdasarkan data dari database:
- Jika `user.status === 'active'` → "Aktif"
- Jika `user.status !== 'active'` → "Tidak Aktif"
- Default → "Aktif"

### `getAccountStatusBadgeClass()`
Mengembalikan class CSS untuk badge status akun:
- "Aktif" → `bg-label-success`
- "Tidak Aktif" → `bg-label-danger`

### `getPasswordStatus()`
Mengembalikan status password berdasarkan data dari database:
- Jika `user.forcePasswordChange === true` → "Perlu Diubah"
- Jika `user.forcePasswordChange === false` → "Aman"
- Fallback ke auth context jika data database tidak tersedia

### `getPasswordStatusBadgeClass()`
Mengembalikan class CSS untuk badge status password:
- "Perlu Diubah" → `bg-label-danger`
- "Aman" → `bg-label-success`

## Flow Update Data

1. User klik tombol "Edit"
2. Modal edit muncul dengan data terbaru
3. User mengubah data dan klik "Simpan"
4. API call ke `/api/user` dengan method PATCH
5. Jika berhasil:
   - Update local state dengan data baru
   - Update auth context
   - Refresh data dari API (`fetchUserData()`)
   - Refresh auth context (`checkAuth()`)
   - Tampilkan notifikasi sukses
   - Tutup modal
6. Jika gagal:
   - Tampilkan notifikasi error
   - Modal tetap terbuka

## Testing

### Test Case 1: Update Nama Lengkap
1. Buka halaman `/account-details`
2. Klik tombol "Edit"
3. Ubah nama lengkap
4. Klik "Simpan"
5. **Expected:** Nama lengkap berubah langsung tanpa refresh

### Test Case 2: Update Email
1. Buka halaman `/account-details`
2. Klik tombol "Edit"
3. Ubah email
4. Klik "Simpan"
5. **Expected:** Email berubah langsung tanpa refresh

### Test Case 3: Status Sesuai Database
1. Buka halaman `/account-details`
2. **Expected:** Status akun dan password sesuai dengan data dari database

### Test Case 4: Refresh Data Manual
1. Buka halaman `/account-details`
2. Klik tombol "Refresh Data"
3. **Expected:** Data ter-refresh dari API

## Troubleshooting

### Masalah: Data tidak berubah setelah update
**Penyebab:** Cache atau data tidak ter-refresh
**Solusi:** 
1. Klik tombol "Refresh Data"
2. Cek console browser untuk error
3. Pastikan API response berhasil

### Masalah: Status tidak sesuai database
**Penyebab:** Data dari API tidak lengkap
**Solusi:**
1. Cek response API di Network tab
2. Pastikan field `status` dan `forcePasswordChange` ada di response
3. Refresh data manual

### Masalah: Error 403 saat update
**Penyebab:** Validasi role yang membatasi akses
**Solusi:** Pastikan user sudah login dan memiliki akses yang sesuai 