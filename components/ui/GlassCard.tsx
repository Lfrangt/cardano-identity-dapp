'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  hover = true 
}) => {
  return (
    <motion.div
      whileHover={hover ? { y: -5, scale: 1.02 } : {}}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "backdrop-blur-xl bg-white/80 border border-white/20",
        "rounded-2xl shadow-glass",
        "transition-all duration-300",
        hover && "hover:shadow-card-hover hover:bg-white/90",
        className
      )}
    >
      {children}
    </motion.div>
  )
}