"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { AnimatedButton } from "@/components/ui/animated-button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { CheckSquare, Menu, X, Sparkles } from "lucide-react"

/**
 * Header Component
 *
 * Premium glassmorphism header with navigation, theme toggle, mobile menu, and 3D hover effects
 * Matches landing page quality with sophisticated animations and design
 */

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
  ]

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-2xl bg-gradient-to-r from-black/30 via-purple-900/20 to-black/30 shadow-lg shadow-purple-500/5"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div
              className="flex items-center gap-3 cursor-pointer group"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <motion.div
                className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/50"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
              >
                <CheckSquare className="w-6 h-6 text-white" />
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  TaskFlow 3D
                </span>
                <motion.span
                  className="text-[10px] text-purple-300/70 -mt-1 flex items-center gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Sparkles className="w-2 h-2" />
                  Next-Gen Productivity
                </motion.span>
              </div>
            </motion.div>
          </Link>

          {/* Navigation - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.a
                key={index}
                href={item.href}
                className="relative text-white/70 hover:text-white transition-colors font-medium text-[15px] group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                whileHover={{ y: -2 }}
              >
                {item.label}
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileHover={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
                <motion.div
                  className="absolute inset-0 -z-10 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity"
                />
              </motion.a>
            ))}
          </div>

          {/* Theme Toggle & Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <ThemeToggle />
            </motion.div>
            <Link href="/signin">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <AnimatedButton variant="ghost" className="text-[15px] px-5">
                  Sign In
                </AnimatedButton>
              </motion.div>
            </Link>
            <Link href="/signup">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <AnimatedButton variant="primary" className="text-[15px] px-6 shadow-lg shadow-purple-500/30">
                  Get Started
                </AnimatedButton>
              </motion.div>
            </Link>
          </div>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle />
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6 text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Menu Content */}
            <motion.div
              className="absolute top-20 left-4 right-4 bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-purple-500/20 overflow-hidden"
              initial={{ y: -20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="p-6 space-y-6">
                {/* Navigation Links */}
                <div className="space-y-2">
                  {navItems.map((item, index) => (
                    <motion.a
                      key={index}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all font-medium"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 * index, duration: 0.3 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {item.label}
                    </motion.a>
                  ))}
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                {/* Auth Buttons */}
                <div className="space-y-3">
                  <Link href="/signin" onClick={() => setMobileMenuOpen(false)}>
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.3 }}
                    >
                      <AnimatedButton variant="ghost" className="w-full">
                        Sign In
                      </AnimatedButton>
                    </motion.div>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.3 }}
                    >
                      <AnimatedButton variant="primary" className="w-full shadow-lg shadow-purple-500/30">
                        Get Started
                      </AnimatedButton>
                    </motion.div>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
