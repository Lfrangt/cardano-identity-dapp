'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface AppleCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'elevated' | 'flat'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

export const AppleCard: React.FC<AppleCardProps> = ({
  children,
  className,
  variant = 'default',
  padding = 'md',
  hover = true
}) => {
  return (
    <div
      className={cn(
        // 基础样式
        'rounded-2xl transition-all duration-300 ease-out',
        
        // 变体样式
        {
          // 默认卡片 - 苹果经典的毛玻璃效果
          'bg-white/80 backdrop-blur-xl border border-white/20 shadow-sm': variant === 'default',
          
          // 悬浮卡片 - 更明显的阴影
          'bg-white/90 backdrop-blur-xl border border-white/30 shadow-lg': variant === 'elevated',
          
          // 扁平卡片 - 无阴影
          'bg-white/70 backdrop-blur-lg border border-gray-200/50': variant === 'flat',
        },
        
        // 内边距
        {
          'p-0': padding === 'none',
          'p-3': padding === 'sm',
          'p-6': padding === 'md',
          'p-8': padding === 'lg',
        },
        
        // 悬停效果
        hover && 'hover:shadow-xl hover:scale-[1.02] hover:bg-white/95',
        
        className
      )}
    >
      {children}
    </div>
  )
}