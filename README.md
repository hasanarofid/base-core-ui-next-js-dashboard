# TenantCore Dashboard

Dashboard Next.js dengan komponen fundamental untuk aplikasi tenant management.

## Fitur

- ✅ Layout responsive dengan sidebar collapsible
- ✅ Sistem autentikasi dengan JWT
- ✅ Komponen UI yang dapat digunakan kembali
- ✅ Integrasi API dengan Laravel backend
- ✅ Form validation dengan React Hook Form + Zod
- ✅ TypeScript untuk type safety
- ✅ Tailwind CSS untuk styling

## Struktur Proyek

```
src/
├── app/                    # App Router pages
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Auth pages
│   └── globals.css       # Global styles
├── components/           # Reusable components
│   ├── auth/            # Authentication components
│   ├── dashboard/       # Dashboard specific components
│   ├── layout/          # Layout components
│   └── ui/              # UI components
├── lib/                 # Utilities and configurations
├── hooks/               # Custom React hooks
└── types/               # TypeScript type definitions
```

## Komponen Fundamental

### Layout Components
- `DashboardLayout` - Layout utama dengan sidebar dan header
- `Sidebar` - Navigasi sidebar dengan menu items
- `Header` - Header dengan search, notifications, dan user menu

### Auth Components
- `LoginForm` - Form login dengan validasi

### Dashboard Components
- `StatsCard` - Card untuk menampilkan statistik

### UI Components
- Reusable button, input, modal, dll.

## Setup dan Instalasi

1. Install dependencies:
```bash
npm install
```

2. Buat file `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=TenantCore Dashboard
NEXT_PUBLIC_APP_VERSION=1.0.0
```

3. Jalankan development server:
```bash
npm run dev
```

## API Integration

Dashboard ini terintegrasi dengan backend Laravel melalui:

- `src/lib/api.ts` - Konfigurasi axios dan API endpoints
- `src/lib/utils.ts` - Utility functions
- `src/types/index.ts` - Type definitions

### Endpoints yang Digunakan

- `POST /api/ogin` - Login user
- `POST /api/ogout` - Logout user
- `GET /api/auth/me` - Get current user
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent-activity` - Get recent activities
- `GET /api/dashboard/charts` - Get chart data

## Penggunaan Komponen

### Dashboard Layout
```tsx
import DashboardLayout from '@/components/layout/DashboardLayout'

export default function MyPage() {
  return (
    <DashboardLayout>
      <div>Konten halaman Anda</div>
    </DashboardLayout>
  )
}
```

### Stats Card
```tsx
import StatsCard from '@/components/dashboard/StatsCard'
import { Users } from 'lucide-react'

<StatsCard
  title="Total Pengguna"
  value="1,245"
  change={{ value: 8.2, type: 'increase' }}
  icon={Users}
  iconColor="text-blue-600"
/>
```

## Styling

Dashboard menggunakan Tailwind CSS dengan custom color scheme:

- Primary: `#7367F0` (Purple)
- Primary Dark: `#5E50EE`

## Development

### Menambah Halaman Baru

1. Buat file di `src/app/[nama-halaman]/page.tsx`
2. Gunakan `DashboardLayout` untuk halaman yang memerlukan sidebar
3. Import komponen yang diperlukan

### Menambah Komponen Baru

1. Buat file di `src/components/[kategori]/[nama-komponen].tsx`
2. Export sebagai default component
3. Tambahkan type definitions di `src/types/index.ts` jika diperlukan

### Menambah API Endpoint

1. Tambahkan di `src/lib/api.ts`
2. Buat type definitions di `src/types/index.ts`
3. Gunakan di komponen dengan try-catch untuk error handling

## Deployment

1. Build aplikasi:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

## Contributing

1. Fork repository
2. Buat feature branch
3. Commit changes
4. Push ke branch
5. Buat Pull Request

## License

MIT License
