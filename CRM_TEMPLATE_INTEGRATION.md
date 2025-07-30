# Integrasi Template CRM Vuexy ke Next.js

## Overview

Dokumen ini menjelaskan bagaimana mengintegrasikan CSS dan komponen dari template HTML Vuexy CRM ke aplikasi Next.js tanpa merusak sidebar dan header yang sudah ada.

## Struktur File

```
src/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx              # Halaman dashboard utama
│   │   └── crm-template.css      # CSS khusus untuk template CRM
│   └── globals.css               # CSS global aplikasi
├── components/
│   └── dashboard/
│       └── CRMStats.tsx          # Komponen statistik CRM
public/
└── theme/
    └── assets/
        └── vendor/
            └── css/
                └── rtl/
                    ├── core.css           # CSS core template
                    └── theme-default.css  # CSS theme default
```

## Cara Penggunaan

### 1. Import CSS Template

Di halaman dashboard, import CSS template:

```tsx
import './crm-template.css'
```

### 2. Tambahkan Class Container

Bungkus konten dashboard dengan class `crm-dashboard`:

```tsx
<div className="container-xxl flex-grow-1 container-p-y crm-dashboard">
  {/* Konten dashboard */}
</div>
```

### 3. Gunakan Komponen CRMStats

```tsx
import CRMStats from '@/components/dashboard/CRMStats'

const crmStatsData = {
  revenue: {
    value: '$42.5k',
    change: '+18.2%',
    isPositive: true
  },
  leads: {
    value: '1.2k',
    change: '+12.5%',
    isPositive: true
  },
  orders: {
    value: '6,440',
    change: '+8.7%',
    isPositive: true
  },
  conversion: {
    value: '28.5%',
    change: '+2.1%',
    isPositive: true
  }
}

<CRMStats data={crmStatsData} />
```

## Fitur yang Tersedia

### 1. Statistics Cards
- Kartu statistik dengan gradient background
- Icon dan indikator perubahan
- Responsive design

### 2. CRM Cards
- Card dengan hover effects
- Shadow dan border radius yang konsisten
- Support untuk dark mode

### 3. Progress Bars
- Progress bar dengan gradient
- Animasi smooth
- Custom styling

### 4. Buttons
- Button dengan hover effects
- Primary dan outline variants
- Konsisten dengan brand colors

### 5. Tables
- Table styling yang konsisten
- Hover effects
- Responsive design

## CSS Classes yang Tersedia

### Statistics Cards
```css
.stats-card          # Card statistik utama
.stats-icon          # Container icon
.stats-value         # Nilai statistik
.stats-label         # Label statistik
.stats-change        # Indikator perubahan
.stats-change.positive  # Perubahan positif
.stats-change.negative  # Perubahan negatif
```

### Cards
```css
.crm-dashboard .card           # Card utama
.crm-dashboard .card-header    # Header card
.crm-dashboard .card-body      # Body card
.crm-dashboard .card-title     # Title card
```

### Progress
```css
.crm-dashboard .progress           # Progress bar container
.crm-dashboard .progress-bar       # Progress bar fill
.progress-bar-white               # Progress bar putih
```

### Buttons
```css
.crm-dashboard .btn               # Button dasar
.crm-dashboard .btn-primary       # Button primary
.crm-dashboard .btn-outline-primary  # Button outline
```

## Konfigurasi

### 1. Next.js Config
Pastikan `next.config.ts` sudah dikonfigurasi untuk serving static files:

```ts
async rewrites() {
  return [
    {
      source: '/theme/:path*',
      destination: '/public/theme/:path*',
    },
  ]
}
```

### 2. Brand Colors
CSS template menggunakan brand colors yang sudah didefinisikan di `globals.css`:

```css
:root {
  --brand-blue-1: #6ECCDD;
  --brand-blue-2: #54C8DD;
  --brand-blue-3: #14B8DA;
  --brand-blue-4: #0198C5;
  --brand-blue-5: #0088BA;
  --brand-yellow: #F6B80C;
  --brand-typeface: #0C4558;
}
```

## Keuntungan Pendekatan Ini

1. **Isolasi CSS**: CSS template hanya berlaku pada elemen dengan class `crm-dashboard`
2. **Tidak Merusak Layout**: Sidebar dan header tetap menggunakan CSS global
3. **Konsistensi Brand**: Menggunakan brand colors yang sudah didefinisikan
4. **Dark Mode Support**: Mendukung mode gelap
5. **Responsive**: Design responsive untuk semua ukuran layar
6. **Modular**: Komponen dapat digunakan kembali

## Troubleshooting

### CSS Tidak Ter-load
1. Pastikan path import CSS benar
2. Periksa konfigurasi Next.js untuk static files
3. Pastikan file CSS template ada di lokasi yang benar

### Style Konflik
1. Gunakan class `crm-dashboard` sebagai prefix
2. Pastikan CSS global tidak override template styles
3. Gunakan `!important` jika diperlukan untuk override

### Performance
1. CSS template di-load secara lazy
2. Gunakan CSS modules jika diperlukan
3. Optimize CSS bundle size

## Contoh Penggunaan Lengkap

```tsx
'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import CRMStats from '@/components/dashboard/CRMStats'
import './crm-template.css'

export default function DashboardPage() {
  const crmStatsData = {
    revenue: { value: '$42.5k', change: '+18.2%', isPositive: true },
    leads: { value: '1.2k', change: '+12.5%', isPositive: true },
    orders: { value: '6,440', change: '+8.7%', isPositive: true },
    conversion: { value: '28.5%', change: '+2.1%', isPositive: true }
  }

  return (
    <DashboardLayout>
      <div className="container-xxl flex-grow-1 container-p-y crm-dashboard">
        <CRMStats data={crmStatsData} />
        {/* Konten dashboard lainnya */}
      </div>
    </DashboardLayout>
  )
}
``` 