"use client"

import { motion } from "framer-motion"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

/**
 * ThemeToggle Component
 *
 * Animated toggle button for switching between light and dark themes
 * Self-contained - works without ThemeContext dependency
 */

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark">("dark")

  // Initialize theme from localStorage
  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setTheme(prefersDark ? "dark" : "light")
    }
  }, [])

  // Listen for theme changes
  useEffect(() => {
    if (!mounted) return

    const handleThemeChange = () => {
      const currentTheme = localStorage.getItem("theme") as "light" | "dark" | null
      if (currentTheme) {
        setTheme(currentTheme)
      }
    }

    const interval = setInterval(handleThemeChange, 100)
    window.addEventListener("storage", handleThemeChange)

    return () => {
      clearInterval(interval)
      window.removeEventListener("storage", handleThemeChange)
    }
  }, [mounted])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)

    // Apply to document
    const root = document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(newTheme)
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="w-14 h-8 rounded-full bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-sm" />
    )
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-14 h-8 rounded-full bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-sm flex items-center px-1 transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      {/* Toggle indicator */}
      <motion.div
        className="absolute w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg"
        animate={{
          x: theme === "dark" ? 22 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      />

      {/* Icons */}
      <div className="relative w-full flex items-center justify-between px-1">
        <Sun className="w-4 h-4 text-yellow-400" />
        <Moon className="w-4 h-4 text-blue-300" />
      </div>
    </motion.button>
  )
}
