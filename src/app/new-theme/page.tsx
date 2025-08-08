'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Type declaration for Swiper
declare global {
  interface Window {
    Swiper: any;
  }
}

export default function NewThemePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboards');

  // Initialize components after page loads
  useEffect(() => {
    // Initialize Swiper after component mounts
    const initSwiper = () => {
      if (typeof window !== 'undefined' && window.Swiper) {
        const swiperEl = document.getElementById('swiper-with-pagination-cards');
        if (swiperEl) {
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
      }
    };

    // Initialize menu toggles
    const initMenuToggles = () => {
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

    // Initialize dropdown toggles
    const initDropdownToggles = () => {
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

    // Initialize search functionality
    const initSearch = () => {
      const searchToggler = document.querySelector('.search-toggler');
      const searchWrapper = document.querySelector('.search-input-wrapper');
      const searchInput = document.querySelector('.search-input') as HTMLInputElement;
      const searchClose = document.querySelector('.search-toggler.cursor-pointer');

      if (searchToggler && searchWrapper) {
        searchToggler.addEventListener('click', (e) => {
          e.preventDefault();
          searchWrapper.classList.toggle('d-none');
          if (!searchWrapper.classList.contains('d-none')) {
            searchInput?.focus();
          }
        });
      }

      if (searchClose) {
        searchClose.addEventListener('click', () => {
          searchWrapper?.classList.add('d-none');
        });
      }
    };

    // Wait for scripts to load and then initialize
    const timer = setTimeout(() => {
        initSwiper();
      initMenuToggles();
      initDropdownToggles();
      initSearch();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
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
                    fill="#7367F0"
                  />
                  <path
                    opacity="0.06"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z"
                    fill="#161616"
                  />
                  <path
                    opacity="0.06"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z"
                    fill="#161616"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z"
                    fill="#7367F0"
                  />
                </svg>
              </span>
              <span className="app-brand-text demo menu-text fw-bold">Vuexy</span>
            </Link>

            <a href="javascript:void(0);" className="layout-menu-toggle menu-link text-large ms-auto">
              <i className="ti menu-toggle-icon d-none d-xl-block ti-sm align-middle"></i>
              <i className="ti ti-x d-block d-xl-none ti-sm align-middle"></i>
            </a>
          </div>

          <div className="menu-inner-shadow"></div>

          <ul className="menu-inner py-1">
            {/* Dashboards */}
            <li className="menu-item active open">
              <a href="javascript:void(0);" className="menu-link menu-toggle">
                  <i className="menu-icon tf-icons ti ti-smart-home"></i>
                <div data-i18n="Dashboards">Dashboards</div>
                  <div className="badge bg-label-primary rounded-pill ms-auto">3</div>
                  <i className="ti menu-toggle-icon d-none d-xl-block ti-sm align-middle"></i>
                </a>
                <ul className="menu-sub">
                  <li className="menu-item active">
                    <Link href="/" className="menu-link">
                    <div data-i18n="Analytics">Analytics</div>
                    </Link>
                  </li>
                  <li className="menu-item">
                    <Link href="/dashboards/crm" className="menu-link">
                    <div data-i18n="CRM">CRM</div>
                    </Link>
                  </li>
                  <li className="menu-item">
                    <Link href="/dashboards/ecommerce" className="menu-link">
                    <div data-i18n="eCommerce">eCommerce</div>
                  </Link>
                </li>
              </ul>
            </li>

            {/* Layouts */}
            <li className="menu-item">
              <a href="javascript:void(0);" className="menu-link menu-toggle">
                <i className="menu-icon tf-icons ti ti-layout-sidebar"></i>
                <div data-i18n="Layouts">Layouts</div>
                <i className="ti menu-toggle-icon d-none d-xl-block ti-sm align-middle"></i>
              </a>
              <ul className="menu-sub">
                <li className="menu-item">
                  <Link href="/layouts/collapsed-menu" className="menu-link">
                    <div data-i18n="Collapsed menu">Collapsed menu</div>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link href="/layouts/content-navbar" className="menu-link">
                    <div data-i18n="Content navbar">Content navbar</div>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link href="/layouts/content-navbar-with-sidebar" className="menu-link">
                    <div data-i18n="Content nav + Sidebar">Content nav + Sidebar</div>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link href="/horizontal-menu-template" className="menu-link" target="_blank">
                    <div data-i18n="Horizontal">Horizontal</div>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link href="/layouts/without-menu" className="menu-link">
                    <div data-i18n="Without menu">Without menu</div>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link href="/layouts/without-navbar" className="menu-link">
                    <div data-i18n="Without navbar">Without navbar</div>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link href="/layouts/fluid" className="menu-link">
                    <div data-i18n="Fluid">Fluid</div>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link href="/layouts/container" className="menu-link">
                    <div data-i18n="Container">Container</div>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link href="/layouts/blank" className="menu-link">
                    <div data-i18n="Blank">Blank</div>
                  </Link>
                </li>
              </ul>
            </li>

            {/* Apps & Pages */}
            <li className="menu-header small text-uppercase">
              <span className="menu-header-text">Apps &amp; Pages</span>
            </li>
            
            <li className="menu-item">
              <Link href="/app/email" className="menu-link">
                <i className="menu-icon tf-icons ti ti-mail"></i>
                <div data-i18n="Email">Email</div>
              </Link>
            </li>
            
            <li className="menu-item">
              <Link href="/app/chat" className="menu-link">
                <i className="menu-icon tf-icons ti ti-messages"></i>
                <div data-i18n="Chat">Chat</div>
              </Link>
            </li>

            <li className="menu-item">
              <Link href="/app/calendar" className="menu-link">
                <i className="menu-icon tf-icons ti ti-calendar"></i>
                <div data-i18n="Calendar">Calendar</div>
              </Link>
            </li>

            <li className="menu-item">
              <Link href="/app/kanban" className="menu-link">
                <i className="menu-icon tf-icons ti ti-layout-kanban"></i>
                <div data-i18n="Kanban">Kanban</div>
              </Link>
            </li>

            {/* Invoice */}
            <li className="menu-item">
              <a href="javascript:void(0);" className="menu-link menu-toggle">
                <i className="menu-icon tf-icons ti ti-file-dollar"></i>
                <div data-i18n="Invoice">Invoice</div>
                <div className="badge bg-label-danger rounded-pill ms-auto">4</div>
                <i className="ti menu-toggle-icon d-none d-xl-block ti-sm align-middle"></i>
              </a>
              <ul className="menu-sub">
                <li className="menu-item">
                  <Link href="/app/invoice/list" className="menu-link">
                    <div data-i18n="List">List</div>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link href="/app/invoice/preview" className="menu-link">
                    <div data-i18n="Preview">Preview</div>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link href="/app/invoice/edit" className="menu-link">
                    <div data-i18n="Edit">Edit</div>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link href="/app/invoice/add" className="menu-link">
                    <div data-i18n="Add">Add</div>
                  </Link>
                </li>
              </ul>
            </li>

            {/* Users */}
            <li className="menu-item">
              <a href="javascript:void(0);" className="menu-link menu-toggle">
                <i className="menu-icon tf-icons ti ti-users"></i>
                <div data-i18n="Users">Users</div>
                <i className="ti menu-toggle-icon d-none d-xl-block ti-sm align-middle"></i>
              </a>
              <ul className="menu-sub">
                <li className="menu-item">
                  <Link href="/app/user/list" className="menu-link">
                    <div data-i18n="List">List</div>
                  </Link>
                </li>
                <li className="menu-item">
                  <a href="javascript:void(0);" className="menu-link menu-toggle">
                    <div data-i18n="View">View</div>
                    <i className="ti menu-toggle-icon d-none d-xl-block ti-sm align-middle"></i>
                  </a>
                  <ul className="menu-sub">
                    <li className="menu-item">
                      <Link href="/app/user/view/account" className="menu-link">
                        <div data-i18n="Account">Account</div>
                      </Link>
                    </li>
                    <li className="menu-item">
                      <Link href="/app/user/view/security" className="menu-link">
                        <div data-i18n="Security">Security</div>
                      </Link>
                    </li>
                    <li className="menu-item">
                      <Link href="/app/user/view/billing" className="menu-link">
                        <div data-i18n="Billing & Plans">Billing & Plans</div>
                      </Link>
                    </li>
                    <li className="menu-item">
                      <Link href="/app/user/view/notifications" className="menu-link">
                        <div data-i18n="Notifications">Notifications</div>
                      </Link>
                    </li>
                    <li className="menu-item">
                      <Link href="/app/user/view/connections" className="menu-link">
                        <div data-i18n="Connections">Connections</div>
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>

            {/* Roles & Permissions */}
            <li className="menu-item">
              <a href="javascript:void(0);" className="menu-link menu-toggle">
                <i className="menu-icon tf-icons ti ti-settings"></i>
                <div data-i18n="Roles & Permissions">Roles & Permissions</div>
              </a>
              <ul className="menu-sub">
                <li className="menu-item">
                  <Link href="/app/access/roles" className="menu-link">
                    <div data-i18n="Roles">Roles</div>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link href="/app/access/permission" className="menu-link">
                    <div data-i18n="Permission">Permission</div>
                  </Link>
                </li>
              </ul>
            </li>

            {/* Pages */}
            <li className="menu-item">
              <a href="javascript:void(0);" className="menu-link menu-toggle">
                <i className="menu-icon tf-icons ti ti-file"></i>
                <div data-i18n="Pages">Pages</div>
                <i className="ti menu-toggle-icon d-none d-xl-block ti-sm align-middle"></i>
              </a>
              <ul className="menu-sub">
                <li className="menu-item">
                  <a href="javascript:void(0);" className="menu-link menu-toggle">
                    <div data-i18n="User Profile">User Profile</div>
                    <i className="ti menu-toggle-icon d-none d-xl-block ti-sm align-middle"></i>
                  </a>
                  <ul className="menu-sub">
                    <li className="menu-item">
                      <Link href="/pages/profile/user" className="menu-link">
                        <div data-i18n="Profile">Profile</div>
                      </Link>
                    </li>
                    <li className="menu-item">
                      <Link href="/pages/profile/teams" className="menu-link">
                        <div data-i18n="Teams">Teams</div>
                      </Link>
                    </li>
                    <li className="menu-item">
                      <Link href="/pages/profile/projects" className="menu-link">
                        <div data-i18n="Projects">Projects</div>
                      </Link>
                    </li>
                    <li className="menu-item">
                      <Link href="/pages/profile/connections" className="menu-link">
                        <div data-i18n="Connections">Connections</div>
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="menu-item">
                  <a href="javascript:void(0);" className="menu-link menu-toggle">
                    <div data-i18n="Account Settings">Account Settings</div>
                    <i className="ti menu-toggle-icon d-none d-xl-block ti-sm align-middle"></i>
                  </a>
                  <ul className="menu-sub">
                    <li className="menu-item">
                      <Link href="/pages/account-settings/account" className="menu-link">
                        <div data-i18n="Account">Account</div>
                      </Link>
                    </li>
                    <li className="menu-item">
                      <Link href="/pages/account-settings/security" className="menu-link">
                        <div data-i18n="Security">Security</div>
                      </Link>
                    </li>
                    <li className="menu-item">
                      <Link href="/pages/account-settings/billing" className="menu-link">
                        <div data-i18n="Billing & Plans">Billing & Plans</div>
                      </Link>
                    </li>
                    <li className="menu-item">
                      <Link href="/pages/account-settings/notifications" className="menu-link">
                        <div data-i18n="Notifications">Notifications</div>
                      </Link>
                    </li>
                    <li className="menu-item">
                      <Link href="/pages/account-settings/connections" className="menu-link">
                        <div data-i18n="Connections">Connections</div>
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="menu-item">
                  <Link href="/pages/faq" className="menu-link">
                    <div data-i18n="FAQ">FAQ</div>
                  </Link>
                </li>
                <li className="menu-item">
                  <a href="javascript:void(0);" className="menu-link menu-toggle">
                    <div data-i18n="Help Center">Help Center</div>
                    <i className="ti menu-toggle-icon d-none d-xl-block ti-sm align-middle"></i>
                  </a>
                  <ul className="menu-sub">
                    <li className="menu-item">
                      <Link href="/pages/help-center/landing" className="menu-link">
                        <div data-i18n="Landing">Landing</div>
                      </Link>
                    </li>
                    <li className="menu-item">
                      <Link href="/pages/help-center/categories" className="menu-link">
                        <div data-i18n="Categories">Categories</div>
                      </Link>
                    </li>
                    <li className="menu-item">
                      <Link href="/pages/help-center/article" className="menu-link">
                        <div data-i18n="Article">Article</div>
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>

            {/* Misc */}
            <li className="menu-header small text-uppercase">
              <span className="menu-header-text">Misc</span>
            </li>

            <li className="menu-item">
              <a href="javascript:void(0);" className="menu-link menu-toggle">
                <i className="menu-icon tf-icons ti ti-3d-cube-sphere"></i>
                <div data-i18n="Misc">Misc</div>
                <i className="ti menu-toggle-icon d-none d-xl-block ti-sm align-middle"></i>
              </a>
              <ul className="menu-sub">
                <li className="menu-item">
                  <Link href="/misc/affiliate" className="menu-link">
                    <div data-i18n="Affiliate">Affiliate</div>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link href="/misc/pricing" className="menu-link">
                    <div data-i18n="Pricing">Pricing</div>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link href="/misc/error" className="menu-link">
                    <div data-i18n="Error">Error</div>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link href="/misc/under-maintenance" className="menu-link">
                    <div data-i18n="Under Maintenance">Under Maintenance</div>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link href="/misc/coming-soon" className="menu-link">
                    <div data-i18n="Coming Soon">Coming Soon</div>
                  </Link>
                </li>
              </ul>
            </li>

            {/* Authentications */}
            <li className="menu-item">
              <a href="javascript:void(0);" className="menu-link menu-toggle">
                <i className="menu-icon tf-icons ti ti-shield-lock"></i>
                <div data-i18n="Authentications">Authentications</div>
                <i className="ti menu-toggle-icon d-none d-xl-block ti-sm align-middle"></i>
              </a>
              <ul className="menu-sub">
                <li className="menu-item">
                  <a href="javascript:void(0);" className="menu-link menu-toggle">
                    <div data-i18n="Login">Login</div>
                    <i className="ti menu-toggle-icon d-none d-xl-block ti-sm align-middle"></i>
                  </a>
                  <ul className="menu-sub">
                    <li className="menu-item">
                      <Link href="/auth/login-basic" className="menu-link">
                        <div data-i18n="Basic">Basic</div>
                      </Link>
                    </li>
                    <li className="menu-item">
                      <Link href="/auth/login-cover" className="menu-link">
                        <div data-i18n="Cover">Cover</div>
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="menu-item">
                  <a href="javascript:void(0);" className="menu-link menu-toggle">
                    <div data-i18n="Register">Register</div>
                    <i className="ti menu-toggle-icon d-none d-xl-block ti-sm align-middle"></i>
                  </a>
                  <ul className="menu-sub">
                    <li className="menu-item">
                      <Link href="/auth/register-basic" className="menu-link">
                        <div data-i18n="Basic">Basic</div>
                      </Link>
                    </li>
                    <li className="menu-item">
                      <Link href="/auth/register-cover" className="menu-link">
                        <div data-i18n="Cover">Cover</div>
                      </Link>
                    </li>
                    <li className="menu-item">
                      <Link href="/auth/register-multisteps" className="menu-link">
                        <div data-i18n="Multi-steps">Multi-steps</div>
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="menu-item">
                  <a href="javascript:void(0);" className="menu-link menu-toggle">
                    <div data-i18n="Verify Email">Verify Email</div>
                    <i className="ti menu-toggle-icon d-none d-xl-block ti-sm align-middle"></i>
                  </a>
                  <ul className="menu-sub">
                    <li className="menu-item">
                      <Link href="/auth/verify-email-basic" className="menu-link">
                        <div data-i18n="Basic">Basic</div>
                      </Link>
                    </li>
                    <li className="menu-item">
                      <Link href="/auth/verify-email-cover" className="menu-link">
                        <div data-i18n="Cover">Cover</div>
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="menu-item">
                  <Link href="/auth/forgot-password-basic" className="menu-link">
                    <div data-i18n="Forgot Password">Forgot Password</div>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link href="/auth/reset-password-basic" className="menu-link">
                    <div data-i18n="Reset Password">Reset Password</div>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link href="/auth/two-steps-basic" className="menu-link">
                    <div data-i18n="Two Steps">Two Steps</div>
                  </Link>
                </li>
              </ul>
            </li>

            {/* Wizard Examples */}
            <li className="menu-item">
              <a href="javascript:void(0);" className="menu-link menu-toggle">
                <i className="menu-icon tf-icons ti ti-forms"></i>
                <div data-i18n="Wizard Examples">Wizard Examples</div>
                <i className="ti menu-toggle-icon d-none d-xl-block ti-sm align-middle"></i>
              </a>
              <ul className="menu-sub">
                <li className="menu-item">
                  <Link href="/wizard/checkout" className="menu-link">
                    <div data-i18n="Checkout">Checkout</div>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link href="/wizard/property-listing" className="menu-link">
                    <div data-i18n="Property Listing">Property Listing</div>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link href="/wizard/create-deal" className="menu-link">
                    <div data-i18n="Create Deal">Create Deal</div>
                  </Link>
                </li>
              </ul>
            </li>

            {/* Modal Examples */}
            <li className="menu-item">
              <Link href="/modal-examples" className="menu-link">
                <i className="menu-icon tf-icons ti ti-square"></i>
                <div data-i18n="Modal Examples">Modal Examples</div>
              </Link>
            </li>

            {/* Components */}
            <li className="menu-header small text-uppercase">
              <span className="menu-header-text">Components</span>
            </li>

            {/* Cards */}
            <li className="menu-item">
              <a href="javascript:void(0);" className="menu-link menu-toggle">
                <i className="menu-icon tf-icons ti ti-id"></i>
                <div data-i18n="Cards">Cards</div>
                <div className="badge bg-label-primary rounded-pill ms-auto">6</div>
                <i className="ti menu-toggle-icon d-none d-xl-block ti-sm align-middle"></i>
              </a>
              <ul className="menu-sub">
                <li className="menu-item">
                  <Link href="/ui/cards/basic" className="menu-link">
                    <div data-i18n="Basic">Basic</div>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link href="/ui/cards/advance" className="menu-link">
                    <div data-i18n="Advance">Advance</div>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link href="/ui/cards/statistics" className="menu-link">
                    <div data-i18n="Statistics">Statistics</div>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link href="/ui/cards/analytics" className="menu-link">
                    <div data-i18n="Analytics">Analytics</div>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link href="/ui/cards/actions" className="menu-link">
                    <div data-i18n="Card Actions">Card Actions</div>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link href="/ui/cards/widgets" className="menu-link">
                    <div data-i18n="Widgets">Widgets</div>
                  </Link>
                </li>
              </ul>
            </li>

            {/* User interface */}
            <li className="menu-item">
              <a href="javascript:void(0);" className="menu-link menu-toggle">
                <i className="menu-icon tf-icons ti ti-color-swatch"></i>
                <div data-i18n="User interface">User interface</div>
                <i className="ti menu-toggle-icon d-none d-xl-block ti-sm align-middle"></i>
              </a>
              <ul className="menu-sub">
                <li className="menu-item">
                  <a href="javascript:void(0);" className="menu-link menu-toggle">
                    <div data-i18n="Extended UI">Extended UI</div>
                    <i className="ti menu-toggle-icon d-none d-xl-block ti-sm align-middle"></i>
                  </a>
                  <ul className="menu-sub">
                    <li className="menu-item">
                      <Link href="/ui/extended/ui-avatars" className="menu-link">
                        <div data-i18n="Perfect Scrollbar">Perfect Scrollbar</div>
                      </Link>
                    </li>
                    <li className="menu-item">
                      <Link href="/ui/extended/ui-text-divider" className="menu-link">
                        <div data-i18n="Text Divider">Text Divider</div>
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="menu-item">
                  <a href="javascript:void(0);" className="menu-link menu-toggle">
                    <div data-i18n="Timeline">Timeline</div>
                    <i className="ti menu-toggle-icon d-none d-xl-block ti-sm align-middle"></i>
                  </a>
                  <ul className="menu-sub">
                    <li className="menu-item">
                      <Link href="/ui/timeline/basic" className="menu-link">
                        <div data-i18n="Basic">Basic</div>
                      </Link>
                    </li>
                    <li className="menu-item">
                      <Link href="/ui/timeline/advance" className="menu-link">
                        <div data-i18n="Advance">Advance</div>
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="menu-item">
                  <a href="javascript:void(0);" className="menu-link menu-toggle">
                    <div data-i18n="Icons">Icons</div>
                    <i className="ti menu-toggle-icon d-none d-xl-block ti-sm align-middle"></i>
                  </a>
                  <ul className="menu-sub">
                    <li className="menu-item">
                      <Link href="/ui/icons/tabler" className="menu-link">
                        <div data-i18n="Tabler Icons">Tabler Icons</div>
                      </Link>
                    </li>
                    <li className="menu-item">
                      <Link href="/ui/icons/font-awesome" className="menu-link">
                        <div data-i18n="Font Awesome">Font Awesome</div>
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>

            {/* Forms */}
            <li className="menu-item">
              <a href="javascript:void(0);" className="menu-link menu-toggle">
                <i className="menu-icon tf-icons ti ti-input-check"></i>
                <div data-i18n="Forms & Tables">Forms & Tables</div>
                <i className="ti menu-toggle-icon d-none d-xl-block ti-sm align-middle"></i>
              </a>
              <ul className="menu-sub">
                <li className="menu-item">
                  <a href="javascript:void(0);" className="menu-link menu-toggle">
                    <div data-i18n="Form Layouts">Form Layouts</div>
                    <i className="ti menu-toggle-icon d-none d-xl-block ti-sm align-middle"></i>
                  </a>
                  <ul className="menu-sub">
                    <li className="menu-item">
                      <Link href="/forms/layouts/vertical" className="menu-link">
                        <div data-i18n="Vertical Form">Vertical Form</div>
                      </Link>
                    </li>
                    <li className="menu-item">
                      <Link href="/forms/layouts/horizontal" className="menu-link">
                        <div data-i18n="Horizontal Form">Horizontal Form</div>
                      </Link>
                    </li>
                    <li className="menu-item">
                      <Link href="/forms/layouts/sticky" className="menu-link">
                        <div data-i18n="Sticky Actions">Sticky Actions</div>
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="menu-item">
                  <a href="javascript:void(0);" className="menu-link menu-toggle">
                    <div data-i18n="Form Wizard">Form Wizard</div>
                    <i className="ti menu-toggle-icon d-none d-xl-block ti-sm align-middle"></i>
                  </a>
                  <ul className="menu-sub">
                    <li className="menu-item">
                      <Link href="/forms/wizard/vertical" className="menu-link">
                        <div data-i18n="Vertical">Vertical</div>
                      </Link>
                    </li>
                    <li className="menu-item">
                      <Link href="/forms/wizard/horizontal" className="menu-link">
                        <div data-i18n="Horizontal">Horizontal</div>
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="menu-item">
                  <a href="javascript:void(0);" className="menu-link menu-toggle">
                    <div data-i18n="Datatables">Datatables</div>
                  </a>
                  <ul className="menu-sub">
                    <li className="menu-item">
                      <Link href="/tables/datatables/basic" className="menu-link">
                        <div data-i18n="Basic">Basic</div>
                      </Link>
                    </li>
                    <li className="menu-item">
                      <Link href="/tables/datatables/advance" className="menu-link">
                        <div data-i18n="Advance">Advance</div>
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>

            {/* Charts */}
            <li className="menu-item">
              <a href="javascript:void(0);" className="menu-link menu-toggle">
                <i className="menu-icon tf-icons ti ti-chart-dots"></i>
                <div data-i18n="Charts">Charts</div>
                <i className="ti menu-toggle-icon d-none d-xl-block ti-sm align-middle"></i>
              </a>
              <ul className="menu-sub">
                <li className="menu-item">
                  <Link href="/charts/apex" className="menu-link">
                    <div data-i18n="Apex Charts">Apex Charts</div>
                  </Link>
                </li>
                <li className="menu-item">
                  <Link href="/charts/chartjs" className="menu-link">
                    <div data-i18n="ChartJS">ChartJS</div>
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </aside>

        <div className="layout-page">
          {/* Navbar */}
          <nav className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme" id="layout-navbar">
            <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
              <a className="nav-item nav-link px-0 me-xl-4" href="javascript:void(0)">
                <i className="ti ti-menu-2 ti-sm"></i>
              </a>
            </div>

            <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
              {/* Search */}
              <div className="navbar-nav align-items-center">
                <div className="nav-item navbar-search-wrapper mb-0">
                  <a className="nav-item nav-link search-toggler d-flex align-items-center px-0" href="javascript:void(0);">
                    <i className="ti ti-search ti-md me-2"></i>
                    <span className="d-none d-md-inline-block text-muted">Search (Ctrl+/)</span>
                  </a>
                </div>
              </div>

              <ul className="navbar-nav flex-row align-items-center ms-auto">
                {/* Language */}
                <li className="nav-item dropdown-language dropdown me-2 me-xl-0">
                  <a className="nav-link dropdown-toggle hide-arrow" href="javascript:void(0);" data-bs-toggle="dropdown">
                    <i className="fi fi-us fis rounded-circle me-1 fs-3"></i>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <a className="dropdown-item" href="javascript:void(0);" data-language="en">
                        <i className="fi fi-us fis rounded-circle me-1 fs-3"></i>
                        <span className="align-middle">English</span>
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="javascript:void(0);" data-language="fr">
                        <i className="fi fi-fr fis rounded-circle me-1 fs-3"></i>
                        <span className="align-middle">French</span>
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="javascript:void(0);" data-language="de">
                        <i className="fi fi-de fis rounded-circle me-1 fs-3"></i>
                        <span className="align-middle">German</span>
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="javascript:void(0);" data-language="pt">
                        <i className="fi fi-pt fis rounded-circle me-1 fs-3"></i>
                        <span className="align-middle">Portuguese</span>
                      </a>
                    </li>
                  </ul>
                </li>

                {/* Style Switcher */}
                <li className="nav-item me-2 me-xl-0">
                  <a className="nav-link style-switcher-toggle hide-arrow" href="javascript:void(0);">
                    <i className="ti ti-md"></i>
                  </a>
                </li>

                {/* Quick links */}
                <li className="nav-item dropdown-shortcuts navbar-dropdown dropdown me-2 me-xl-0">
                  <a className="nav-link dropdown-toggle hide-arrow" href="javascript:void(0);" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                    <i className="ti ti-layout-grid-add ti-md"></i>
                  </a>
                  <div className="dropdown-menu dropdown-menu-end py-0">
                    <div className="dropdown-menu-header border-bottom">
                      <div className="dropdown-header d-flex align-items-center py-3">
                        <h5 className="text-body mb-0 me-auto">Shortcuts</h5>
                        <a href="javascript:void(0)" className="dropdown-shortcuts-add text-body" data-bs-toggle="tooltip" data-bs-placement="top" title="Add shortcuts">
                          <i className="ti ti-sm ti-apps"></i>
                        </a>
                      </div>
                    </div>
                    <div className="dropdown-shortcuts-list scrollable-container">
                      <div className="row row-bordered overflow-visible g-0">
                        <div className="dropdown-shortcuts-item col">
                          <span className="dropdown-shortcuts-icon rounded-circle mb-2">
                            <i className="ti ti-calendar fs-4"></i>
                          </span>
                          <a href="/app/calendar" className="stretched-link">Calendar</a>
                          <small className="text-muted mb-0">Appointments</small>
                        </div>
                        <div className="dropdown-shortcuts-item col">
                          <span className="dropdown-shortcuts-icon rounded-circle mb-2">
                            <i className="ti ti-file-invoice fs-4"></i>
                          </span>
                          <a href="/app/invoice/list" className="stretched-link">Invoice App</a>
                          <small className="text-muted mb-0">Manage Accounts</small>
                        </div>
                      </div>
                      <div className="row row-bordered overflow-visible g-0">
                        <div className="dropdown-shortcuts-item col">
                          <span className="dropdown-shortcuts-icon rounded-circle mb-2">
                            <i className="ti ti-users fs-4"></i>
                          </span>
                          <a href="/app/user/list" className="stretched-link">User App</a>
                          <small className="text-muted mb-0">Manage Users</small>
                        </div>
                        <div className="dropdown-shortcuts-item col">
                          <span className="dropdown-shortcuts-icon rounded-circle mb-2">
                            <i className="ti ti-lock fs-4"></i>
                          </span>
                          <a href="/app/access/roles" className="stretched-link">Role Management</a>
                          <small className="text-muted mb-0">Permission</small>
                        </div>
                      </div>
                      <div className="row row-bordered overflow-visible g-0">
                        <div className="dropdown-shortcuts-item col">
                          <span className="dropdown-shortcuts-icon rounded-circle mb-2">
                            <i className="ti ti-chart-bar fs-4"></i>
                          </span>
                          <a href="/" className="stretched-link">Dashboard</a>
                          <small className="text-muted mb-0">User Profile</small>
                        </div>
                        <div className="dropdown-shortcuts-item col">
                          <span className="dropdown-shortcuts-icon rounded-circle mb-2">
                            <i className="ti ti-settings fs-4"></i>
                          </span>
                          <a href="/pages/account-settings/account" className="stretched-link">Setting</a>
                          <small className="text-muted mb-0">Account Settings</small>
                        </div>
                      </div>
                      <div className="row row-bordered overflow-visible g-0">
                        <div className="dropdown-shortcuts-item col">
                          <span className="dropdown-shortcuts-icon rounded-circle mb-2">
                            <i className="ti ti-help fs-4"></i>
                          </span>
                          <a href="/pages/help-center/landing" className="stretched-link">Help Center</a>
                          <small className="text-muted mb-0">FAQs & Articles</small>
                        </div>
                        <div className="dropdown-shortcuts-item col">
                          <span className="dropdown-shortcuts-icon rounded-circle mb-2">
                            <i className="ti ti-square fs-4"></i>
                          </span>
                          <a href="/modal-examples" className="stretched-link">Modals</a>
                          <small className="text-muted mb-0">Useful Popups</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>

                {/* Notification */}
                <li className="nav-item dropdown-notifications navbar-dropdown dropdown me-3 me-xl-1">
                  <a className="nav-link dropdown-toggle hide-arrow" href="javascript:void(0);" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                    <i className="ti ti-bell ti-md"></i>
                    <span className="badge bg-danger rounded-pill badge-notifications">5</span>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end py-0">
                    <li className="dropdown-menu-header border-bottom">
                      <div className="dropdown-header d-flex align-items-center py-3">
                        <h5 className="text-body mb-0 me-auto">Notification</h5>
                        <a href="javascript:void(0)" className="dropdown-notifications-all text-body" data-bs-toggle="tooltip" data-bs-placement="top" title="Mark all as read">
                          <i className="ti ti-mail-opened fs-4"></i>
                        </a>
                      </div>
                    </li>
                    <li className="dropdown-notifications-list scrollable-container">
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item list-group-item-action dropdown-notifications-item">
                          <div className="d-flex">
                            <div className="flex-shrink-0 me-3">
                              <div className="avatar">
                                <img src="/theme/assets/img/avatars/1.png" alt="" className="h-auto rounded-circle" />
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-1">Congratulation Lettie 🎉</h6>
                              <p className="mb-0">Won the monthly best seller gold badge</p>
                              <small className="text-muted">1h ago</small>
                            </div>
                            <div className="flex-shrink-0 dropdown-notifications-actions">
                              <a href="javascript:void(0)" className="dropdown-notifications-read">
                                <span className="badge badge-dot"></span>
                              </a>
                              <a href="javascript:void(0)" className="dropdown-notifications-archive">
                                <span className="ti ti-x"></span>
                              </a>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </li>
                    <li className="dropdown-menu-footer border-top">
                      <a href="javascript:void(0);" className="dropdown-item d-flex justify-content-center text-primary p-2 h-px-40 mb-1 align-items-center">
                        View all notifications
                      </a>
                    </li>
                  </ul>
                </li>

                {/* User */}
                <li className="nav-item navbar-dropdown dropdown-user dropdown">
                  <a className="nav-link dropdown-toggle hide-arrow" href="javascript:void(0);" data-bs-toggle="dropdown">
                    <div className="avatar avatar-online">
                      <img src="/theme/assets/img/avatars/1.png" alt="" className="h-auto rounded-circle" />
                    </div>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <a className="dropdown-item" href="/pages/account-settings/account">
                        <div className="d-flex">
                          <div className="flex-shrink-0 me-3">
                            <div className="avatar avatar-online">
                              <img src="/theme/assets/img/avatars/1.png" alt="" className="h-auto rounded-circle" />
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <span className="fw-semibold d-block">John Doe</span>
                            <small className="text-muted">Admin</small>
                          </div>
                        </div>
                      </a>
                    </li>
                    <li>
                      <div className="dropdown-divider"></div>
                    </li>
                    <li>
                      <a className="dropdown-item" href="/pages/profile/user">
                        <i className="ti ti-user-check me-2 ti-sm"></i>
                        <span className="align-middle">My Profile</span>
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="/pages/account-settings/account">
                        <i className="ti ti-settings me-2 ti-sm"></i>
                        <span className="align-middle">Settings</span>
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="/pages/account-settings/billing">
                        <span className="d-flex align-items-center align-middle">
                          <i className="flex-shrink-0 ti ti-credit-card me-2 ti-sm"></i>
                          <span className="flex-grow-1 align-middle">Billing</span>
                          <span className="flex-shrink-0 badge badge-center rounded-pill bg-label-danger w-px-20 h-px-20">2</span>
                        </span>
                      </a>
                    </li>
                    <li>
                      <div className="dropdown-divider"></div>
                    </li>
                    <li>
                      <a className="dropdown-item" href="/auth/login" target="_blank">
                        <i className="ti ti-logout me-2 ti-sm"></i>
                        <span className="align-middle">Log Out</span>
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>

            {/* Search Small Screens */}
            <div className="navbar-search-wrapper search-input-wrapper d-none">
              <input type="text" className="form-control search-input container-xxl border-0" placeholder="Search..." aria-label="Search..." />
              <i className="ti ti-x ti-sm search-toggler cursor-pointer"></i>
            </div>
          </nav>

          {/* Content wrapper */}
          <div className="content-wrapper">
            {/* Content */}
            <div className="container-xxl flex-grow-1 container-p-y">
              <div className="row g-4">
                {/* Website Analytics */}
                <div className="col-lg-6 mb-4">
                  <div className="swiper-container swiper-container-horizontal swiper swiper-card-advance-bg" id="swiper-with-pagination-cards">
                    <div className="swiper-wrapper">
                      <div className="swiper-slide">
                        <div className="row">
                          <div className="col-12">
                            <h5 className="text-white mb-0 mt-2">Website Analytics</h5>
                            <small>Total 28.5% Conversion Rate</small>
                          </div>
                          <div className="row">
                            <div className="col-lg-7 col-md-9 col-12 order-2 order-md-1">
                              <h6 className="text-white mt-0 mt-md-3 mb-3">Traffic</h6>
                              <div className="row">
                                <div className="col-6">
                                  <ul className="list-unstyled mb-0">
                                    <li className="d-flex mb-4 align-items-center">
                                      <p className="mb-0 fw-semibold me-2 website-analytics-text-bg">28%</p>
                                      <p className="mb-0">Sessions</p>
                                    </li>
                                    <li className="d-flex align-items-center mb-2">
                                      <p className="mb-0 fw-semibold me-2 website-analytics-text-bg">1.2k</p>
                                      <p className="mb-0">Leads</p>
                                    </li>
                                  </ul>
                                </div>
                                <div className="col-6">
                                  <ul className="list-unstyled mb-0">
                                    <li className="d-flex mb-4 align-items-center">
                                      <p className="mb-0 fw-semibold me-2 website-analytics-text-bg">3.1k</p>
                                      <p className="mb-0">Page Views</p>
                                    </li>
                                    <li className="d-flex align-items-center mb-2">
                                      <p className="mb-0 fw-semibold me-2 website-analytics-text-bg">12%</p>
                                      <p className="mb-0">Conversions</p>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-5 col-md-3 col-12 order-1 order-md-2 my-4 my-md-0 text-center">
                              <img src="/theme/assets/img/illustrations/card-website-analytics-1.png" alt="Website Analytics" width="170" className="card-website-analytics-img" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="swiper-pagination"></div>
                  </div>
                </div>

                {/* Sales Overview */}
                <div className="col-lg-3 col-sm-6 mb-4">
                  <div className="card">
                    <div className="card-header">
                      <div className="d-flex justify-content-between">
                        <small className="d-block mb-1 text-muted">Sales Overview</small>
                        <p className="card-text text-success">+18.2%</p>
                      </div>
                      <h4 className="card-title mb-1">$42.5k</h4>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-4">
                          <div className="d-flex gap-2 align-items-center mb-2">
                            <span className="badge bg-label-info p-1 rounded">
                              <i className="ti ti-shopping-cart ti-xs"></i>
                            </span>
                            <p className="mb-0">Order</p>
                          </div>
                          <h5 className="mb-0 pt-1 text-nowrap">62.2%</h5>
                          <small className="text-muted">6,440</small>
                        </div>
                        <div className="col-4">
                          <div className="divider divider-vertical">
                            <div className="divider-text">
                              <span className="badge-divider-bg bg-label-secondary">VS</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-4 text-end">
                          <div className="d-flex gap-2 justify-content-end align-items-center mb-2">
                            <p className="mb-0">Visits</p>
                            <span className="badge bg-label-primary p-1 rounded">
                              <i className="ti ti-link ti-xs"></i>
                            </span>
                          </div>
                          <h5 className="mb-0 pt-1 text-nowrap ms-lg-n3 ms-xl-0">25.5%</h5>
                          <small className="text-muted">12,749</small>
                        </div>
                      </div>
                      <div className="d-flex align-items-center mt-4">
                        <div className="progress w-100" style={{height: '8px'}}>
                          <div className="progress-bar bg-info" style={{width: '70%'}} role="progressbar" aria-valuenow={70} aria-valuemin={0} aria-valuemax={100}></div>
                          <div className="progress-bar bg-primary" role="progressbar" style={{width: '30%'}} aria-valuenow={30} aria-valuemin={0} aria-valuemax={100}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Revenue Generated */}
                <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
                  <div className="card">
                    <div className="card-body pb-0">
                      <div className="card-icon">
                        <span className="badge bg-label-success rounded-pill p-2">
                          <i className="ti ti-credit-card ti-sm"></i>
                        </span>
                      </div>
                      <h5 className="card-title mb-0 mt-2">97.5k</h5>
                      <small>Revenue Generated</small>
                    </div>
                    <div id="revenueGenerated"></div>
                  </div>
                </div>

                {/* Earning Reports */}
                <div className="col-lg-6 mb-4">
                  <div className="card h-100">
                    <div className="card-header pb-0 d-flex justify-content-between mb-lg-n4">
                      <div className="card-title mb-0">
                        <h5 className="mb-0">Earning Reports</h5>
                        <small className="text-muted">Weekly Earnings Overview</small>
                      </div>
                      <div className="dropdown">
                        <button className="btn p-0" type="button" id="earningReportsId" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <i className="ti ti-dots-vertical ti-sm text-muted"></i>
                        </button>
                        <div className="dropdown-menu dropdown-menu-end" aria-labelledby="earningReportsId">
                          <a className="dropdown-item" href="javascript:void(0);">View More</a>
                          <a className="dropdown-item" href="javascript:void(0);">Delete</a>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12 col-md-4 d-flex flex-column align-self-end">
                          <div className="d-flex gap-2 align-items-center mb-2 pb-1 flex-wrap">
                            <h1 className="mb-0">$468</h1>
                            <div className="badge rounded bg-label-success">+4.2%</div>
                          </div>
                          <small className="text-muted">You informed of this week compared to last week</small>
                        </div>
                        <div className="col-12 col-md-8">
                          <div id="weeklyEarningReports"></div>
                        </div>
                      </div>
                      <div className="border rounded p-3 mt-2">
                        <div className="row gap-4 gap-sm-0">
                          <div className="col-12 col-sm-4">
                            <div className="d-flex gap-2 align-items-center">
                              <div className="badge rounded bg-label-primary p-1">
                                <i className="ti ti-currency-dollar ti-sm"></i>
                              </div>
                              <h6 className="mb-0">Earnings</h6>
                            </div>
                            <h4 className="my-2 pt-1">$545.69</h4>
                            <div className="progress w-75" style={{height: '4px'}}>
                              <div className="progress-bar" role="progressbar" style={{width: '65%'}} aria-valuenow={65} aria-valuemin={0} aria-valuemax={100}></div>
                            </div>
                          </div>
                          <div className="col-12 col-sm-4">
                            <div className="d-flex gap-2 align-items-center">
                              <div className="badge rounded bg-label-info p-1">
                                <i className="ti ti-chart-pie-2 ti-sm"></i>
                              </div>
                              <h6 className="mb-0">Profit</h6>
                            </div>
                            <h4 className="my-2 pt-1">$256.34</h4>
                            <div className="progress w-75" style={{height: '4px'}}>
                              <div className="progress-bar bg-info" role="progressbar" style={{width: '50%'}} aria-valuenow={50} aria-valuemin={0} aria-valuemax={100}></div>
                            </div>
                          </div>
                          <div className="col-12 col-sm-4">
                            <div className="d-flex gap-2 align-items-center">
                              <div className="badge rounded bg-label-danger p-1">
                                <i className="ti ti-brand-paypal ti-sm"></i>
                              </div>
                              <h6 className="mb-0">Expense</h6>
                            </div>
                            <h4 className="my-2 pt-1">$74.19</h4>
                            <div className="progress w-75" style={{height: '4px'}}>
                              <div className="progress-bar bg-danger" role="progressbar" style={{width: '65%'}} aria-valuenow={65} aria-valuemin={0} aria-valuemax={100}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Support Tracker */}
                <div className="col-md-6 mb-4">
                  <div className="card">
                    <div className="card-header d-flex justify-content-between pb-0">
                      <div className="card-title mb-0">
                        <h5 className="mb-0">Support Tracker</h5>
                        <small className="text-muted">Last 7 Days</small>
                      </div>
                      <div className="dropdown">
                        <button className="btn p-0" type="button" id="supportTrackerMenu" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <i className="ti ti-dots-vertical ti-sm text-muted"></i>
                        </button>
                        <div className="dropdown-menu dropdown-menu-end" aria-labelledby="supportTrackerMenu">
                          <a className="dropdown-item" href="javascript:void(0);">View More</a>
                          <a className="dropdown-item" href="javascript:void(0);">Delete</a>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12 col-sm-4 col-md-12 col-lg-4">
                          <div className="mt-lg-4 mt-lg-2 mb-lg-4 mb-2 pt-1">
                            <h1 className="mb-0">164</h1>
                            <p className="mb-0">Total Tickets</p>
                          </div>
                          <ul className="p-0 m-0">
                            <li className="d-flex gap-3 align-items-center mb-lg-3 pt-2 pb-1">
                              <div className="badge rounded bg-label-primary p-1">
                                <i className="ti ti-ticket ti-sm"></i>
                              </div>
                              <div>
                                <h6 className="mb-0 text-nowrap">New Tickets</h6>
                                <small className="text-muted">142</small>
                              </div>
                            </li>
                            <li className="d-flex gap-3 align-items-center mb-lg-3 pb-1">
                              <div className="badge rounded bg-label-info p-1">
                                <i className="ti ti-circle-check ti-sm"></i>
                              </div>
                              <div>
                                <h6 className="mb-0 text-nowrap">Open Tickets</h6>
                                <small className="text-muted">28</small>
                              </div>
                            </li>
                            <li className="d-flex gap-3 align-items-center pb-1">
                              <div className="badge rounded bg-label-warning p-1">
                                <i className="ti ti-clock ti-sm"></i>
                              </div>
                              <div>
                                <h6 className="mb-0 text-nowrap">Response Time</h6>
                                <small className="text-muted">1 Day</small>
                              </div>
                            </li>
                          </ul>
                        </div>
                        <div className="col-12 col-sm-8 col-md-12 col-lg-8">
                          <div id="supportTracker"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sales By Country */}
                <div className="col-xl-4 col-md-6 mb-4">
                  <div className="card h-100">
                    <div className="card-header d-flex justify-content-between">
                      <div className="card-title mb-0">
                        <h5 className="m-0 me-2">Sales by Countries</h5>
                        <small className="text-muted">Monthly Sales Overview</small>
                      </div>
                      <div className="dropdown">
                        <button className="btn p-0" type="button" id="salesByCountry" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <i className="ti ti-dots-vertical ti-sm text-muted"></i>
                        </button>
                        <div className="dropdown-menu dropdown-menu-end" aria-labelledby="salesByCountry">
                          <a className="dropdown-item" href="javascript:void(0);">Download</a>
                          <a className="dropdown-item" href="javascript:void(0);">Refresh</a>
                          <a className="dropdown-item" href="javascript:void(0);">Share</a>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <ul className="p-0 m-0">
                        <li className="d-flex align-items-center mb-4">
                          <img src="/theme/assets/svg/flags/us.svg" alt="User" className="rounded-circle me-3" width="34" />
                          <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                            <div className="me-2">
                              <div className="d-flex align-items-center">
                                <h6 className="mb-0 me-1">$8,567k</h6>
                              </div>
                              <small className="text-muted">United states</small>
                            </div>
                            <div className="user-progress">
                              <p className="text-success fw-semibold mb-0">
                                <i className="ti ti-chevron-up"></i>
                                25.8%
                              </p>
                            </div>
                          </div>
                        </li>
                        <li className="d-flex align-items-center mb-4">
                          <img src="/theme/assets/svg/flags/br.svg" alt="User" className="rounded-circle me-3" width="34" />
                          <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                            <div className="me-2">
                              <div className="d-flex align-items-center">
                                <h6 className="mb-0 me-1">$2,415k</h6>
                              </div>
                              <small className="text-muted">Brazil</small>
                            </div>
                            <div className="user-progress">
                              <p className="text-danger fw-semibold mb-0">
                                <i className="ti ti-chevron-down"></i>
                                6.2%
                              </p>
                            </div>
                          </div>
                        </li>
                        <li className="d-flex align-items-center mb-4">
                          <img src="/theme/assets/svg/flags/in.svg" alt="User" className="rounded-circle me-3" width="34" />
                          <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                            <div className="me-2">
                              <div className="d-flex align-items-center">
                                <h6 className="mb-0 me-1">$865k</h6>
                              </div>
                              <small className="text-muted">India</small>
                            </div>
                            <div className="user-progress">
                              <p className="text-success fw-semibold">
                                <i className="ti ti-chevron-up"></i>
                                12.4%
                              </p>
                            </div>
                          </div>
                        </li>
                        <li className="d-flex align-items-center mb-4">
                          <img src="/theme/assets/svg/flags/au.svg" alt="User" className="rounded-circle me-3" width="34" />
                          <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                            <div className="me-2">
                              <div className="d-flex align-items-center">
                                <h6 className="mb-0 me-1">$745k</h6>
                              </div>
                              <small className="text-muted">Australia</small>
                            </div>
                            <div className="user-progress">
                              <p className="text-danger fw-semibold mb-0">
                                <i className="ti ti-chevron-down"></i>
                                11.9%
                              </p>
                            </div>
                          </div>
                        </li>
                        <li className="d-flex align-items-center mb-4">
                          <img src="/theme/assets/svg/flags/fr.svg" alt="User" className="rounded-circle me-3" width="34" />
                          <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                            <div className="me-2">
                              <div className="d-flex align-items-center">
                                <h6 className="mb-0 me-1">$45</h6>
                              </div>
                              <small className="text-muted">France</small>
                            </div>
                            <div className="user-progress">
                              <p className="text-success fw-semibold mb-0">
                                <i className="ti ti-chevron-up"></i>
                                16.2%
                              </p>
                            </div>
                          </div>
                        </li>
                        <li className="d-flex align-items-center">
                          <img src="/theme/assets/svg/flags/cn.svg" alt="User" className="rounded-circle me-3" width="34" />
                          <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                            <div className="me-2">
                              <div className="d-flex align-items-center">
                                <h6 className="mb-0 me-1">$12k</h6>
                              </div>
                              <small className="text-muted">China</small>
                            </div>
                            <div className="user-progress">
                              <p className="text-success fw-semibold mb-0">
                                <i className="ti ti-chevron-up"></i>
                                14.8%
                              </p>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Total Earning */}
                <div className="col-12 col-xl-4 mb-4 col-md-6">
                  <div className="card">
                    <div className="card-header d-flex justify-content-between pb-1">
                      <h5 className="mb-0 card-title">Total Earning</h5>
                      <div className="dropdown">
                        <button className="btn p-0" type="button" id="totalEarning" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <i className="ti ti-dots-vertical ti-sm text-muted"></i>
                        </button>
                        <div className="dropdown-menu dropdown-menu-end" aria-labelledby="totalEarning">
                          <a className="dropdown-item" href="javascript:void(0);">View More</a>
                          <a className="dropdown-item" href="javascript:void(0);">Delete</a>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <h1 className="mb-0 me-2">87%</h1>
                        <i className="ti ti-chevron-up text-success me-1"></i>
                        <p className="text-success mb-0">25.8%</p>
                      </div>
                      <div id="totalEarningChart"></div>
                      <div className="d-flex align-items-start my-4">
                        <div className="badge rounded bg-label-primary p-2 me-3 rounded">
                          <i className="ti ti-currency-dollar ti-sm"></i>
                        </div>
                        <div className="d-flex justify-content-between w-100 gap-2 align-items-center">
                          <div className="me-2">
                            <h6 className="mb-0">Total Sales</h6>
                            <small className="text-muted">Refund</small>
                          </div>
                          <p className="mb-0 text-success">+$98</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-start">
                        <div className="badge rounded bg-label-secondary p-2 me-3 rounded">
                          <i className="ti ti-brand-paypal ti-sm"></i>
                        </div>
                        <div className="d-flex justify-content-between w-100 gap-2 align-items-center">
                          <div className="me-2">
                            <h6 className="mb-0">Total Revenue</h6>
                            <small className="text-muted">Client Payment</small>
                          </div>
                          <p className="mb-0 text-success">+$126</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer className="content-footer footer bg-footer-theme">
              <div className="container-xxl">
                <div className="footer-container d-flex align-items-center justify-content-between py-2 flex-md-row flex-column">
                  <div>
                    © {new Date().getFullYear()}, made with ❤️ by <a href="https://pixinvent.com" target="_blank" className="fw-semibold">Pixinvent</a>
                  </div>
                  <div>
                    <a href="https://themeforest.net/licenses/standard" className="footer-link me-4" target="_blank">License</a>
                    <a href="https://1.envato.market/pixinvent_portfolio" target="_blank" className="footer-link me-4">More Themes</a>
                    <a href="https://demos.pixinvent.com/vuexy-html-admin-template/documentation/" target="_blank" className="footer-link me-4">Documentation</a>
                    <a href="https://pixinvent.ticksy.com/" target="_blank" className="footer-link d-none d-sm-inline-block">Support</a>
                  </div>
                </div>
              </div>
            </footer>

            <div className="content-backdrop fade"></div>
          </div>
        </div>

        {/* Overlay */}
        <div className="layout-overlay layout-menu-toggle"></div>

        {/* Drag Target Area To SlideIn Menu On Small Screens */}
        <div className="drag-target"></div>
      </div>
    </div>
  );
}
