export interface ThemeConfig {
  name: string;
  version: string;
  logo: {
    light: string;
    dark: string;
    svg: string;
    alt: string;
  };
  colors: {
    primary: string;
    primaryDark: string;
    secondary: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
    light: string;
    dark: string;
    white: string;
    black: string;
    gray: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
    brand: {
      blue: string[];
      yellow: string;
      typeface: string;
    };
  };
  layout: {
    sidebarWidth: string;
    sidebarCollapsedWidth: string;
    headerHeight: string;
    borderRadius: string;
    boxShadow: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
    fontWeight: {
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
}

export const themeConfig: ThemeConfig = {
  name: 'Tenant System',
  version: '1.0.0',
  logo: {
    light: '/logo.jpeg',
    dark: '/logo.jpeg',
    svg: '/logo-svg.svg',
    alt: 'Tenant System Logo'
  },
  colors: {
    primary: '#7367F0',
    primaryDark: '#5E50EE',
    secondary: '#82868B',
    success: '#28C76F',
    warning: '#FF9F43',
    danger: '#EA5455',
    info: '#00CFE8',
    light: '#F8F8F8',
    dark: '#4B4B4B',
    white: '#FFFFFF',
    black: '#000000',
    gray: {
      50: '#F8F9FA',
      100: '#F1F3F4',
      200: '#E8EAED',
      300: '#DADCE0',
      400: '#BDC1C6',
      500: '#9AA0A6',
      600: '#80868B',
      700: '#5F6368',
      800: '#3C4043',
      900: '#202124'
    },
    brand: {
      blue: ['#6ECCDD', '#54C8DD', '#14B8DA', '#0198C5', '#0088BA'],
      yellow: '#F6B80C',
      typeface: '#0C455'
    }
  },
  layout: {
    sidebarWidth: '260px',
    sidebarCollapsedWidth: '70px',
    headerHeight: '64px',
    borderRadius: '0.375rem',
    boxShadow: '0 0.25rem 1.125rem rgba(75, 70, 92, 0.1)'
  },
  typography: {
    fontFamily: 'var(--font-public-sans), "Public Sans", "Inter", system-ui, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '0.9375rem',
      lg: '1rem',
      xl: '1.125rem',
      '2xl': '1.25rem',
      '3xl': '1.5rem',
      '4xl': '2rem'
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem'
  }
};

export const getThemeColor = (color: keyof ThemeConfig['colors']) => {
  return themeConfig.colors[color];
};

export const getBrandColor = (index: number = 0) => {
  return themeConfig.colors.brand.blue[index] || themeConfig.colors.brand.blue[0];
}; 