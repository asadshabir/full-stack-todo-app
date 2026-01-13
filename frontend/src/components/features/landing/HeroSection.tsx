"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { AnimatedButton } from "@/components/ui/animated-button"
import { GradientText } from "@/components/ui/gradient-text"
import { CheckCircle2, Sparkles, Zap, Star } from "lucide-react"

/**
 * Hero Section Component
 *
 * Eye-catching landing page hero with 3D animations and call-to-action
 */

export function HeroSection() {
  const features = [
    { icon: CheckCircle2, text: "Smart Task Management" },
    { icon: Sparkles, text: "Beautiful 3D Interface" },
    { icon: Zap, text: "Lightning Fast" },
    { icon: Star, text: "Priority System" },
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Hero Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-white/80">Powered by AI & 3D Magic</span>
          </motion.div>

          {/* Main Heading */}
          <GradientText className="text-5xl md:text-7xl lg:text-8xl mb-6 leading-tight">
            Organize Your Life
            <br />
            In 3D Style
          </GradientText>

          {/* Subheading */}
          <motion.p
            className="text-xl md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Experience task management like never before with stunning 3D animations,
            smart prioritization, and an interface that makes productivity feel magical.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Link href="/signup">
              <AnimatedButton variant="primary" className="text-lg px-8 py-4">
                Get Started Free
              </AnimatedButton>
            </Link>
            <Link href="/signin">
              <AnimatedButton variant="outline" className="text-lg px-8 py-4">
                Sign In
              </AnimatedButton>
            </Link>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <feature.icon className="w-8 h-8 text-purple-400" />
                <span className="text-sm text-white/80">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Floating 3D Elements */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-xl"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 backdrop-blur-xl"
        animate={{
          y: [0, 30, 0],
          rotate: [0, -10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/2 right-20 w-16 h-16 rounded-lg bg-gradient-to-br from-yellow-500/30 to-orange-500/30 backdrop-blur-xl"
        animate={{
          y: [0, -25, 0],
          x: [0, 10, 0],
          rotate: [0, 45, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </section>
  )
}
