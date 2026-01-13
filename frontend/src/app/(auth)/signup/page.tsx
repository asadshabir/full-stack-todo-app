"use client"

import { SignUpForm } from "@/components/features/auth/SignUpForm"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { FloatingParticles } from "@/components/ui/floating-particles"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientText } from "@/components/ui/gradient-text"
import { motion } from "framer-motion"
import Link from "next/link"

export default function SignUpPage() {
  return (
    <>
      <AnimatedBackground />
      <FloatingParticles count={30} />

      <div className="relative flex min-h-screen items-center justify-center p-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="w-full max-w-md"
        >
          <GlassCard className="p-8">
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-2 text-center">
                <GradientText className="text-4xl">
                  Create Account
                </GradientText>
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-slate-600 dark:text-white/80"
                >
                  Sign up to get started with your tasks
                </motion.p>
              </div>

              {/* Form */}
              <SignUpForm />

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-300 dark:border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-transparent px-4 text-slate-600 dark:text-white/60">Already have an account?</span>
                  </div>
                </div>

                <Link
                  href="/signin"
                  className="block text-center text-sm text-slate-600 dark:text-white/80 transition-colors hover:text-slate-900 dark:hover:text-white"
                >
                  Sign in instead →
                </Link>
              </motion.div>
            </div>
          </GlassCard>

          {/* Decorative elements */}
          <motion.div
            className="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-pink-500/20 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </motion.div>
      </div>
    </>
  )
}
