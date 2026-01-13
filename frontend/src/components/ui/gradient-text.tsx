"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * Animated Gradient Text Component
 *
 * Features:
 * - Animated gradient colors
 * - Shimmer effect
 * - Text shadow glow
 */

interface GradientTextProps {
  children: ReactNode
  className?: string
  animate?: boolean
}

export function GradientText({ children, className, animate = true }: GradientTextProps) {
  return (
    <motion.h1
      className={cn(
        "bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent",
        "font-bold",
        animate && "bg-[length:200%_auto]",
        className
      )}
      animate={
        animate
          ? {
              backgroundPosition: ["0% center", "200% center", "0% center"],
            }
          : undefined
      }
      transition={
        animate
          ? {
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }
          : undefined
      }
      style={{
        backgroundSize: animate ? "200% auto" : undefined,
      }}
    >
      {children}
    </motion.h1>
  )
}
