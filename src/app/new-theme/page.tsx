'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';

// Type declaration for Swiper
declare global {
  interface Window {
    Swiper: any;
  }
}

export default function NewThemePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboards');
  const [subMenuOpen, setSubMenuOpen] = useState({
    dashboards: true,
    layouts: false,
    invoice: false,
    users: false,
    roles: false,
    pages: false,
    userProfile: false,
    accountSettings: false,
    helpCenter: false,
    misc: false
  });

  // Initialize Vuexy theme scripts
  useEffect(() => {
    // Load external scripts if they exist
    const loadScript = (src: string) => {
      const script = document.createElement('script');
      script.src = src;
      script.defer = true;
      document.head.appendChild(script);
    };

    // Load theme scripts
    loadScript('/theme/assets/vendor/js/helpers.js');
    loadScript('/theme/assets/vendor/js/template-customizer.js');
    loadScript('/theme/assets/js/config.js');
    
    // Initialize Swiper
    const initSwiper = () => {
      if (typeof window !== 'undefined' && window.Swiper) {
        new window.Swiper('#swiper-with-pagination-cards', {
          slidesPerView: 1,
          spaceBetween: 0,
          loop: true,
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          autoplay: {
            delay: 5000,
            disableOnInteraction: false,
          },
        });
      }
    };

    // Initialize Menu Toggle
    const initMenuToggle = () => {
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

    // Initialize Dropdown Toggle
    const initDropdownToggle = () => {
      const dropdownToggles = document.querySelectorAll('[data-bs-toggle="dropdown"]');
      dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
          e.preventDefault();
          const dropdown = toggle.nextElementSibling;
          if (dropdown && dropdown.classList.contains('dropdown-menu')) {
            // Close all other dropdowns
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
              if (menu !== dropdown) {
                menu.classList.remove('show');
              }
            });
            // Toggle current dropdown
            dropdown.classList.toggle('show');
          }
        });
      });

      // Close dropdowns when clicking outside
      document.addEventListener('click', (e) => {
        const target = e.target as Element;
        if (!target.closest('.dropdown')) {
          document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
            menu.classList.remove('show');
          });
        }
      });
    };

    // Wait for Swiper to load
    const checkSwiper = setInterval(() => {
      if (typeof window !== 'undefined' && window.Swiper) {
        clearInterval(checkSwiper);
        initSwiper();
      }
    }, 100);

    // Initialize menu toggle after DOM is ready
    setTimeout(() => {
      initMenuToggle();
      initDropdownToggle();
    }, 100);

    // Cleanup
    return () => {
      clearInterval(checkSwiper);
    };
  }, []);

  const toggleSubMenu = (menuKey: string) => {
    setSubMenuOpen(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey as keyof typeof prev]
    }));
  };

  return (
    <>
      <Head>
        <title>Dashboard - Analytics | Vuexy - Bootstrap Admin Template</title>
        <meta name="description" content="" />
        
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/theme/assets/img/favicon/favicon.ico" />
        
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap"
          rel="stylesheet" />

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
      </Head>

      {/* Layout wrapper */}
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          {/* Menu */}
          <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
            <div className="app-brand demo">
              <Link href="/" className="app-brand-link">
                <span className="app-brand-logo demo">
                  <svg width="32" height="22" viewBox="0 0 32 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z"
                      fill="#7367F0" />
                    <path
                      opacity="0.06"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z"
                      fill="#161616" />
                    <path
                      opacity="0.06"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z"
                      fill="#161616" />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z"
                      fill="#7367F0" />
                  </svg>
                </span>
                <span className="app-brand-text demo menu-text fw-bold">Vuexy</span>
              </Link>

              <a href="#" className="layout-menu-toggle menu-link text-large ms-auto">
                <i className="ti menu-toggle-icon d-none d-xl-block ti-sm align-middle"></i>
                <i className="ti ti-x d-block d-xl-none ti-sm align-middle"></i>
              </a>
            </div>

            <div className="menu-inner-shadow"></div>

            <ul className="menu-inner py-1">
              {/* Menu items */}
              <li className={`menu-item ${activeMenu === 'dashboards' ? 'active open' : ''}`}>
                <a href="#" className="menu-link menu-toggle" onClick={() => toggleSubMenu('dashboards')}>
                  <i className="menu-icon tf-icons ti ti-smart-home"></i>
                  <div>Dashboards</div>
                  <div className="badge bg-label-primary rounded-pill ms-auto">3</div>
                </a>
                <ul className={`menu-sub ${subMenuOpen.dashboards ? 'open' : ''}`}>
                  <li className="menu-item active">
                    <Link href="/" className="menu-link">
                      <div>Analytics</div>
                    </Link>
                  </li>
                  <li className="menu-item">
                    <Link href="/dashboards/crm" className="menu-link">
                      <div>CRM</div>
                    </Link>
                  </li>
                  <li className="menu-item">
                    <Link href="/dashboards/ecommerce" className="menu-link">
                      <div>eCommerce</div>
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Add other menu items similarly */}
              
            </ul>
          </aside>

          <div className="layout-page">
            {/* Add navbar and content */}
          </div>
        </div>
      </div>
    </>
  );
}
