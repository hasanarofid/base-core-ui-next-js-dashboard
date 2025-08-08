import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard - Analytics | Vuexy - Bootstrap Admin Template',
  description: '',
}

export default function NewThemeLayout({
  children,
}: {
  children: React.ReactNode
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
        
        {/* Custom CSS untuk perbaikan styling */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Reset dan override untuk mengatasi konflik dengan globals.css */
            .layout-wrapper.layout-content-navbar {
              display: flex !important;
              min-height: 100vh !important;
              background-color: #f8f7fa !important;
            }

            .layout-container {
              display: flex !important;
              width: 100% !important;
            }

            .layout-menu {
              width: 260px !important;
              background-color: #ffffff !important;
              border-right: 1px solid #d9dee3 !important;
              transition: width 0.3s ease !important;
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              height: 100vh !important;
              z-index: 1030 !important;
              overflow: hidden !important;
              display: flex !important;
              flex-direction: column !important;
            }

            .layout-page {
              flex: 1 !important;
              margin-left: 260px !important;
              transition: margin-left 0.3s ease !important;
              min-height: 100vh !important;
              display: flex !important;
              flex-direction: column !important;
            }

            .content-wrapper {
              flex: 1 !important;
              background-color: #f8f7fa !important;
            }

            /* Perbaikan sidebar menu aktif */
            .menu-item.active > .menu-link {
              background-color: rgba(115, 103, 240, 0.16) !important;
              color: rgb(115, 103, 240) !important;
            }
            
            .menu-item.active > .menu-link .menu-icon {
              color: rgb(115, 103, 240) !important;
            }
            
            .menu-sub .menu-item.active > .menu-link {
              background-color: rgb(115, 103, 240) !important;
              color: rgb(255, 255, 255) !important;
            }
            
            .menu-sub .menu-item.active > .menu-link .menu-icon {
              color: rgb(255, 255, 255) !important;
            }
            
            /* Menu sub yang terbuka */
            .menu-sub.menu-open {
              display: block !important;
            }

            /* Perbaikan menu sub yang terbuka secara default */
            .menu-item.open .menu-sub {
              display: block !important;
            }
            
            /* Perbaikan search header hover */
            .navbar-search-wrapper .search-toggler:hover {
              background-color: rgba(115, 103, 240, 0.08) !important;
              border-radius: 0.375rem !important;
              transition: all 0.2s ease-in-out !important;
            }
            
            .navbar-search-wrapper .search-toggler:hover .ti-search {
              color: rgb(115, 103, 240) !important;
            }
            
            .navbar-search-wrapper .search-toggler:hover span {
              color: rgb(115, 103, 240) !important;
            }
            
            /* Perbaikan layout content */
            .content-wrapper {
              margin-left: 0 !important;
              padding-left: 0 !important;
            }
            
            .container-xxl {
              padding-left: 1.5rem !important;
              padding-right: 1.5rem !important;
            }
            
            /* Perbaikan spacing cards */
            .row.g-4 > .col-lg-6,
            .row.g-4 > .col-lg-3,
            .row.g-4 > .col-md-6,
            .row.g-4 > .col-xl-4 {
              margin-bottom: 1.5rem !important;
            }
            
            /* Perbaikan navbar alignment */
            .navbar-nav-right {
              align-items: center !important;
            }
            
            /* Perbaikan search input styling */
            .search-input-wrapper {
              position: absolute !important;
              top: 100% !important;
              left: 0 !important;
              right: 0 !important;
              background: white !important;
              border: 1px solid #d9dee3 !important;
              border-radius: 0.375rem !important;
              box-shadow: 0 0.25rem 1.125rem rgba(161, 172, 184, 0.45) !important;
              z-index: 1030 !important;
            }
            
            /* Perbaikan menu structure */
            .menu-inner {
              padding: 0.5rem 0 !important;
            }
            
            .menu-item {
              margin: 0 !important;
            }
            
            .menu-link {
              padding: 0.625rem 1.625rem !important;
              display: flex !important;
              align-items: center !important;
              text-decoration: none !important;
              color: #566a7f !important;
              transition: all 0.2s ease-in-out !important;
            }
            
            .menu-link:hover {
              background-color: rgba(115, 103, 240, 0.08) !important;
              color: rgb(115, 103, 240) !important;
            }
            
            .menu-icon {
              margin-right: 0.5rem !important;
              font-size: 1.1rem !important;
            }
            
            /* Badge styling */
            .badge {
              font-size: 0.75rem !important;
              font-weight: 500 !important;
            }
            
            /* Perbaikan icon alignment */
            .ti-sm {
              font-size: 0.875rem !important;
            }
            
            .ti-md {
              font-size: 1.125rem !important;
            }
            
            /* Perbaikan navbar search */
            .navbar-search-wrapper {
              position: relative !important;
            }
            
            .search-toggler {
              padding: 0.5rem 0.75rem !important;
              border-radius: 0.375rem !important;
              transition: all 0.2s ease-in-out !important;
            }
            
            /* Perbaikan avatar styling */
            .avatar {
              width: 2.375rem !important;
              height: 2.375rem !important;
            }
            
            .avatar img {
              width: 100% !important;
              height: 100% !important;
              object-fit: cover !important;
            }
            
            /* Perbaikan dropdown styling */
            .dropdown-menu {
              border: 0 !important;
              box-shadow: 0 0.25rem 1.125rem rgba(161, 172, 184, 0.45) !important;
              border-radius: 0.5rem !important;
            }
            
            /* Perbaikan notification badge */
            .badge-notifications {
              position: absolute !important;
              top: -0.25rem !important;
              right: -0.25rem !important;
              font-size: 0.625rem !important;
              min-width: 1.25rem !important;
              height: 1.25rem !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
            }
            
            /* Perbaikan menu header */
            .menu-header {
              padding: 0.75rem 1.625rem 0.375rem !important;
              font-size: 0.75rem !important;
              font-weight: 600 !important;
              color: #a1acb8 !important;
              text-transform: uppercase !important;
              letter-spacing: 0.5px !important;
            }
            
            /* Perbaikan app brand */
            .app-brand {
              padding: 0 1.625rem 1.5rem !important;
              border-bottom: 1px solid #d9dee3 !important;
              margin-bottom: 1rem !important;
            }
            
            .app-brand-link {
              display: flex !important;
              align-items: center !important;
              text-decoration: none !important;
              color: #566a7f !important;
            }
            
            .app-brand-logo {
              margin-right: 0.5rem !important;
            }
            
            /* Perbaikan menu toggle */
            .layout-menu-toggle {
              color: #566a7f !important;
              text-decoration: none !important;
              transition: color 0.2s ease-in-out !important;
            }
            
            .layout-menu-toggle:hover {
              color: rgb(115, 103, 240) !important;
            }
            
            /* Perbaikan menu sub styling */
            .menu-sub {
              background-color: transparent !important;
              border: none !important;
              box-shadow: none !important;
              display: none !important;
            }
            
            .menu-sub .menu-link {
              padding-left: 2.5rem !important;
            }
            
            .menu-sub .menu-sub .menu-link {
              padding-left: 3.5rem !important;
            }
            
            /* Perbaikan menu toggle icon */
            .menu-toggle-icon {
              transition: transform 0.2s ease-in-out !important;
            }
            
            .menu-item.open .menu-toggle-icon {
              transform: rotate(90deg) !important;
            }
            
            /* Perbaikan menu shadow */
            .menu-inner-shadow {
              position: absolute !important;
              bottom: 0 !important;
              left: 0 !important;
              right: 0 !important;
              height: 1rem !important;
              background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.1)) !important;
              pointer-events: none !important;
            }
            
            /* Perbaikan menu active state yang tepat */
            .menu-item.active.open > .menu-link {
              background-color: rgba(115, 103, 240, 0.16) !important;
              color: rgb(115, 103, 240) !important;
            }
            
            .menu-item.active.open > .menu-link .menu-icon {
              color: rgb(115, 103, 240) !important;
            }
            
            /* Perbaikan icon panah menu */
            .menu-toggle {
              position: relative !important;
            }
            
            .menu-toggle-icon {
              position: absolute !important;
              right: 1.625rem !important;
              top: 50% !important;
              transform: translateY(-50%) !important;
              font-size: 0.875rem !important;
              color: #566a7f !important;
              transition: transform 0.2s ease-in-out !important;
            }
            
            .menu-item.open .menu-toggle-icon {
              transform: translateY(-50%) rotate(90deg) !important;
            }
            
            /* Perbaikan badge positioning */
            .menu-link .badge {
              margin-left: auto !important;
              margin-right: 2rem !important;
            }
            
            /* Perbaikan menu item spacing */
            .menu-item {
              position: relative !important;
            }
            
            /* Perbaikan menu link alignment */
            .menu-link {
              position: relative !important;
              width: 100% !important;
            }
            
            /* Perbaikan menu sub display */
            .menu-sub {
              display: none !important;
            }
            
            .menu-sub.menu-open {
              display: block !important;
            }
            
            /* Override globals.css yang mengganggu */
            .menu-item.active {
              background: none !important;
              box-shadow: none !important;
              color: inherit !important;
            }

            .menu-item.active::before {
              display: none !important;
            }

            .menu-item .menu-icon {
              width: auto !important;
              height: auto !important;
              margin-right: 0.5rem !important;
              color: inherit !important;
              transition: all 0.2s ease-in-out !important;
              flex-shrink: 0 !important;
            }

            .menu-item .menu-text {
              color: inherit !important;
              font-weight: inherit !important;
              font-size: inherit !important;
              line-height: inherit !important;
              transition: all 0.2s ease-in-out !important;
              flex: 1 !important;
              white-space: nowrap !important;
              overflow: hidden !important;
              text-overflow: ellipsis !important;
            }

            .menu-item.active .menu-text,
            .menu-item.active .menu-icon {
              color: inherit !important;
              transform: none !important;
            }

            .menu-item:hover .menu-icon {
              transform: none !important;
            }

            .menu-link::before {
              display: none !important;
            }

            .menu-link:hover::before {
              display: none !important;
            }

            .menu-link:hover {
              background-color: rgba(115, 103, 240, 0.08) !important;
              color: rgb(115, 103, 240) !important;
              transform: none !important;
            }

            /* Override navbar styling */
            .layout-navbar {
              background-color: #ffffff !important;
              border-bottom: 1px solid #d9dee3 !important;
              height: 3.875rem !important;
              display: flex !important;
              align-items: center !important;
              padding: 0 1.5rem !important;
              position: sticky !important;
              top: 0 !important;
              z-index: 1020 !important;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
            }

            .bg-navbar-theme {
              background-color: #ffffff !important;
              border-bottom: 1px solid #d9dee3 !important;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
            }

            /* Override card styling */
            .card {
              background-color: #ffffff !important;
              border: 1px solid #d9dee3 !important;
              border-radius: 0.375rem !important;
              box-shadow: 0 0.25rem 1.125rem rgba(75, 70, 92, 0.1) !important;
              transition: all 0.3s ease !important;
              position: relative !important;
              overflow: hidden !important;
              height: 100% !important;
            }

            .card::before {
              display: none !important;
            }

            .card:hover::before {
              display: none !important;
            }

            .card:hover {
              box-shadow: 0 0.25rem 1.125rem rgba(75, 70, 92, 0.15) !important;
              transform: none !important;
              border-color: #d9dee3 !important;
            }

            .card-header {
              padding: 1.5rem !important;
              border-bottom: 1px solid #d9dee3 !important;
              background: transparent !important;
            }

            .card-body {
              padding: 1.5rem !important;
            }

            .card-title {
              font-size: 1.125rem !important;
              font-weight: 600 !important;
              color: #566a7f !important;
              margin-bottom: 0.5rem !important;
              transition: color 0.3s ease !important;
            }

            .card:hover .card-title {
              color: #566a7f !important;
            }
          `
        }} />
        
        {/* Helpers */}
        <script src="/theme/assets/vendor/js/helpers.js"></script>

        {/* Template customizer & Theme config files MUST be included after core stylesheets and helpers.js */}
        <script src="/theme/assets/vendor/js/template-customizer.js"></script>
        <script src="/theme/assets/js/config.js"></script>
      </head>
      <body>
        {children}
        
        {/* Core JS */}
        <script src="/theme/assets/vendor/libs/jquery/jquery.js"></script>
        <script src="/theme/assets/vendor/libs/popper/popper.js"></script>
        <script src="/theme/assets/vendor/js/bootstrap.js"></script>
        <script src="/theme/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js"></script>
        <script src="/theme/assets/vendor/libs/node-waves/node-waves.js"></script>
        <script src="/theme/assets/vendor/libs/hammer/hammer.js"></script>
        <script src="/theme/assets/vendor/libs/i18n/i18n.js"></script>
        <script src="/theme/assets/vendor/libs/typeahead-js/typeahead.js"></script>
        <script src="/theme/assets/vendor/js/menu.js"></script>
        
        {/* Vendors JS */}
        <script src="/theme/assets/vendor/libs/apex-charts/apexcharts.js"></script>
        <script src="/theme/assets/vendor/libs/swiper/swiper.js"></script>
        <script src="/theme/assets/vendor/libs/datatables-bs5/datatables-bootstrap5.js"></script>
        
        {/* Main JS */}
        <script src="/theme/assets/js/main.js"></script>
        
        {/* Page JS */}
        <script src="/theme/assets/js/dashboards-analytics.js"></script>
      </body>
    </html>
  )
} 