"use client"

import { motion, HTMLMotionProps } from "framer-motion"
import { ReactNode, forwardRef } from "react"
import { cn } from "@/lib/utils"

/**
 * Animated 3D Button Component
 *
 * Features:
 * - 3D press effect
 * - Shimmer animation on hover
 * - Ripple effect on click
 * - Loading state animation
 */

interface AnimatedButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode
  variant?: "primary" | "secondary" | "outline" | "ghost"
  isLoading?: boolean
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, className, variant = "primary", isLoading, disabled, ...props }, ref) => {
    const variants = {
      primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700",
      secondary: "bg-gradient-to-r from-slate-700 to-slate-800 text-white hover:from-slate-800 hover:to-slate-900",
      outline: "border-2 border-white/30 bg-white/5 text-white hover:bg-white/10 hover:border-white/50",
      ghost: "bg-transparent text-white hover:bg-white/10",
    }

    return (
      <motion.button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "relative overflow-hidden rounded-xl px-6 py-3 font-semibold",
          "shadow-lg shadow-black/20",
          "transition-all duration-300",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "before:absolute before:inset-0 before:z-0",
          "before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
          "before:translate-x-[-200%]",
          "hover:before:translate-x-[200%]",
          "before:transition-transform before:duration-700",
          variants[variant],
          className
        )}
        whileHover={{
          scale: disabled || isLoading ? 1 : 1.05,
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
        }}
        whileTap={{
          scale: disabled || isLoading ? 1 : 0.95,
        }}
        {...props}
      >
        <motion.span
          className="relative z-10 flex items-center justify-center gap-2"
          animate={isLoading ? { opacity: [1, 0.5, 1] } : {}}
          transition={isLoading ? { duration: 1.5, repeat: Infinity } : {}}
        >
          {isLoading ? (
            <>
              <motion.div
                className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span>Loading...</span>
            </>
          ) : (
            children
          )}
        </motion.span>

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 z-0"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
            backgroundSize: "200% 100%",
          }}
        />
      </motion.button>
    )
  }
)

AnimatedButton.displayName = "AnimatedButton"
