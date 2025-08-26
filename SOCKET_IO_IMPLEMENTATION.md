# Implementasi Socket.IO di Tenant App

## Overview
Implementasi Socket.IO untuk menerima notifikasi real-time dari backend ketika ada transaksi atau event penting terjadi.

## Konfigurasi

### URL dan Path
- **WebSocket URL**: `http://31.97.61.121:3032`
- **Path**: `/realtime`
- **Authentication**: JWT Token dari login user

### Dependencies
```json
{
  "socket.io-client": "^4.x.x"
}
```

## Struktur Implementasi

### 1. Context dan Hooks

#### SocketContext (`src/contexts/SocketContext.tsx`)
- Mengelola koneksi Socket.IO
- Menyimpan state notifikasi
- Menangani event dari backend

#### useToken Hook (`src/hooks/useToken.ts`)
- Mengelola token authentication
- Sinkronisasi dengan localStorage

### 2. Komponen UI

#### NotificationToast (`src/components/ui/NotificationToast.tsx`)
- Toast notification yang muncul otomatis
- Auto-hide setelah 5 detik
- Maksimal 3 notifikasi bersamaan

#### NotificationList (`src/components/ui/NotificationList.tsx`)
- Dropdown notifikasi di header
- Menampilkan daftar notifikasi
- Fitur hapus semua notifikasi

#### SocketStatus (`src/components/ui/SocketStatus.tsx`)
- Indikator status koneksi Socket.IO
- Menampilkan status terhubung/terputus

### 3. Dashboard Components

#### SocketStatusCard (`src/components/dashboard/SocketStatusCard.tsx`)
- Card status koneksi di dashboard
- Menampilkan jumlah notifikasi

#### RecentNotifications (`src/components/dashboard/RecentNotifications.tsx`)
- Daftar 5 notifikasi terbaru
- Fitur hapus semua notifikasi

## Event yang Didukung

### 1. Transaction Events
```javascript
// Event: transaction_created
{
  transaction_id: "TRX123456",
  amount: 100000,
  currency: "IDR",
  status: "success"
}
```

### 2. Tenant Events
```javascript
// Event: tenant_created
{
  tenant_id: "TENANT001",
  tenant_name: "PT. Example",
  status: "active"
}
```

### 3. Payment Events
```javascript
// Event: payment_received
{
  payment_id: "PAY123456",
  amount: 50000,
  currency: "IDR",
  status: "completed"
}
```

### 4. General Events
```javascript
// Event: notification
{
  type: "info",
  title: "System Update",
  message: "Maintenance completed"
}

// Event: error
{
  message: "Connection timeout"
}
```

## Cara Kerja

### 1. Koneksi Socket.IO
- Otomatis terhubung saat user login
- Menggunakan JWT token untuk authentication
- Auto-reconnect jika koneksi terputus

### 2. Notifikasi
- Notifikasi muncul sebagai toast di pojok kanan atas
- Disimpan dalam state untuk ditampilkan di dropdown
- Auto-hide setelah 5 detik

### 3. Status Koneksi
- Indikator visual di header dan dashboard
- Real-time update status terhubung/terputus

## Integrasi dengan Backend

### Backend harus mengirim event dengan format:
```javascript
// Untuk transaksi
socket.emit('transaction_created', {
  transaction_id: "TRX123456",
  amount: 100000,
  currency: "IDR",
  status: "success"
})

// Untuk tenant
socket.emit('tenant_created', {
  tenant_id: "TENANT001",
  tenant_name: "PT. Example",
  status: "active"
})

// Untuk pembayaran
socket.emit('payment_received', {
  payment_id: "PAY123456",
  amount: 50000,
  currency: "IDR",
  status: "completed"
})
```

## Testing

### 1. Test Koneksi
- Buka browser developer tools
- Lihat console untuk log koneksi Socket.IO
- Status koneksi akan terlihat di header

### 2. Test Notifikasi
- Backend dapat mengirim event test
- Notifikasi akan muncul sebagai toast
- Dapat dilihat di dropdown notifikasi

### 3. Test Reconnection
- Matikan internet connection
- Status akan berubah menjadi "Terputus"
- Hidupkan kembali internet
- Status akan berubah menjadi "Terhubung"

## Troubleshooting

### 1. Koneksi Gagal
- Periksa URL WebSocket di `SocketContext.tsx`
- Pastikan backend Socket.IO server berjalan
- Periksa JWT token valid

### 2. Notifikasi Tidak Muncul
- Periksa event listener di `SocketContext.tsx`
- Pastikan format data dari backend sesuai
- Periksa console untuk error

### 3. Token Authentication
- Pastikan token disimpan di localStorage
- Periksa format token di auth header
- Pastikan token tidak expired

## File yang Dimodifikasi

1. `src/contexts/SocketContext.tsx` - Context Socket.IO
2. `src/contexts/AuthContext.tsx` - Menambah token management
3. `src/hooks/useToken.ts` - Hook untuk token
4. `src/components/ui/NotificationToast.tsx` - Toast notification
5. `src/components/ui/NotificationList.tsx` - Dropdown notifikasi
6. `src/components/ui/SocketStatus.tsx` - Status koneksi
7. `src/components/layout/Header.tsx` - Menambah notifikasi bell
8. `src/components/layout/NotificationWrapper.tsx` - Wrapper notifikasi
9. `src/components/dashboard/SocketStatusCard.tsx` - Card status
10. `src/components/dashboard/RecentNotifications.tsx` - Daftar notifikasi
11. `src/app/layout.tsx` - Menambah SocketProvider
12. `src/app/dashboard/page.tsx` - Menambah komponen Socket.IO
13. `src/types/notification.ts` - Type definitions
14. `package.json` - Menambah socket.io-client dependency
