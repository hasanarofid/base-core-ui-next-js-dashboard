'use client'

import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />
      }

      return (
        <div className="d-flex justify-content-center align-items-center min-h-screen">
          <div className="text-center p-6">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Terjadi Kesalahan
            </h2>
            <p className="text-gray-600 mb-4">
              Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi.
            </p>
            {this.state.error && (
              <details className="text-left bg-gray-100 p-4 rounded-lg mb-4">
                <summary className="cursor-pointer font-medium text-gray-700">
                  Detail Error
                </summary>
                <pre className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <button
              onClick={this.resetError}
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Coba Lagi
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
} 