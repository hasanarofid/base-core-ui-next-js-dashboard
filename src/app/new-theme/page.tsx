'use client';

import { useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import DashboardContent from './components/DashboardContent';
import Footer from './components/Footer';

export default function NewThemePage() {
  useEffect(() => {
    // Set HTML attributes
    document.documentElement.className = 'light-style layout-navbar-fixed layout-menu-fixed';
    document.documentElement.setAttribute('dir', 'ltr');
    document.documentElement.setAttribute('data-theme', 'theme-default');
    document.documentElement.setAttribute('data-assets-path', '/theme/assets/');
    document.documentElement.setAttribute('data-template', 'vertical-menu-template');

    // Add custom CSS for better styling
    const customCSS = `
      <style>
        /* Prevent horizontal scroll */
        html {
          overflow-x: hidden;
          width: 100%;
          max-width: 100vw;
        }
        
        /* Fix layout issues */
        .layout-wrapper {
          min-height: 100vh;
          overflow-x: hidden;
          width: 100%;
          max-width: 100vw;
        }
        
        .layout-container {
          min-height: 100vh;
        }
        
        .layout-menu {
          width: 260px;
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          z-index: 1038;
          background: #fff;
          border-right: 1px solid #dbdade;
          transition: transform 0.35s ease-in-out;
          transform: translateX(0);
          overflow-y: auto;
          overflow-x: hidden;
        }
        
        .layout-page {
          margin-left: 260px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          padding-left: 0;
          overflow-x: hidden;
          width: calc(100vw - 260px);
        }
        
        .container-xxl {
          padding-left: 0;
          padding-right: 0;
          max-width: 100%;
          margin: 0 auto;
          width: 100%;
        }
        
        .content-wrapper .container-xxl {
          padding-left: 0;
          padding-right: 0;
        }
        
        .container-p-y {
          padding-top: 2rem !important;
          padding-bottom: 2rem !important;
        }
        
        .layout-navbar {
          position: fixed;
          top: 0;
          right: 0;
          left: 260px;
          z-index: 1030;
          height: 4.875rem;
          background: #fff;
          border-bottom: 0 solid #dbdade;
          transition: transform 0.35s ease-in-out;
          padding-left: 0;
          padding-right: 0;
        }
        
        .layout-navbar .container-xxl {
          padding-left: 0.5rem;
          padding-right: 0.5rem;
        }
        
        .content-wrapper {
          margin-top: 4.875rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          padding-left: 1rem;
          padding-right: 1rem;
          overflow-x: hidden;
        }
        
        /* Fix card styling */
        .card {
          box-shadow: 0 0.25rem 1.125rem rgba(75, 70, 92, 0.1);
          border-radius: 0.5rem;
          border: 0 solid #dbdade;
          margin-bottom: 1.5rem;
        }
        
        .swiper-card-advance-bg {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 0.5rem;
          color: #fff;
          position: relative;
          overflow: hidden;
          min-height: 200px;
        }
        
        .card-website-analytics-img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
        }
        
        .website-analytics-text-bg {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          color: #fff;
        }
        
        /* Card sizing and spacing */
        .col-lg-6 .card {
          height: 100%;
        }
        
        .col-lg-3 .card {
          height: 100%;
        }
        
        .col-lg-4 .card {
          height: 100%;
        }
        
        /* Row spacing */
        .row {
          margin-left: 0;
          margin-right: 0;
        }
        
        .row > [class*="col-"] {
          padding-left: 0.5rem;
          padding-right: 0.5rem;
        }
        
        /* First and last column padding */
        .row > [class*="col-"]:first-child {
          padding-left: 0;
        }
        
        .row > [class*="col-"]:last-child {
          padding-right: 0;
        }
        
        /* Fix menu styling */
        .menu-inner {
          padding: 0.25rem;
        }
        
        .menu-item {
          margin-bottom: 0.125rem;
        }
        
        .menu-item {
          margin-bottom: 0.25rem;
        }
        
        .menu-link {
          border-radius: 0.375rem;
          padding: 0.625rem 0.75rem;
          color: #6f6b7d;
          text-decoration: none;
          transition: all 0.15s ease-in-out;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          text-align: left;
          width: 100%;
          position: relative;
        }
        
        .menu-link > div {
          text-align: left;
          flex: 1;
        }
        
        .menu-link .badge {
          margin-left: auto;
          font-size: 0.75em;
          font-weight: 700;
          padding: 0.35em 0.65em;
          border-radius: 0.375rem;
        }
        
        .menu-link:hover {
          color: #5d596c;
          background-color: rgba(75, 70, 92, 0.04);
        }
        
        .menu-link.active {
          color: #fff;
          background-color: #7367f0;
        }
        
        .menu-sub {
          display: none;
          padding-left: 1.25rem;
        }
        
        .menu-sub .menu-link {
          padding-left: 0.5rem;
        }
        
        .menu-item.open .menu-sub {
          display: block;
        }
        
        .menu-toggle::after {
          content: "\\f107";
          font-family: "tabler-icons";
          font-size: 0.75rem;
          transition: transform 0.15s ease-in-out;
          margin-left: auto;
        }
        
        .menu-item.open .menu-toggle::after {
          transform: rotate(180deg);
        }
        
        .menu-icon {
          margin-right: 0.5rem;
          font-size: 1.25rem;
          width: 1.375rem;
          height: 1.375rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .menu-header {
          padding: 0.25rem 0.75rem;
          margin-top: 0.25rem;
          margin-bottom: 0.125rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: #a8aaae;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-align: left;
        }
        
        .menu-header-text {
          text-align: left;
          display: block;
        }
        
        /* App brand styling */
        .app-brand {
          padding: 0.5rem 1rem;
          border-bottom: 1px solid #dbdade;
        }
        
        .app-brand-link {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: #5d596c;
        }
        
        .app-brand-logo {
          margin-right: 0.5rem;
        }
        
        .app-brand-text {
          font-size: 1.25rem;
          font-weight: 700;
          color: #5d596c;
        }
        
        /* Menu inner shadow */
        .menu-inner-shadow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, transparent 100%);
          pointer-events: none;
        }
        
        /* Content wrapper styling */
        .content-wrapper {
          margin-left: 260px;
          margin-top: 70px;
          min-height: calc(100vh - 70px);
          background: #f5f5f9;
          padding: 0;
        }
        
        .content-wrapper .container-xxl {
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
        
        /* Container styling for better alignment */
        .container-xxl {
          padding-left: 0 !important;
          padding-right: 0 !important;
          max-width: 100% !important;
        }
        
        .container-p-y {
          padding-top: 1.5rem !important;
          padding-bottom: 1.5rem !important;
        }
        
        .container-p-x {
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
        
        /* Card styling improvements */
        .card {
          background: #fff;
          border: 1px solid #dbdade;
          border-radius: 0.5rem;
          box-shadow: 0 0.125rem 0.25rem rgba(161, 172, 184, 0.11);
          margin-bottom: 1rem;
          overflow: hidden;
          word-wrap: break-word;
        }
        
        .card-header {
          background: transparent;
          border-bottom: 1px solid #dbdade;
          padding: 1rem 1.5rem;
        }
        
        .card-body {
          padding: 1.5rem;
        }
        
        .card-title {
          margin-bottom: 0.5rem;
          font-weight: 600;
        }
        
        .card-subtitle {
          color: #a8aaae;
          font-size: 0.875rem;
        }
        
        /* Progress bar styling */
        .progress {
          background-color: #f5f5f9;
          border-radius: 0.375rem;
          overflow: hidden;
        }
        
        .progress-bar {
          background-color: #7367f0;
          transition: width 0.6s ease;
        }
        
        .progress-bar.bg-success {
          background-color: #71dd37;
        }
        
        /* Avatar styling */
        .avatar-initial {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          font-weight: 600;
          font-size: 0.875rem;
        }
        
        .bg-label-primary {
          background-color: rgba(115, 103, 240, 0.16);
          color: #7367f0;
        }
        
        .bg-label-success {
          background-color: rgba(113, 221, 55, 0.16);
          color: #71dd37;
        }
        
        .bg-label-warning {
          background-color: rgba(255, 159, 67, 0.16);
          color: #ff9f43;
        }
        
        .bg-label-danger {
          background-color: rgba(234, 84, 85, 0.16);
          color: #ea5455;
        }
        
        .bg-label-info {
          background-color: rgba(0, 207, 232, 0.16);
          color: #00cfe8;
        }
        
        /* Swiper card styling */
        .swiper-card-advance-bg {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 0.5rem;
          padding: 1.5rem;
          color: white;
          min-height: 200px;
        }
        
        .website-analytics-text-bg {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-weight: 600;
        }
        
        .card-website-analytics-img {
          max-width: 100%;
          height: auto;
        }
        
        /* Navbar styling */
        .layout-navbar {
          position: fixed;
          top: 0;
          right: 0;
          left: 260px;
          z-index: 1037;
          background: #fff;
          border-bottom: 1px solid #dbdade;
          padding: 0;
          height: 70px;
        }
        
        .layout-navbar .container-xxl {
          padding-left: 1rem !important;
          padding-right: 1rem !important;
        }
        
        .navbar-nav-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          height: 100%;
          padding: 0 1rem;
          flex-wrap: wrap;
        }
        
        .navbar-nav {
          display: flex;
          align-items: center;
          list-style: none;
          margin: 0;
          padding: 0;
          flex-wrap: wrap;
        }
        
        .nav-item {
          margin-left: 0.75rem;
          position: relative;
        }
        
        .nav-link {
          color: #6f6b7d;
          text-decoration: none;
          padding: 0.5rem;
          border-radius: 0.375rem;
          transition: all 0.15s ease-in-out;
          display: flex;
          align-items: center;
        }
        
        .navbar-search-wrapper {
          margin-right: 1rem;
        }
        
        .search-toggler {
          color: #6f6b7d;
          text-decoration: none;
          padding: 0.5rem 0.75rem;
          border-radius: 0.375rem;
          transition: all 0.15s ease-in-out;
          display: flex;
          align-items: center;
          background-color: rgba(75, 70, 92, 0.04);
        }
        
        .search-toggler:hover {
          background-color: rgba(75, 70, 92, 0.08);
        }
        
        .nav-link:hover {
          color: #5d596c;
          background-color: rgba(75, 70, 92, 0.04);
        }
        
        .dropdown-toggle::after {
          content: "";
          display: none;
        }
        
        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          z-index: 1000;
          display: none;
          min-width: 10rem;
          padding: 0.5rem 0;
          margin: 0.125rem 0 0;
          font-size: 0.875rem;
          color: #6f6b7d;
          text-align: left;
          list-style: none;
          background-color: #fff;
          background-clip: padding-box;
          border: 1px solid #dbdade;
          border-radius: 0.375rem;
          box-shadow: 0 0.25rem 1rem rgba(161, 172, 184, 0.45);
        }
        
        .dropdown-menu.show {
          display: block;
        }
        
        .dropdown-item {
          display: block;
          width: 100%;
          padding: 0.25rem 1rem;
          clear: both;
          font-weight: 400;
          color: #6f6b7d;
          text-align: inherit;
          text-decoration: none;
          white-space: nowrap;
          background-color: transparent;
          border: 0;
        }
        
        .dropdown-item:hover {
          color: #5d596c;
          background-color: rgba(75, 70, 92, 0.04);
        }
        
        .badge {
          display: inline-block;
          padding: 0.35em 0.65em;
          font-size: 0.75em;
          font-weight: 700;
          line-height: 1;
          color: #fff;
          text-align: center;
          white-space: nowrap;
          vertical-align: baseline;
          border-radius: 0.375rem;
        }
        
        .badge-notifications {
          position: absolute;
          top: 0;
          right: 0;
          transform: translate(50%, -50%);
        }
        
        .avatar {
          position: relative;
          display: inline-block;
          width: 2.5rem;
          height: 2.5rem;
        }
        
        .avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          border: 2px solid #fff;
          box-shadow: 0 0.125rem 0.25rem rgba(161, 172, 184, 0.11);
        }
        
        .avatar-online {
          position: relative;
        }
        
        .avatar-online::after {
          content: "";
          position: absolute;
          bottom: 0;
          right: 0;
          width: 0.75rem;
          height: 0.75rem;
          background-color: #71dd37;
          border: 2px solid #fff;
          border-radius: 50%;
          box-shadow: 0 0.125rem 0.25rem rgba(161, 172, 184, 0.11);
        }
        
        .avatar-online::after {
          content: "";
          position: absolute;
          bottom: 0;
          right: 0;
          width: 0.75rem;
          height: 0.75rem;
          background-color: #71dd37;
          border: 2px solid #fff;
          border-radius: 50%;
        }
        

        
        /* Fix progress bars */
        .progress {
          height: 0.5rem;
          background-color: #f5f5f9;
          border-radius: 0.375rem;
          overflow: hidden;
        }
        
        .progress-bar {
          background-color: #7367f0;
          transition: width 0.6s ease;
        }
        
        /* Fix badges */
        .badge {
          font-size: 0.75em;
          font-weight: 700;
          padding: 0.35em 0.65em;
          border-radius: 0.375rem;
        }
        
        .bg-label-primary {
          background-color: rgba(115, 103, 240, 0.16) !important;
          color: #7367f0 !important;
        }
        
        .bg-label-success {
          background-color: rgba(40, 199, 111, 0.16) !important;
          color: #28c76f !important;
        }
        
        .bg-label-info {
          background-color: rgba(0, 207, 232, 0.16) !important;
          color: #00cfe8 !important;
        }
        
        .bg-label-warning {
          background-color: rgba(255, 159, 67, 0.16) !important;
          color: #ff9f43 !important;
        }
        
        .bg-label-danger {
          background-color: rgba(234, 84, 85, 0.16) !important;
          color: #ea5455 !important;
        }
        
        .bg-label-secondary {
          background-color: rgba(168, 170, 174, 0.16) !important;
          color: #a8aaae !important;
        }
        
        /* Fix typography */
        body {
          font-family: "Public Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
          font-size: 0.9375rem;
          font-weight: 400;
          line-height: 1.47;
          color: #6f6b7d;
          background: #f8f7fa;
          overflow-x: hidden;
          width: 100%;
          max-width: 100vw;
        }
        
        h1, h2, h3, h4, h5, h6 {
          color: #5d596c;
          font-weight: 600;
          line-height: 1.37;
        }
        
        /* Fix spacing */
        .container-p-y {
          padding-top: 2rem !important;
          padding-bottom: 2rem !important;
        }
        
        .container-p-x {
          padding-right: 0 !important;
          padding-left: 0 !important;
        }
        
        /* Fix footer */
        .footer {
          padding: 1.5rem 0;
          color: #6f6b7d;
          background-color: #fff;
          border-top: 0 solid #dbdade;
        }
      </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', customCSS);

    // Import fonts
    const fontLinks = [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap' }
    ];

    // Import CSS files
    const cssLinks = [
      '/theme/assets/vendor/fonts/fontawesome.css',
      '/theme/assets/vendor/fonts/tabler-icons.css',
      '/theme/assets/vendor/fonts/flag-icons.css',
      '/theme/assets/vendor/css/rtl/core.css',
      '/theme/assets/vendor/css/rtl/theme-default.css',
      '/theme/assets/css/demo.css',
      '/theme/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css',
      '/theme/assets/vendor/libs/node-waves/node-waves.css',
      '/theme/assets/vendor/libs/typeahead-js/typeahead.css',
      '/theme/assets/vendor/libs/apex-charts/apex-charts.css',
      '/theme/assets/vendor/libs/swiper/swiper.css',
      '/theme/assets/vendor/libs/datatables-bs5/datatables.bootstrap5.css',
      '/theme/assets/vendor/libs/datatables-responsive-bs5/responsive.bootstrap5.css',
      '/theme/assets/vendor/libs/datatables-checkboxes-jquery/datatables.checkboxes.css',
      '/theme/assets/vendor/css/pages/cards-advance.css',
      '/theme/assets/vendor/css/pages/dashboards-analytics.css'
    ];

    // Import JavaScript files
    const jsScripts = [
      '/theme/assets/vendor/js/helpers.js',
      '/theme/assets/vendor/js/template-customizer.js',
      '/theme/assets/js/config.js',
      '/theme/assets/vendor/libs/jquery/jquery.js',
      '/theme/assets/vendor/libs/popper/popper.js',
      '/theme/assets/vendor/js/bootstrap.js',
      '/theme/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js',
      '/theme/assets/vendor/libs/node-waves/node-waves.js',
      '/theme/assets/vendor/libs/hammer/hammer.js',
      '/theme/assets/vendor/libs/i18n/i18n.js',
      '/theme/assets/vendor/libs/typeahead-js/typeahead.js',
      '/theme/assets/vendor/js/menu.js',
      '/theme/assets/vendor/libs/apex-charts/apexcharts.js',
      '/theme/assets/vendor/libs/swiper/swiper.js',
      '/theme/assets/vendor/libs/datatables-bs5/datatables-bootstrap5.js',
      '/theme/assets/js/main.js',
      '/theme/assets/js/dashboards-analytics.js'
    ];

    // Add font links
    fontLinks.forEach(font => {
      const link = document.createElement('link');
      Object.assign(link, font);
      document.head.appendChild(link);
    });

    // Add CSS links
    cssLinks.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    });

    // Add JavaScript scripts
    const loadScripts = async () => {
      for (const src of jsScripts) {
        const script = document.createElement('script');
        script.src = src;
        script.async = false;
        document.body.appendChild(script);
        
        // Wait for script to load
        await new Promise((resolve) => {
          script.onload = resolve;
          script.onerror = resolve; // Continue even if script fails to load
        });
      }
    };

    loadScripts();

    // Add menu functionality
    const addMenuFunctionality = () => {
      const menuToggles = document.querySelectorAll('.menu-toggle');
      menuToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
          e.preventDefault();
          const menuItem = toggle.closest('.menu-item');
          if (menuItem) {
            menuItem.classList.toggle('open');
          }
        });
      });
    };

    // Wait for DOM to be ready
    setTimeout(addMenuFunctionality, 1000);

    return () => {
      // Cleanup - remove all added elements
      const links = document.querySelectorAll('link[href*="/theme/assets/"]');
      links.forEach(link => link.remove());
      
      const scripts = document.querySelectorAll('script[src*="/theme/assets/"]');
      scripts.forEach(script => script.remove());
      
      // Remove custom CSS
      const customStyle = document.querySelector('style');
      if (customStyle) {
        customStyle.remove();
      }
    };
  }, []);

  return (
    <>
      {/* Layout wrapper */}
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          {/* Menu */}
          <Sidebar />
          {/* / Menu */}

          {/* Layout container */}
          <div className="layout-page">
            {/* Navbar */}
            <Navbar />
            {/* / Navbar */}

            {/* Content wrapper */}
            <div className="content-wrapper">
              {/* Content */}
              <DashboardContent />
              {/* / Content */}

              {/* Footer */}
              <Footer />
              {/* / Footer */}

              <div className="content-backdrop fade"></div>
            </div>
            {/* Content wrapper */}
          </div>
          {/* / Layout page */}
        </div>

        {/* Overlay */}
        <div className="layout-overlay layout-menu-toggle"></div>

        {/* Drag Target Area To SlideIn Menu On Small Screens */}
        <div className="drag-target"></div>
      </div>
      {/* / Layout wrapper */}
    </>
  );
}
