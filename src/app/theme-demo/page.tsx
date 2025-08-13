'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import { useTheme } from '@/contexts/ThemeContext'
import Logo from '@/components/ui/Logo'
import ThemeToggle from '@/components/ui/ThemeToggle'
import BrandColors from '@/components/ui/BrandColors'
import { 
  Palette, 
  Sun, 
  Moon, 
  Settings, 
  Eye,
  Download,
  Code
} from 'lucide-react'

export default function ThemeDemoPage() {
  const { theme, isDarkMode } = useTheme()

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">
            Toggle Dark atau Light Mode
          </h1>
          <p className="text-lg max-w-2xl mx-auto">
            Explore the beautiful Tenant System admin template theme with modern design, 
            dark mode support, and comprehensive component library.
          </p>
        </div>

        {/* Theme Info */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              Theme Information
            </h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">{theme.name}</div>
                <div className="text-sm">Template Name</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">v{theme.version}</div>
                <div className="text-sm">Version</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">
                  {isDarkMode ? 'Dark' : 'Light'}
                </div>
                <div className="text-sm">Current Mode</div>
              </div>
              <div className="text-center">
                <ThemeToggle size="lg" />
                <div className="text-sm mt-2">Toggle Theme</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Items */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Action items</h2>
          </div>
          <div className="card-body">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="toggleIssue" checked readOnly />
              <label className="form-check-label" htmlFor="toggleIssue">
                ✅ Toggle theme sudah berfungsi dengan baik
              </label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="colorIssue" checked readOnly />
              <label className="form-check-label" htmlFor="colorIssue">
                ✅ Warna badge dan icon sudah diperbaiki
              </label>
            </div>
          </div>
        </div>

        {/* Logo Showcase */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Logo Showcase
            </h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Default Logo</h3>
                <Logo size="lg" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">SVG Logo</h3>
                <Logo size="lg" variant="svg" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Icon Only</h3>
                <Logo size="lg" showText={false} />
              </div>
            </div>
          </div>
        </div>

        {/* Brand Colors */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              Brand Colors
            </h2>
          </div>
          <div className="card-body">
            <BrandColors />
          </div>
        </div>

        {/* Color Palette */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              Color Palette
            </h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-lg mx-auto mb-2"></div>
                <p className="text-sm font-medium">Primary</p>
                <p className="text-xs">{theme.colors.primary}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary rounded-lg mx-auto mb-2"></div>
                <p className="text-sm font-medium">Secondary</p>
                <p className="text-xs">{theme.colors.secondary}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-success rounded-lg mx-auto mb-2"></div>
                <p className="text-sm font-medium">Success</p>
                <p className="text-xs">{theme.colors.success}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-warning rounded-lg mx-auto mb-2"></div>
                <p className="text-sm font-medium">Warning</p>
                <p className="text-xs">{theme.colors.warning}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-danger rounded-lg mx-auto mb-2"></div>
                <p className="text-sm font-medium">Danger</p>
                <p className="text-xs">{theme.colors.danger}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-info rounded-lg mx-auto mb-2"></div>
                <p className="text-sm font-medium">Info</p>
                <p className="text-xs">{theme.colors.info}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title flex items-center">
              <Code className="w-5 h-5 mr-2" />
              Typography
            </h2>
          </div>
          <div className="card-body">
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold">Heading 1 - Display Large</h1>
                <p className="text-sm mt-2">Font size: {theme.typography.fontSize['4xl']} | Weight: {theme.typography.fontWeight.bold}</p>
              </div>
              <div>
                <h2 className="text-3xl font-bold">Heading 2 - Display Medium</h2>
                <p className="text-sm mt-2">Font size: {theme.typography.fontSize['3xl']} | Weight: {theme.typography.fontWeight.bold}</p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold">Heading 3 - Display Small</h3>
                <p className="text-sm mt-2">Font size: {theme.typography.fontSize['2xl']} | Weight: {theme.typography.fontWeight.semibold}</p>
              </div>
              <div>
                <h4 className="text-xl font-semibold">Heading 4 - Headline</h4>
                <p className="text-sm mt-2">Font size: {theme.typography.fontSize.xl} | Weight: {theme.typography.fontWeight.semibold}</p>
              </div>
              <div>
                <h5 className="text-lg font-medium">Heading 5 - Title</h5>
                <p className="text-sm mt-2">Font size: {theme.typography.fontSize.lg} | Weight: {theme.typography.fontWeight.medium}</p>
              </div>
              <div>
                <h6 className="text-base font-medium">Heading 6 - Subtitle</h6>
                <p className="text-sm mt-2">Font size: {theme.typography.fontSize.base} | Weight: {theme.typography.fontWeight.medium}</p>
              </div>
              <div>
                <p className="text-base">Body text - This is the default body text size and weight used throughout the application.</p>
                <p className="text-sm mt-2">Font size: {theme.typography.fontSize.base} | Weight: {theme.typography.fontWeight.normal}</p>
              </div>
              <div>
                <p className="text-sm">Small text - Used for captions, metadata, and secondary information.</p>
                <p className="text-sm mt-2">Font size: {theme.typography.fontSize.sm} | Weight: {theme.typography.fontWeight.normal}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Buttons
            </h2>
          </div>
          <div className="card-body">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Button Variants</h3>
                <div className="flex flex-wrap gap-4">
                  <button className="btn btn-primary">Primary Button</button>
                  <button className="btn btn-outline">Outline Button</button>
                  <button className="btn bg-secondary text-white">Secondary Button</button>
                  <button className="btn bg-success text-white">Success Button</button>
                  <button className="btn bg-warning text-white">Warning Button</button>
                  <button className="btn bg-danger text-white">Danger Button</button>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Button Sizes</h3>
                <div className="flex flex-wrap items-center gap-4">
                  <button className="px-3 py-1 text-sm btn btn-primary">Small</button>
                  <button className="btn btn-primary">Medium</button>
                  <button className="px-6 py-3 text-lg btn btn-primary">Large</button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Icon Buttons</h3>
                <div className="flex flex-wrap gap-4">
                  <button className="btn-icon">
                    <Settings className="w-4 h-4" />
                  </button>
                  <button className="btn-icon">
                    <Sun className="w-4 h-4" />
                  </button>
                  <button className="btn-icon">
                    <Moon className="w-4 h-4" />
                  </button>
                  <button className="btn-icon">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Cards
            </h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Basic Card</h3>
                </div>
                <div className="card-body">
                  <p>This is a basic card with header and body content.</p>
                </div>
              </div>

              <div className="stats-card">
                <div className="stats-icon bg-primary text-white">
                  <Settings className="w-6 h-6" />
                </div>
                <div className="stats-value">1,234</div>
                <div className="stats-label">Total Items</div>
                <div className="stats-change positive">+12.5%</div>
              </div>

              <div className="analytics-card gradient">
                <div className="card-title">Analytics Card</div>
                <div className="card-value">$45,678</div>
                <div className="card-change">+15.3% from last month</div>
              </div>
            </div>
          </div>
        </div>

        {/* Theme Configuration */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Theme Configuration
            </h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Layout Variables</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Sidebar Width:</span>
                    <code className="px-2 py-1 rounded">{theme.layout.sidebarWidth}</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Sidebar Collapsed:</span>
                    <code className="px-2 py-1 rounded">{theme.layout.sidebarCollapsedWidth}</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Header Height:</span>
                    <code className="px-2 py-1 rounded">{theme.layout.headerHeight}</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Border Radius:</span>
                    <code className="px-2 py-1 rounded">{theme.layout.borderRadius}</code>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Spacing Scale</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Extra Small:</span>
                    <code className="px-2 py-1 rounded">{theme.spacing.xs}</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Small:</span>
                    <code className="px-2 py-1 rounded">{theme.spacing.sm}</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Medium:</span>
                    <code className="px-2 py-1 rounded">{theme.spacing.md}</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Large:</span>
                    <code className="px-2 py-1 rounded">{theme.spacing.lg}</code>
                  </div>
                  <div className="flex justify-between">
                    <span>Extra Large:</span>
                    <code className="px-2 py-1 rounded">{theme.spacing.xl}</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Documents</h2>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <button className="btn btn-outline w-full text-left">
                <i className="ti ti-brand-google-drive me-2"></i>
                Embed Google Drive
              </button>
              <button className="btn btn-outline w-full text-left">
                <i className="ti ti-file-text me-2"></i>
                Embed a PDF
              </button>
              <button className="btn btn-outline w-full text-left">
                <i className="ti ti-brand-figma me-2"></i>
                Embed Figma
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 