# Force Password Change - Troubleshooting Guide

## Masalah: Modal Tidak Muncul Setelah Login

### Langkah Debugging

#### 1. **Cek Console Browser**
Buka Developer Tools (F12) dan lihat tab Console. Cari log dengan prefix berikut:

```
✅ Login API response: {data: {user: {...}}}
🎯 User set successfully: {role: "admin_tenant", force_password_change: true}
🔍 User role: admin_tenant
🔍 Force password change: true
🔍 ForcePasswordChangeGuard: Checking user conditions
🔍 User role: admin_tenant
🔍 Force password change: true
🔍 Current pathname: /dashboard
🚨 Admin tenant needs to change password!
```

#### 2. **Cek Response API Login**
Pastikan response dari `/api/auth/login` mengandung field yang benar:

```json
{
  "data": {
    "user": {
      "id": "user_id",
      "fullName": "Admin Tenant",
      "email": "admin@example.com",
      "role": "admin_tenant",
      "tenantId": "tenant_id",
      "force_password_change": true
    }
  }
}
```

#### 3. **Cek Response API Me**
Pastikan response dari `/api/auth/me` juga mengandung field yang sama.

#### 4. **Gunakan Debug Tools**
Di dashboard, ada section "Debug Tools" yang hanya muncul di development mode. Klik tombol "Test Force Password Change Modal" untuk:

- Melihat data user yang tersimpan
- Test apakah modal bisa muncul
- Verifikasi kondisi `force_password_change`

### Kemungkinan Penyebab Masalah

#### 1. **Field Mapping Salah**
Pastikan field mapping di AuthContext sudah benar:
- `fullName` atau `full_name`
- `tenantId` atau `tenant_id`
- `force_password_change`

#### 2. **Response API Tidak Konsisten**
Backend mungkin mengirim field dengan nama yang berbeda. Cek response API di Network tab.

#### 3. **Timing Issue**
Modal mungkin tidak muncul karena timing. ForcePasswordChangeGuard sekarang ada di root layout dan akan mengecek kondisi di semua halaman.

#### 4. **Role atau Force Password Change Salah**
Pastikan:
- User memiliki role `admin_tenant` (bukan `admin_tenant` atau `admin`)
- Field `force_password_change` bernilai `true` (boolean, bukan string)

### Solusi

#### 1. **Buat User Test dengan Kondisi yang Benar**
```javascript
// Data user yang benar untuk testing
{
  "fullName": "Test Admin Tenant",
  "email": "admin-tenant-test@example.com",
  "password": "123456",
  "role": "admin_tenant", // Pastikan exact match
  "isVerified": true,
  "force_password_change": true // Pastikan boolean true
}
```

#### 2. **Cek Environment Variables**
```bash
# Pastikan API base URL benar
NEXT_PUBLIC_API_BASE_URL=http://31.97.61.121:3032/api/v1
```

#### 3. **Test Manual dengan Debug Tools**
1. Login dengan user admin_tenant yang memiliki `force_password_change = true`
2. Buka dashboard
3. Scroll ke bawah, cari section "Debug Tools"
4. Klik "Test Force Password Change Modal"
5. Lihat data user yang ditampilkan
6. Jika modal muncul, berarti logic sudah benar

#### 4. **Cek Network Tab**
1. Buka Developer Tools > Network
2. Login dengan user test
3. Cari request ke `/api/auth/login` dan `/api/auth/me`
4. Lihat response body untuk memastikan field sudah benar

### Log Debug yang Harus Muncul

Jika semua berjalan dengan benar, Anda akan melihat log ini di console:

```
✅ Login API response: {data: {user: {...}}}
🎯 User set successfully: {role: "admin_tenant", force_password_change: true}
🔍 User role: admin_tenant
🔍 Force password change: true
🔍 ForcePasswordChangeGuard: Checking user conditions
🔍 User role: admin_tenant
🔍 Force password change: true
🔍 Current pathname: /dashboard
🚨 Admin tenant needs to change password!
```

### Jika Masih Bermasalah

1. **Cek apakah SweetAlert2 sudah ter-load**
2. **Cek apakah ada error JavaScript di console**
3. **Cek apakah cookies session tersimpan dengan benar**
4. **Coba refresh halaman setelah login**
5. **Cek apakah backend API `/change-password` sudah tersedia**

### Test Case yang Benar

1. **Buat user admin_tenant dengan force_password_change = true**
2. **Login dengan user tersebut**
3. **Modal harus muncul dan tidak bisa di-close**
4. **Ganti password untuk bisa mengakses sistem**
5. **Modal tidak muncul lagi setelah ganti password** 