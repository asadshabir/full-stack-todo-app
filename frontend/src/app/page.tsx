"use client"

import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { HeroSection } from "@/components/features/landing/HeroSection"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { FloatingParticles } from "@/components/ui/floating-particles"

export default function Home() {
  return (
    <>
      <AnimatedBackground />
      <FloatingParticles count={40} />

      <div className="relative min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <HeroSection />
        </main>
        <Footer />
      </div>
    </>
  )
}
