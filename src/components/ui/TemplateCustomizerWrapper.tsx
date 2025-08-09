'use client'

import { useEffect } from 'react'

// Type definition untuk TemplateCustomizer
interface TemplateCustomizerConstructor {
  new (config: Record<string, unknown>): unknown
}

interface TemplateCustomizerWindow extends Window {
  TemplateCustomizer?: TemplateCustomizerConstructor
  templateCustomizer?: unknown
}

export default function TemplateCustomizerWrapper() {
  useEffect(() => {
    // Tunggu sampai DOM fully loaded dan script template customizer sudah di load
    const initializeTemplateCustomizer = () => {
      const win = window as TemplateCustomizerWindow
      
      // Check if TemplateCustomizer is available
      if (typeof window !== 'undefined' && win.TemplateCustomizer) {
        try {
          // Pastikan DOM elements yang diperlukan sudah ada
          const coreCSS = document.querySelector('.template-customizer-core-css')
          const themeCSS = document.querySelector('.template-customizer-theme-css')
          
          if (!coreCSS || !themeCSS) {
            console.warn('Template customizer CSS elements not found, skipping initialization')
            return
          }
          
          // Get assets path from document
          const assetsPath = document.documentElement.getAttribute('data-assets-path') || '/theme/assets/'
          const rtlSupport = true
          
          // Initialize template customizer only if it hasn't been initialized
          if (!win.templateCustomizer) {
            win.templateCustomizer = new win.TemplateCustomizer({
              cssPath: assetsPath + 'vendor/css' + (rtlSupport ? '/rtl' : '') + '/',
              themesPath: assetsPath + 'vendor/css' + (rtlSupport ? '/rtl' : '') + '/',
              displayCustomizer: false, // Disable customizer UI untuk production
              defaultShowDropdownOnHover: true,
              defaultStyle: 'light',
              defaultLayoutType: 'fixed',
              defaultMenuCollapsed: false,
              defaultNavbarFixed: true,
              defaultFooterFixed: false,
              controls: [], // Disable all controls untuk menghindari error
              // Tambahkan error handler
              onSettingsChange: function() {
                // Empty handler untuk menghindari error
              }
            })
            console.log('Template customizer initialized successfully')
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          console.warn('Template customizer initialization skipped:', errorMessage)
        }
      } else {
        console.warn('TemplateCustomizer class not available')
      }
    }

    // Delay initialization dengan waktu yang lebih lama untuk memastikan semua script dan CSS sudah loaded
    const timer = setTimeout(() => {
      initializeTemplateCustomizer()
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return null // Komponen ini tidak render apa-apa
} 