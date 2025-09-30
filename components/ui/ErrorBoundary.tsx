'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { LiquidGlassCard, LiquidGlassButton } from './LiquidGlass'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    // 忽略特定的 React DOM 错误
    if (error.message?.includes('insertBefore') || 
        error.message?.includes('removeChild') || 
        error.message?.includes('Node') ||
        error.message?.includes('要删除的节点不是该节点的子节点')) {
      console.warn('Ignoring React DOM manipulation error:', error.message)
      return { hasError: false, error: null }
    }
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 忽略特定的 React DOM 错误
    if (error.message?.includes('insertBefore') || 
        error.message?.includes('removeChild') || 
        error.message?.includes('Node') ||
        error.message?.includes('要删除的节点不是该节点的子节点')) {
      console.warn('Ignoring React DOM manipulation error in componentDidCatch')
      return
    }
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <LiquidGlassCard className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            组件错误
          </h3>
          <p className="text-gray-600 mb-4 text-sm">
            {this.state.error?.message || '组件渲染时出现错误'}
          </p>
          <LiquidGlassButton
            onClick={this.handleReset}
            variant="primary"
            size="sm"
          >
            重新加载
          </LiquidGlassButton>
        </LiquidGlassCard>
      )
    }

    return this.props.children
  }
}