'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface LiquidGlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  pulse?: boolean
  rainbow?: boolean
  float?: boolean
}

export const LiquidGlassCard: React.FC<LiquidGlassCardProps> = ({
  children,
  className,
  hover = true,
  pulse = false,
  rainbow = false,
  float = false
}) => {
  return (
    <div
      className={cn(
        'liquid-glass-card',
        hover && 'hover:scale-[1.02]',
        pulse && 'liquid-glass-pulse',
        rainbow && 'liquid-glass-rainbow',
        float && 'liquid-glass-float',
        className
      )}
    >
      {children}
    </div>
  )
}

interface LiquidGlassButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'default' | 'primary'
  disabled?: boolean
  loading?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export const LiquidGlassButton: React.FC<LiquidGlassButtonProps> = ({
  children,
  onClick,
  variant = 'default',
  disabled = false,
  loading = false,
  className,
  size = 'md'
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'liquid-glass-button',
        variant === 'primary' && 'liquid-glass-button-primary',
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-6 py-3 text-base': size === 'md',
          'px-8 py-4 text-lg': size === 'lg',
        },
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      )}
      {children}
    </button>
  )
}

interface LiquidGlassInputProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  type?: 'text' | 'email' | 'password'
  className?: string
}

export const LiquidGlassInput: React.FC<LiquidGlassInputProps> = ({
  placeholder,
  value,
  onChange,
  type = 'text',
  className
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={cn('liquid-glass-input', className)}
    />
  )
}

interface LiquidGlassNavProps {
  children: React.ReactNode
  className?: string
}

export const LiquidGlassNav: React.FC<LiquidGlassNavProps> = ({
  children,
  className
}) => {
  return (
    <nav className={cn('liquid-glass-nav', className)}>
      {children}
    </nav>
  )
}