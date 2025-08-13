"use client";

import Script from "next/script";

/**
 * Semua script jalan setelah halaman interactive,
 * agar HTML awal dari server tidak berubah sebelum React hydrate.
 */
export default function VendorScripts() {
  return (
    <>
      {/* Helpers & Config */}
      <Script
        src="/theme/assets/vendor/js/helpers.js"
        strategy="afterInteractive"
      />
      <Script src="/theme/assets/js/config.js" strategy="afterInteractive" />

      {/* Core JS */}
      <Script
        src="/theme/assets/vendor/libs/jquery/jquery.js"
        strategy="afterInteractive"
      />
      <Script
        src="/theme/assets/vendor/libs/popper/popper.js"
        strategy="afterInteractive"
      />
      <Script
        src="/theme/assets/vendor/js/bootstrap.js"
        strategy="afterInteractive"
      />
      <Script
        src="/theme/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js"
        strategy="afterInteractive"
      />
      <Script
        src="/theme/assets/vendor/libs/node-waves/node-waves.js"
        strategy="afterInteractive"
      />
      <Script
        src="/theme/assets/vendor/js/menu.js"
        strategy="afterInteractive"
      />
      <Script
        src="/theme/assets/vendor/libs/hammer/hammer.js"
        strategy="afterInteractive"
      />
      <Script
        src="/theme/assets/vendor/libs/i18n/i18n.js"
        strategy="afterInteractive"
      />
      <Script
        src="/theme/assets/vendor/libs/typeahead-js/typeahead.js"
        strategy="afterInteractive"
      />

      {/* Vendors JS (boleh lazy karena non-kritis) */}
      <Script
        src="/theme/assets/vendor/libs/apex-charts/apexcharts.js"
        strategy="lazyOnload"
      />
      <Script
        src="/theme/assets/vendor/libs/swiper/swiper.js"
        strategy="lazyOnload"
      />
      <Script
        src="/theme/assets/vendor/libs/datatables-bs5/datatables-bootstrap5.js"
        strategy="lazyOnload"
      />

      {/* Main & Page JS */}
      {/* <Script src="/theme/assets/js/main.js" strategy="lazyOnload" /> */}
      {/* <Script
        src="/theme/assets/js/dashboards-analytics.js"
        strategy="lazyOnload"
      /> */}
    </>
  );
}
