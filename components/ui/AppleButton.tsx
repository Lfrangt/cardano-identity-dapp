'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface AppleButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  className?: string
  fullWidth?: boolean
}

export const AppleButton: React.FC<AppleButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className,
  fullWidth = false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        // 基础样式
        'relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        
        // 变体样式
        {
          // 主要按钮 - 苹果蓝色渐变
          'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:from-blue-600 hover:to-blue-700 hover:shadow-xl focus:ring-blue-500 active:scale-95': variant === 'primary',
          
          // 次要按钮 - 毛玻璃效果
          'bg-white/80 backdrop-blur-xl border border-white/30 text-gray-900 shadow-sm hover:bg-white/90 hover:shadow-md focus:ring-gray-500': variant === 'secondary',
          
          // 幽灵按钮 - 透明背景
          'text-gray-700 hover:bg-gray-100/50 focus:ring-gray-500': variant === 'ghost',
        },
        
        // 尺寸
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-6 py-3 text-base': size === 'md',
          'px-8 py-4 text-lg': size === 'lg',
        },
        
        // 宽度
        fullWidth && 'w-full',
        
        className
      )}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      <span className={cn(loading && 'opacity-0')}>
        {children}
      </span>
    </button>
  )
}