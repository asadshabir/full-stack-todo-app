"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

/**
 * Animated 3D Background Component
 *
 * Features:
 * - Floating gradient orbs with 3D transforms
 * - Parallax effect on mouse move
 * - Smooth animations using framer-motion
 * - Glassmorphism aesthetic
 * - Light/Dark theme support (self-contained, no context dependency)
 */

interface FloatingOrb {
  id: number
  x: number
  y: number
  size: number
  colorDark: string
  colorLight: string
  duration: number
  delay: number
}

export function AnimatedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [_mounted, setMounted] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("dark")

  // Safely get theme
  useEffect(() => {
    setMounted(true)
    // Check if theme is stored in localStorage
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    if (savedTheme) {
      setCurrentTheme(savedTheme)
    } else {
      // Check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setCurrentTheme(prefersDark ? "dark" : "light")
    }
  }, [])

  // Listen for theme changes from the context
  useEffect(() => {
    const handleThemeChange = () => {
      const theme = localStorage.getItem("theme") as "light" | "dark" | null
      if (theme) {
        setCurrentTheme(theme)
      }
    }

    // Listen for storage changes
    window.addEventListener("storage", handleThemeChange)

    // Also check periodically (in case localStorage is updated in same window)
    const interval = setInterval(handleThemeChange, 100)

    return () => {
      window.removeEventListener("storage", handleThemeChange)
      clearInterval(interval)
    }
  }, [])

  const orbs: FloatingOrb[] = [
    {
      id: 1, x: 10, y: 20, size: 400,
      colorDark: "from-blue-500/30 to-purple-500/30",
      colorLight: "from-blue-200/40 to-purple-200/40",
      duration: 20, delay: 0
    },
    {
      id: 2, x: 70, y: 60, size: 350,
      colorDark: "from-pink-500/30 to-red-500/30",
      colorLight: "from-pink-200/40 to-red-200/40",
      duration: 25, delay: 5
    },
    {
      id: 3, x: 50, y: 10, size: 300,
      colorDark: "from-cyan-500/30 to-blue-500/30",
      colorLight: "from-cyan-200/40 to-blue-200/40",
      duration: 18, delay: 2
    },
    {
      id: 4, x: 20, y: 70, size: 450,
      colorDark: "from-purple-500/30 to-pink-500/30",
      colorLight: "from-purple-200/40 to-pink-200/40",
      duration: 22, delay: 8
    },
    {
      id: 5, x: 80, y: 30, size: 320,
      colorDark: "from-indigo-500/30 to-purple-500/30",
      colorLight: "from-indigo-200/40 to-purple-200/40",
      duration: 24, delay: 4
    },
  ]

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const bgGradient = currentTheme === "dark"
    ? "bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950"
    : "bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50"

  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden transition-colors duration-500 ${bgGradient}`}>
      {/* Animated gradient orbs */}
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className={`absolute rounded-full bg-gradient-to-br ${currentTheme === "dark" ? orb.colorDark : orb.colorLight} blur-3xl transition-colors duration-500`}
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: orb.size,
            height: orb.size,
            transform: `translate(-50%, -50%)`,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.1, 0.9, 1],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Parallax layer */}
      <motion.div
        className="absolute inset-0"
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 20,
        }}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </motion.div>

      {/* Vignette effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/50" />
    </div>
  )
}
