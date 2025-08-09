import { useEffect } from 'react';

interface UsePageTitleOptions {
  title: string;
  subtitle?: string;
  description?: string;
  keywords?: string;
  appName?: string;
}

/**
 * Custom hook for dynamic page title and meta tags management
 * 
 * @example
 * ```tsx
 * // Basic usage
 * const { fullTitle, pageTitle, pageSubtitle } = usePageTitle({
 *   title: 'Dashboard',
 *   subtitle: 'Selamat datang di dashboard admin'
 * });
 * 
 * // Advanced usage with SEO meta
 * const { fullTitle, pageTitle, pageSubtitle } = usePageTitle({
 *   title: 'Manajemen Tenant',
 *   subtitle: `Kelola ${tenants.length} tenant dalam sistem`,
 *   description: 'Platform manajemen tenant dengan fitur lengkap untuk admin.',
 *   keywords: 'tenant management, admin panel, dashboard',
 *   appName: 'Custom App Name'
 * });
 * ```
 * 
 * @param options - Configuration object for page title and meta tags
 * @returns Object containing formatted title strings
 */
export const usePageTitle = ({
  title,
  subtitle,
  description,
  keywords,
  appName = 'Innovia - Tenant App'
}: UsePageTitleOptions) => {
  const fullTitle = `${title} | ${appName}`;
  
  useEffect(() => {
    // Update document title
    document.title = fullTitle;
    
    // Update meta description if provided
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      }
    }
    
    // Update meta keywords if provided
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords);
    }
    
    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = `Dashboard | ${appName}`;
    };
  }, [fullTitle, description, keywords, appName]);
  
  return {
    fullTitle,
    pageTitle: title,
    pageSubtitle: subtitle || '',
    appName
  };
};

export default usePageTitle; 