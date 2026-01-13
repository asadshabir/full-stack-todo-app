"use client"

/**
 * Dashboard Layout
 *
 * Protected layout for authenticated users with premium header
 * Includes enhanced glassmorphism header, animated background, and floating particles
 */

import { useAuth } from "@/hooks/useAuth"
import { DashboardHeader } from "@/components/layout/DashboardHeader"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { FloatingParticles } from "@/components/ui/floating-particles"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { signOut, user } = useAuth()

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
