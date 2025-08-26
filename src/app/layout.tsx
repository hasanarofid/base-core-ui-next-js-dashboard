import type { Metadata, Viewport } from "next";
import { Public_Sans } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SocketProvider } from "@/contexts/SocketContext";
import ForcePasswordChangeGuard from "@/components/auth/ForcePasswordChangeGuard";
import { NotificationWrapper } from "@/components/layout/NotificationWrapper";

import "@/styles/template/core.css"
import "@/styles/template/theme-default.css"
import "@/styles/template/demo.css"
import "@/styles/template/theme-toggle.css"
import "@/styles/sweetalert-custom.css"
import "@/styles/force-password-change.css"
import "@/styles/timeline.css"
import VendorScripts from "@/components/VendorScripts";
import PageScripts from "@/components/PageScripts";


const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-public-sans",
  display: "swap",
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
}: Readonly<{ children: React.ReactNode }>) {
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
        <link
          rel="stylesheet"
          href="/theme/assets/vendor/fonts/fontawesome.css"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="/theme/assets/vendor/fonts/tabler-icons.css"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="/theme/assets/vendor/fonts/flag-icons.css"
          crossOrigin="anonymous"
        />
      </head>

      <body
        className={`${publicSans.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <AuthProvider>
            <SocketProvider>
              <ToastProvider>
                <ForcePasswordChangeGuard>
                  <NotificationWrapper>
                    {children}
                  </NotificationWrapper>
                </ForcePasswordChangeGuard>
              </ToastProvider>
            </SocketProvider>
          </AuthProvider>
        </ThemeProvider>

        {/* Semua script yang memodifikasi DOM dipindah ke komponen client-only */}
        <VendorScripts />
        <PageScripts />
      </body>
    </html>
  );
}
