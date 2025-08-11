import type { Metadata, Viewport } from "next";
import { Public_Sans } from "next/font/google";
import Script from "next/script";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

import "@/styles/template/core.css"
import "@/styles/template/theme-default.css"
import "@/styles/template/demo.css"
// import "./globals.css"

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-public-sans",
});

export const metadata: Metadata = {
  title: "Dashboard - Analytics | Vuexy - Bootstrap Admin Template",
  description: "",
  keywords: ["tenant", "management", "dashboard", "admin", "system"],
  authors: [{ name: "Tenant System Team" }],
  icons: {
    icon: "/theme/assets/img/favicon/logo-svg.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  userScalable: false,
  minimumScale: 1.0,
  maximumScale: 1.0,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      className="light-style layout-navbar-fixed layout-menu-fixed"
      dir="ltr"
      data-theme="theme-default"
      data-assets-path="/theme/assets/"
      data-template="vertical-menu-template"
    >
      <head>
        {/* Icon Stylesheets */}
        <link rel="stylesheet" href="/theme/assets/vendor/fonts/fontawesome.css" />
        <link rel="stylesheet" href="/theme/assets/vendor/fonts/tabler-icons.css" />
        <link rel="stylesheet" href="/theme/assets/vendor/fonts/flag-icons.css" />
      </head>
      <body className={`${publicSans.variable} antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
        
        {/* Helpers */}
        <Script src="/theme/assets/vendor/js/helpers.js" strategy="beforeInteractive" />
        
        {/* Template customizer & Theme config files MUST be included after core stylesheets and helpers.js */}
        <Script 
          src="/theme/assets/js/config.js" 
          strategy="afterInteractive"
        />
        
        {/* Core JS */}
        <Script src="/theme/assets/vendor/libs/jquery/jquery.js" strategy="afterInteractive" />
        <Script src="/theme/assets/vendor/libs/popper/popper.js" strategy="afterInteractive" />
        <Script src="/theme/assets/vendor/js/bootstrap.js" strategy="afterInteractive" />
        <Script src="/theme/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js" strategy="afterInteractive" />
        <Script src="/theme/assets/vendor/libs/node-waves/node-waves.js" strategy="afterInteractive" />
        <Script src="/theme/assets/vendor/js/menu.js" strategy="afterInteractive" />
        <Script src="/theme/assets/vendor/libs/hammer/hammer.js" strategy="afterInteractive" />
        <Script src="/theme/assets/vendor/libs/i18n/i18n.js" strategy="afterInteractive" />
        <Script src="/theme/assets/vendor/libs/typeahead-js/typeahead.js" strategy="afterInteractive" />
        
        {/* Vendors JS */}
        <Script src="/theme/assets/vendor/libs/apex-charts/apexcharts.js" strategy="lazyOnload" />
        <Script src="/theme/assets/vendor/libs/swiper/swiper.js" strategy="lazyOnload" />
        <Script src="/theme/assets/vendor/libs/datatables-bs5/datatables-bootstrap5.js" strategy="lazyOnload" />
        
        {/* Main JS */}
        <Script src="/theme/assets/js/main.js" strategy="lazyOnload" />
        
        {/* Page JS - Dashboard Analytics */}
        <Script src="/theme/assets/js/dashboards-analytics.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
