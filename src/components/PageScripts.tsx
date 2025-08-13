'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function PageScripts() {
  const pathname = usePathname();

  useEffect(() => {
    // Hanya untuk halaman Dashboard Analytics (ubah path sesuai routing kamu)
    if (pathname !== '/' && pathname !== '/dashboard') return;

    // (Opsional) cek elemen target ada. Ganti selector sesuai yang dipakai template.
    // Contoh umum Vuexy: container chart dsb.
    const neededSelectors = [
      '#totalRevenueChart',
      '#profileReportChart',
      '#expensesOfWeek',
    ];
    const hasAnyTarget = neededSelectors.some((sel) => document.querySelector(sel));
    if (!hasAnyTarget) return; // jangan inject kalau target tidak ada → cegah null.parentElement

    // inject script page-level setelah DOM siap & vendor sudah ada
    const s = document.createElement('script');
    s.src = '/theme/assets/js/dashboards-analytics.js';
    s.async = true;
    document.body.appendChild(s);

    return () => {
      // bersihkan saat pindah halaman
      s.remove();
    };
  }, [pathname]);

  return null;
}
