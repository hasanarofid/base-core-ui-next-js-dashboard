# CRUD DataTables dengan Theme Vuexy

Dokumentasi lengkap untuk sistem CRUD (Create, Read, Update, Delete) dengan DataTables yang menggunakan theme Vuexy dan warna global yang telah didefinisikan.

## 🎨 Fitur Design

### Warna Global Theme
- **Primary Colors**: Menggunakan brand blue dari theme (`--brand-blue-3`, `--brand-blue-4`)
- **Secondary Colors**: Gray scale untuk text dan background
- **Status Colors**: 
  - Success: Green untuk status aktif
  - Danger: Red untuk status tidak aktif
  - Warning: Yellow untuk stok terbatas
- **Dark Mode Support**: Fully responsive dengan dark mode

### Komponen UI yang Digunakan
- **DataTable**: Komponen table dengan fitur sorting, searching, dan pagination
- **Button**: Dengan berbagai variant (primary, outline, ghost, danger)
- **Input**: Form input dengan validasi
- **Select**: Dropdown select dengan custom styling
- **Badge**: Untuk menampilkan status dan kategori
- **Modal**: Untuk konfirmasi delete (jika diperlukan)

## 📁 Struktur File

```
src/
├── types/
│   └── product.ts                 # Type definitions untuk Product
├── components/
│   └── ui/
│       ├── DataTable.tsx          # Komponen DataTable utama
│       ├── Button.tsx             # Komponen Button
│       ├── Input.tsx              # Komponen Input
│       ├── Select.tsx             # Komponen Select
│       └── Badge.tsx              # Komponen Badge
└── app/
    └── products/
        ├── page.tsx               # Halaman List (DataTable)
        ├── create/
        │   └── page.tsx           # Halaman Create
        └── [id]/
            ├── page.tsx           # Halaman Detail
            └── edit/
                └── page.tsx       # Halaman Edit
```

## 🚀 Halaman yang Tersedia

### 1. Halaman List (`/products`)
- **Fitur**:
  - DataTable dengan sorting
  - Search functionality
  - Pagination
  - Action buttons (View, Edit, Delete)
  - Responsive design
  - Loading states

- **Kolom**:
  - Nama Produk (dengan deskripsi)
  - Kategori (dengan badge)
  - Harga (format Rupiah)
  - Stok (dengan warna status)
  - Status (Active/Inactive badge)
  - Tanggal Dibuat
  - Aksi (dropdown menu)

### 2. Halaman Create (`/products/create`)
- **Fitur**:
  - Form validation dengan Zod
  - React Hook Form integration
  - Real-time validation
  - Loading state saat submit
  - Responsive layout

- **Field**:
  - Nama Produk (required)
  - Deskripsi (required)
  - Harga (number, required)
  - Stok (number, required)
  - Kategori (select, required)
  - Status (select, default: active)

### 3. Halaman Edit (`/products/[id]/edit`)
- **Fitur**:
  - Pre-filled form dengan data existing
  - Same validation as create
  - Loading state untuk fetch data
  - Error handling untuk product not found
  - Informasi sistem (ID, created/updated dates)

### 4. Halaman Detail (`/products/[id]`)
- **Fitur**:
  - Informasi lengkap produk
  - Layout responsive dengan sidebar
  - Quick action buttons
  - Status indicators
  - System information display

## 🛠️ Komponen DataTable

### Props Interface
```typescript
interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
  };
  onSearch?: (search: string) => void;
  onFilter?: (filters: any) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  actions?: boolean;
  className?: string;
}
```

### Column Configuration
```typescript
interface Column<T> {
  key: string;
  header: string;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}
```

## 🎯 Fitur Utama

### 1. Sorting
- Klik pada header kolom untuk sort
- Visual indicator untuk sort direction
- Hanya kolom dengan `sortable: true` yang bisa di-sort

### 2. Searching
- Real-time search
- Mencari di multiple field (nama, deskripsi, kategori)
- Debounced search untuk performance

### 3. Pagination
- Custom pagination component
- Info "Menampilkan X-Y dari Z data"
- Previous/Next buttons
- Page number buttons

### 4. Actions
- Dropdown menu untuk actions
- View, Edit, Delete actions
- Confirmation untuk delete action

### 5. Responsive Design
- Mobile-friendly layout
- Responsive table dengan horizontal scroll
- Adaptive button sizes

## 🎨 Styling & Theme

### CSS Variables yang Digunakan
```css
:root {
  --primary: var(--brand-blue-3);
  --primary-dark: var(--brand-blue-4);
  --bg-primary: #f8f7fa;
  --bg-secondary: #ffffff;
  --text-primary: var(--brand-typeface);
  --text-secondary: #6e6b7b;
  --border-color: #d9dee3;
}
```

### Dark Mode Support
```css
.dark {
  --bg-primary: #161d31;
  --bg-secondary: #283046;
  --text-primary: #d0d2d6;
  --text-secondary: #b4b7bd;
  --border-color: #3b4253;
}
```

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 Penggunaan

### 1. Import DataTable
```typescript
import { DataTable, Column } from '@/components/ui/DataTable';
```

### 2. Define Columns
```typescript
const columns: Column<Product>[] = [
  {
    key: 'name',
    header: 'Nama Produk',
    sortable: true,
    render: (value, row) => (
      <div>
        <div className="font-medium">{row.name}</div>
        <div className="text-sm text-gray-500">{row.description}</div>
      </div>
    )
  }
];
```

### 3. Use in Component
```typescript
<DataTable
  data={products}
  columns={columns}
  loading={loading}
  searchable={true}
  onSearch={handleSearch}
  onEdit={handleEdit}
  onDelete={handleDelete}
  pagination={{
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange: setCurrentPage
  }}
/>
```

## 🚀 Next Steps

Untuk mengintegrasikan dengan backend API:

1. **Replace Mock Data**: Ganti mock data dengan API calls
2. **Add Error Handling**: Implement proper error handling
3. **Add Loading States**: Implement loading states untuk API calls
4. **Add Toast Notifications**: Untuk feedback user
5. **Add Image Upload**: Jika diperlukan untuk produk
6. **Add Bulk Actions**: Untuk multiple selection
7. **Add Export Features**: Export ke Excel/PDF

## 📝 Notes

- Semua komponen menggunakan TypeScript
- Menggunakan React Hook Form untuk form management
- Zod untuk schema validation
- Lucide React untuk icons
- Tailwind CSS untuk styling
- Fully responsive dan accessible
- Support dark mode
- Mengikuti design system Vuexy dengan warna brand custom 