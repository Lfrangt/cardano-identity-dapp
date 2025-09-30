'use client'

import React, { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  retryCount: number
}

export class SafeComponent extends Component<Props, State> {
  private maxRetries = 3

  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      retryCount: 0
    }
  }

  public static getDerivedStateFromError(): State {
    return { hasError: true, retryCount: 0 }
  }

  public componentDidCatch(error: Error) {
    // 如果是 React DOM 操作错误，自动重试
    if (error.message?.includes('insertBefore') || 
        error.message?.includes('removeChild') || 
        error.message?.includes('Node') ||
        error.message?.includes('要删除的节点不是该节点的子节点')) {
      console.warn('React DOM manipulation error detected, attempting auto-recovery')
      
      if (this.state.retryCount < this.maxRetries) {
        setTimeout(() => {
          this.setState(prevState => ({
            hasError: false,
            retryCount: prevState.retryCount + 1
          }))
        }, 100)
      }
    }
  }

  private handleManualRetry = () => {
    this.setState({
      hasError: false,
      retryCount: 0
    })
  }

  public render() {
    if (this.state.hasError && this.state.retryCount >= this.maxRetries) {
      return (
        this.props.fallback || (
          <div className="p-4 text-center text-gray-500">
            <p className="mb-2">组件加载失败</p>
            <button 
              onClick={this.handleManualRetry}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
            >
              重新加载
            </button>
          </div>
        )
      )
    }

    return this.props.children
  }
}