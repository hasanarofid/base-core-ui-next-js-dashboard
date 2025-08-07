import type { Metadata } from 'next';
import '../new_global.css';

export const metadata: Metadata = {
  title: 'Dashboard - Analytics | Vuexy - Bootstrap Admin Template',
  description: '',
};

export default function NewThemeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="light-style layout-navbar-fixed layout-menu-fixed"
      dir="ltr"
      data-theme="theme-default"
      data-assets-path="/theme/assets/"
      data-template="vertical-menu-template"
    >
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0"
        />
        <title>Dashboard - Analytics | Vuexy - Bootstrap Admin Template</title>
        <meta name="description" content="" />
        
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/theme/assets/img/favicon/favicon.ico" />
        
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap"
          rel="stylesheet"
        />
        
        {/* Icons */}
        <link rel="stylesheet" href="/theme/assets/vendor/fonts/fontawesome.css" />
        <link rel="stylesheet" href="/theme/assets/vendor/fonts/tabler-icons.css" />
        <link rel="stylesheet" href="/theme/assets/vendor/fonts/flag-icons.css" />
        
        {/* Core CSS */}
        <link rel="stylesheet" href="/theme/assets/vendor/css/rtl/core.css" className="template-customizer-core-css" />
        <link rel="stylesheet" href="/theme/assets/vendor/css/rtl/theme-default.css" className="template-customizer-theme-css" />
        <link rel="stylesheet" href="/theme/assets/css/demo.css" />
        
        {/* Vendors CSS */}
        <link rel="stylesheet" href="/theme/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css" />
        <link rel="stylesheet" href="/theme/assets/vendor/libs/node-waves/node-waves.css" />
        <link rel="stylesheet" href="/theme/assets/vendor/libs/typeahead-js/typeahead.css" />
        <link rel="stylesheet" href="/theme/assets/vendor/libs/apex-charts/apex-charts.css" />
        <link rel="stylesheet" href="/theme/assets/vendor/libs/swiper/swiper.css" />
        <link rel="stylesheet" href="/theme/assets/vendor/libs/datatables-bs5/datatables.bootstrap5.css" />
        <link rel="stylesheet" href="/theme/assets/vendor/libs/datatables-responsive-bs5/responsive.bootstrap5.css" />
        <link rel="stylesheet" href="/theme/assets/vendor/libs/datatables-checkboxes-jquery/datatables.checkboxes.css" />
        
        {/* Page CSS */}
        <link rel="stylesheet" href="/theme/assets/vendor/css/pages/cards-advance.css" />
        
        {/* Helpers */}
        <script src="/theme/assets/vendor/js/helpers.js" defer></script>
        
        {/* Template customizer & Theme config files */}
        <script src="/theme/assets/vendor/js/template-customizer.js" defer></script>
        <script src="/theme/assets/js/config.js" defer></script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
} 