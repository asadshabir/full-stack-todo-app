"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { FloatingParticles } from "@/components/ui/floating-particles"
import { GlassCard } from "@/components/ui/glass-card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { GradientText } from "@/components/ui/gradient-text"
import { CheckSquare, User, Mail, Calendar, ArrowRight, MessageSquare, Bot } from "lucide-react"

/**
 * Dashboard Page
 *
 * Protected dashboard showing user information and quick access to todos
 */

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <>
      <AnimatedBackground />
      <FloatingParticles count={25} />

      <div className="relative min-h-screen p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <GradientText className="text-5xl mb-4">
              Welcome Back{user?.name ? `, ${user.name}` : ""}!
            </GradientText>
            <p className="text-foreground/70 text-lg">Ready to be productive today?</p>
          </motion.div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* AI Chat - Primary Feature */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:col-span-2"
            >
              <Link href="/dashboard/chat">
                <GlassCard className="p-8 cursor-pointer group relative overflow-hidden">
                  {/* Animated Background Gradient */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                    animate={{
                      background: [
                        "linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(236, 72, 153, 0.1) 50%, rgba(59, 130, 246, 0.2) 100%)",
                        "linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(168, 85, 247, 0.1) 50%, rgba(236, 72, 153, 0.2) 100%)",
                        "linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(236, 72, 153, 0.1) 50%, rgba(59, 130, 246, 0.2) 100%)",
                      ],
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                  />
                  <div className="relative flex items-center justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <motion.div
                          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          animate={{
                            boxShadow: [
                              "0 10px 30px rgba(168, 85, 247, 0.3)",
                              "0 10px 40px rgba(168, 85, 247, 0.5)",
                              "0 10px 30px rgba(168, 85, 247, 0.3)",
                            ],
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Bot className="w-9 h-9 text-white" />
                        </motion.div>
                        <div>
                          <h3 className="text-2xl font-bold text-foreground">AI Task Assistant</h3>
                          <p className="text-purple-500 text-sm font-medium">Powered by Gemini AI</p>
                        </div>
                      </div>
                      <p className="text-foreground/60 max-w-md">
                        Manage your tasks using natural language. Just tell me what you need - create tasks, mark them complete, or get an overview of your day.
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {["Add task", "Show pending", "Mark complete", "Delete tasks"].map((cmd) => (
                          <span key={cmd} className="px-3 py-1 rounded-full bg-foreground/5 border border-foreground/10 text-xs text-foreground/70">
                            {cmd}
                          </span>
                        ))}
                      </div>
                    </div>
                    <motion.div
                      className="text-foreground/40 group-hover:text-purple-500 transition-all"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-10 h-10" />
                    </motion.div>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>

            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <GlassCard className="p-8 h-full">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Profile</h3>
                  </div>

                  <div className="space-y-3 pt-2">
                    {user?.email && (
                      <div className="flex items-center gap-3 text-foreground/80 text-sm">
                        <Mail className="w-4 h-4 text-purple-400" />
                        <span className="truncate">{user.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-foreground/80 text-sm">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      <span>Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* Secondary Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Go to Todos */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link href="/dashboard/todos">
                <GlassCard className="p-6 cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <CheckSquare className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">Your Tasks</h3>
                        <p className="text-foreground/60 text-sm">
                          View and manage all your todos
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-6 h-6 text-foreground/40 group-hover:text-foreground group-hover:translate-x-2 transition-all" />
                  </div>
                </GlassCard>
              </Link>
            </motion.div>

            {/* Chat History */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link href="/dashboard/chat">
                <GlassCard className="p-6 cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MessageSquare className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">Conversations</h3>
                        <p className="text-foreground/60 text-sm">
                          View your chat history
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-6 h-6 text-foreground/40 group-hover:text-foreground group-hover:translate-x-2 transition-all" />
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          </div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <GlassCard className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6">What You Can Do</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Natural Language",
                    description: "Tell the AI what you need in plain English",
                    gradient: "from-purple-500/20 to-pink-500/20",
                  },
                  {
                    title: "Smart Task Creation",
                    description: "AI understands context and creates tasks automatically",
                    gradient: "from-blue-500/20 to-cyan-500/20",
                  },
                  {
                    title: "Conversation Memory",
                    description: "Continue where you left off with chat history",
                    gradient: "from-green-500/20 to-emerald-500/20",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className={`p-6 rounded-xl bg-gradient-to-br ${feature.gradient} backdrop-blur-sm border border-border`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                    <p className="text-foreground/60 text-sm">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-center"
          >
            <Link href="/dashboard/chat">
              <AnimatedButton variant="primary" className="text-lg px-8 py-4">
                Start Chatting with AI
                <Bot className="w-5 h-5 ml-2" />
              </AnimatedButton>
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  )
}
