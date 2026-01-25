"use client"

/**
 * Dashboard Layout
 *
 * Protected layout for authenticated users with premium header
 * Includes enhanced glassmorphism header, animated background, and floating particles
 */

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { DashboardHeader } from "@/components/layout/DashboardHeader"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { FloatingParticles } from "@/components/ui/floating-particles"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { signOut, user, isLoading, isAuthenticated } = useAuth()

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/signin")
    }
  }, [isLoading, isAuthenticated, router])

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  // Don't render dashboard if not authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      {/* Animated Background */}
      <AnimatedBackground />
      <FloatingParticles count={25} />

      <div className="relative min-h-screen">
        {/* Enhanced Header */}
        <DashboardHeader onSignOut={signOut} userEmail={user?.email} />

        {/* Main Content with top padding for fixed header */}
        <main className="container mx-auto px-4 py-8 pt-28">{children}</main>
      </div>
    </>
  )
}
