# Force Password Change - Testing Guide

## Status Update
✅ **Backend sudah menambahkan field `forcePasswordChange` di response API `/api/v1/user`**

## Testing Steps

### 1. **Persiapkan User Test**
Pastikan ada user dengan kondisi berikut:
- Role: `tenant_admin` atau `admin_tenant`
- Field `forcePasswordChange: true` di database

### 2. **Login dengan User Test**
1. Buka aplikasi di `http://localhost:3001`
2. Login dengan user yang memiliki `forcePasswordChange: true`
3. Buka Developer Tools (F12) dan lihat tab Console

### 3. **Expected Console Logs**
Jika berjalan dengan benar, Anda akan melihat log ini:

```
🔍 Checking authentication...
🔍 CheckAuth response: {
  message: 'User fetched successfully',
  user: {
    id: '...',
    fullName: '...',
    email: '...',
    role: 'tenant_admin',
    forcePasswordChange: true,
    tenantId: '...'
  }
}
🔍 User data from checkAuth: {
  id: '...',
  fullName: '...',
  email: '...',
  role: 'tenant_admin',
  force_password_change: true
}
🔍 User role: tenant_admin
🔍 Force password change: true
🔍 ForcePasswordChangeGuard: Checking user conditions
🔍 User role: tenant_admin
🔍 Force password change: true
🔍 Current pathname: /dashboard
🚨 Admin tenant needs to change password!
```

### 4. **Expected Behavior**
- Modal "Ganti Password Wajib" akan muncul
- Modal tidak bisa di-close (unclosable)
- User harus mengisi form password baru
- Setelah berhasil, user akan diarahkan ke dashboard

### 5. **Debug Tools**
Jika modal tidak muncul, gunakan Debug Tools di dashboard:
1. Scroll ke bawah, cari section "Debug Tools"
2. Klik "Test Force Password Change Modal"
3. Lihat data user yang ditampilkan
4. Verifikasi kondisi `force_password_change`

### 6. **Manual Testing dengan Debug Tools**
```javascript
// Di browser console, cek data user
console.log('User data:', user);
console.log('Role:', user?.role);
console.log('Force password change:', user?.force_password_change);
console.log('Should show modal:', (user?.role === 'tenant_admin' || user?.role === 'admin_tenant') && user?.force_password_change);
```

## Troubleshooting

### Masalah: Modal Tidak Muncul
**Kemungkinan Penyebab:**
1. Field mapping salah di AuthContext
2. Role tidak sesuai (`tenant_admin` vs `admin_tenant`)
3. `forcePasswordChange` tidak ter-map dengan benar

**Solusi:**
1. Cek console log untuk memastikan field ter-map dengan benar
2. Gunakan Debug Tools untuk test manual
3. Pastikan backend mengirim `forcePasswordChange: true`

### Masalah: API Error
**Kemungkinan Penyebab:**
1. Endpoint `/change-password` tidak tersedia
2. Format request tidak sesuai

**Solusi:**
1. Cek Network tab untuk melihat request/response
2. Pastikan endpoint backend sudah tersedia
3. Verifikasi format request body

## Test Cases

### Test Case 1: User dengan forcePasswordChange = true
- **Input:** User `tenant_admin` dengan `forcePasswordChange: true`
- **Expected:** Modal muncul, user harus ganti password
- **Result:** ✅/❌

### Test Case 2: User dengan forcePasswordChange = false
- **Input:** User `tenant_admin` dengan `forcePasswordChange: false`
- **Expected:** Modal tidak muncul, user langsung ke dashboard
- **Result:** ✅/❌

### Test Case 3: Superadmin
- **Input:** User `superadmin` dengan `forcePasswordChange: true`
- **Expected:** Modal tidak muncul (aturan hanya untuk tenant_admin)
- **Result:** ✅/❌

## API Response Format
```json
{
  "message": "User fetched successfully",
  "user": {
    "id": "1c0aec83-b65c-4614-8f24-c5ae39dd867c",
    "fullName": "Naufal Puji Mahdy",
    "email": "naufallpujimahdy@gmail.com",
    "role": "tenant_admin",
    "forcePasswordChange": true,
    "tenantId": "2ba4805e-a95e-4de2-a0c1-c94285fec4d4",
    "tenant": {
      "id": "2ba4805e-a95e-4de2-a0c1-c94285fec4d4",
      "name": "Test Tenant",
      "status": "active",
      "domain": "https://naufalpujimahdy.ss/"
    }
  }
}
```

## Field Mapping
- Backend: `forcePasswordChange` (camelCase)
- Frontend: `force_password_change` (snake_case)
- Mapping: `force_password_change: data.user.forcePasswordChange || data.user.force_password_change || false` 