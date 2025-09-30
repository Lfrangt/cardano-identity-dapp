'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface AnimatedButtonProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className
}) => {
  const baseClasses = cn(
    "inline-flex items-center justify-center font-medium rounded-xl",
    "transition-all duration-200 ease-out",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    {
      // Variants
      'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-button focus:ring-blue-500': variant === 'primary',
      'bg-white/80 text-gray-900 border border-gray-200 hover:bg-white hover:border-gray-300 focus:ring-gray-500': variant === 'secondary',
      'text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 focus:ring-gray-500': variant === 'ghost',
      
      // Sizes
      'px-4 py-2 text-sm': size === 'sm',
      'px-6 py-3 text-base': size === 'md',
      'px-8 py-4 text-lg': size === 'lg',
    },
    className
  )

  const buttonContent = (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={baseClasses}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </motion.button>
  )

  if (href) {
    return (
      <Link href={href}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={baseClasses}
        >
          {children}
        </motion.div>
      </Link>
    )
  }

  return buttonContent
}