"use client"

/**
 * AI Chat Page
 *
 * Premium AI-powered task management through natural conversation
 */

import { motion } from "framer-motion"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { FloatingParticles } from "@/components/ui/floating-particles"
import { GradientText } from "@/components/ui/gradient-text"
import { ChatContainer } from "@/components/features/chat"

export default function ChatPage() {
  return (
    <>
      <AnimatedBackground />
      <FloatingParticles count={20} />

      <div className="relative min-h-screen flex flex-col p-6">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <GradientText className="text-4xl md:text-5xl mb-2">
              AI Task Assistant
            </GradientText>
            <p className="text-foreground/60 text-lg">
              Manage your tasks using natural language
            </p>
          </motion.div>

          {/* Chat Container */}
          <div className="flex-1 min-h-0">
            <ChatContainer />
          </div>
        </div>
      </div>
    </>
  )
}
