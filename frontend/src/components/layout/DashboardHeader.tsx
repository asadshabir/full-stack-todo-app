"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatedButton } from "@/components/ui/animated-button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { CheckSquare, Menu, X, LayoutDashboard, ListTodo, LogOut, Sparkles, User, MessageSquare } from "lucide-react"

/**
 * DashboardHeader Component
 *
 * Premium glassmorphism header for authenticated dashboard with navigation, theme toggle, and user menu
 * Matches landing page quality with sophisticated animations and design
 */

interface DashboardHeaderProps {
  onSignOut: () => void
  userEmail?: string
}

export function DashboardHeader({ onSignOut, userEmail }: DashboardHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard"
    },
    {
      label: "AI Chat",
      href: "/dashboard/chat",
      icon: MessageSquare,
      active: pathname === "/dashboard/chat"
    },
    {
      label: "Todos",
      href: "/dashboard/todos",
      icon: ListTodo,
      active: pathname === "/dashboard/todos"
    },
  ]

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/50 dark:border-white/10 backdrop-blur-2xl bg-gradient-to-r from-white/80 via-purple-50/80 to-white/80 dark:from-black/30 dark:via-purple-900/20 dark:to-black/30 shadow-lg shadow-purple-500/5"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard">
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
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                  TaskFlow 3D
                </span>
                <motion.span
                  className="text-[10px] text-purple-600/70 dark:text-purple-300/70 -mt-1 flex items-center gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Sparkles className="w-2 h-2" />
                  Dashboard
                </motion.span>
              </div>
            </motion.div>
          </Link>

          {/* Navigation - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item, index) => (
              <Link key={index} href={item.href}>
                <motion.div
                  className={`
                    relative px-4 py-2.5 rounded-xl font-medium text-[15px]
                    transition-all flex items-center gap-2 group
                    ${item.active
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30"
                      : "text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                    }
                  `}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                  {item.active && (
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-20 transition-opacity"
                      layoutId="activeTab"
                    />
                  )}
                </motion.div>
              </Link>
            ))}
          </div>

          {/* User Section - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <ThemeToggle />
            </motion.div>

            {userEmail && (
              <motion.div
                className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/20"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-slate-700 dark:text-white/80 max-w-[150px] truncate">
                    {userEmail}
                  </span>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <AnimatedButton
                variant="outline"
                onClick={onSignOut}
                className="flex items-center gap-2 text-[15px] px-5 border-slate-300 dark:border-white/20 hover:border-red-500 dark:hover:border-red-500 hover:text-red-600 dark:hover:text-red-400"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </AnimatedButton>
            </motion.div>
          </div>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle />
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-white/10 backdrop-blur-sm border border-slate-200 dark:border-white/20 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
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
                    <X className="w-6 h-6 text-slate-700 dark:text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6 text-slate-700 dark:text-white" />
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
              className="absolute top-20 left-4 right-4 bg-gradient-to-br from-white/95 via-purple-50/95 to-white/95 dark:from-slate-900/95 dark:via-purple-900/95 dark:to-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl shadow-purple-500/20 overflow-hidden"
              initial={{ y: -20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="p-6 space-y-6">
                {/* User Info */}
                {userEmail && (
                  <div className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/20">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-purple-500" />
                      <span className="text-sm text-slate-700 dark:text-white/80 truncate">
                        {userEmail}
                      </span>
                    </div>
                  </div>
                )}

                {/* Navigation Links */}
                <div className="space-y-2">
                  {navItems.map((item, index) => (
                    <Link key={index} href={item.href}>
                      <motion.div
                        onClick={() => setMobileMenuOpen(false)}
                        className={`
                          flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
                          ${item.active
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30"
                            : "text-slate-700 dark:text-white/80 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                          }
                        `}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 * index, duration: 0.3 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                      </motion.div>
                    </Link>
                  ))}
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-white/20 to-transparent" />

                {/* Sign Out Button */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <AnimatedButton
                    variant="outline"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      onSignOut()
                    }}
                    className="w-full flex items-center justify-center gap-2 border-slate-300 dark:border-white/20 hover:border-red-500 dark:hover:border-red-500 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </AnimatedButton>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
