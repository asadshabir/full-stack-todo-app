"use client"

import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"

/**
 * StatsCard Component
 *
 * Animated statistics card with icon and count
 */

interface StatsCardProps {
  title: string
  value: number
  icon: LucideIcon
  gradient: string
  delay?: number
}

export function StatsCard({ title, value, icon: Icon, gradient, delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <GlassCard hover3d={true} className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 dark:text-white/60 text-sm mb-1">{title}</p>
            <motion.p
              className="text-3xl font-bold text-slate-900 dark:text-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: delay + 0.2 }}
            >
              {value}
            </motion.p>
          </div>

          <motion.div
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center`}
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <Icon className="w-8 h-8 text-white" />
          </motion.div>
        </div>
      </GlassCard>
    </motion.div>
  )
}
