"use client"

import { motion } from "framer-motion"
import { forwardRef, useState } from "react"
import { cn } from "@/lib/utils"

/**
 * Animated Input Component
 *
 * Features:
 * - Focus glow animation
 * - Label floating animation
 * - Border gradient on focus
 * - Smooth transitions
 */

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ label, error, className, type = "text", ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const [hasValue, setHasValue] = useState(false)

    return (
      <div className="relative w-full">
        <motion.div
          className="relative"
          initial={false}
          animate={{
            scale: isFocused ? 1.01 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          {/* Animated border */}
          <motion.div
            className={cn(
              "absolute inset-0 rounded-xl",
              error ? "bg-gradient-to-r from-red-500 to-pink-500" : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: isFocused ? 0.5 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ padding: "2px", zIndex: -1 }}
          />

          {/* Input */}
          <input
            ref={ref}
            type={type}
            className={cn(
              "w-full rounded-xl border-2 border-white/20 bg-white/5 px-4 py-3 text-white",
              "backdrop-blur-sm",
              "transition-all duration-300",
              "focus:border-white/40 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50",
              "placeholder:text-white/40",
              error && "border-red-500/50 focus:ring-red-500/50",
              label && "pt-6 pb-2",
              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              setIsFocused(false)
              setHasValue(e.target.value.length > 0)
            }}
            {...props}
          />

          {/* Floating label */}
          {label && (
            <motion.label
              className={cn(
                "absolute left-4 text-white/60 pointer-events-none transition-all duration-300",
                isFocused || hasValue ? "top-2 text-xs" : "top-1/2 -translate-y-1/2 text-base"
              )}
              animate={{
                color: isFocused ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.6)",
              }}
            >
              {label}
            </motion.label>
          )}

          {/* Focus glow */}
          <motion.div
            className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 blur-xl"
            animate={{ opacity: isFocused ? 0.3 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ zIndex: -2 }}
          />
        </motion.div>

        {/* Error message */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-red-400"
          >
            {error}
          </motion.p>
        )}
      </div>
    )
  }
)

AnimatedInput.displayName = "AnimatedInput"
