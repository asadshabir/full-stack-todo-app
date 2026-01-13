"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * Glassmorphism Card Component
 *
 * Features:
 * - Glass morphism effect with backdrop blur
 * - 3D hover animations
 * - Border glow on hover
 * - Smooth transitions
 */

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover3d?: boolean
}

export function GlassCard({ children, className, hover3d = true }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateX: -10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={
        hover3d
          ? {
              scale: 1.02,
              rotateX: 5,
              rotateY: 5,
              transition: { duration: 0.3 },
            }
          : undefined
      }
      className={cn(
        "relative overflow-hidden rounded-2xl",
        "bg-white/70 dark:bg-white/10 backdrop-blur-xl",
        "border border-slate-300 dark:border-white/20",
        "shadow-2xl shadow-black/10 dark:shadow-black/20",
        "before:absolute before:inset-0",
        "before:rounded-2xl before:p-[1px]",
        "before:bg-gradient-to-br before:from-slate-300/50 dark:before:from-white/20 before:to-transparent",
        "before:-z-10",
        "after:absolute after:inset-0",
        "after:rounded-2xl",
        "after:bg-gradient-to-br after:from-transparent after:via-slate-200/30 dark:after:via-white/5 after:to-transparent",
        "after:-z-10",
        "hover:border-slate-400 dark:hover:border-white/30",
        "hover:shadow-3xl hover:shadow-purple-500/30 dark:hover:shadow-purple-500/20",
        "transition-all duration-300",
        className
      )}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      {children}
    </motion.div>
  )
}
