"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { FloatingParticles } from "@/components/ui/floating-particles"
import { GlassCard } from "@/components/ui/glass-card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { GradientText } from "@/components/ui/gradient-text"
import { CheckSquare, User, Mail, Calendar, ArrowRight } from "lucide-react"

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Go to Todos */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link href="/dashboard/todos">
                <GlassCard className="p-8 cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="space-y-3">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <CheckSquare className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground">Your Tasks</h3>
                      <p className="text-foreground/60">
                        Manage your todos with our beautiful 3D interface
                      </p>
                    </div>
                    <motion.div
                      className="text-foreground/40 group-hover:text-foreground group-hover:translate-x-2 transition-all"
                      whileHover={{ x: 5 }}
                    >
                      <ArrowRight className="w-8 h-8" />
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
              <GlassCard className="p-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Your Profile</h3>
                  </div>

                  <div className="space-y-3 pt-4">
                    {user?.email && (
                      <div className="flex items-center gap-3 text-foreground/80">
                        <Mail className="w-5 h-5 text-purple-400" />
                        <span>{user.email}</span>
                      </div>
                    )}
                    {user?.name && (
                      <div className="flex items-center gap-3 text-foreground/80">
                        <User className="w-5 h-5 text-pink-400" />
                        <span>{user.name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-foreground/80">
                      <Calendar className="w-5 h-5 text-cyan-400" />
                      <span>Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <GlassCard className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6">What You Can Do</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Task Management",
                    description: "Create, edit, and organize your tasks with ease",
                    gradient: "from-purple-500/20 to-pink-500/20",
                  },
                  {
                    title: "Priority System",
                    description: "Mark tasks as low, medium, or high priority",
                    gradient: "from-blue-500/20 to-cyan-500/20",
                  },
                  {
                    title: "Smart Filters",
                    description: "Filter by category, priority, and completion status",
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
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center"
          >
            <Link href="/dashboard/todos">
              <AnimatedButton variant="primary" className="text-lg px-8 py-4">
                Get Started with Your Tasks
                <ArrowRight className="w-5 h-5 ml-2" />
              </AnimatedButton>
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  )
}
