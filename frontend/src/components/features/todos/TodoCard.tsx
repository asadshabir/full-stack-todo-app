"use client"

import { motion } from "framer-motion"
import { Check, Clock, Trash2, Edit, Flag, Calendar } from "lucide-react"
import type { Todo } from "@/types/todo"
import { GlassCard } from "@/components/ui/glass-card"

/**
 * TodoCard Component
 *
 * 3D animated card for displaying and managing individual todos
 */

interface TodoCardProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (todo: Todo) => void
}

const priorityColors = {
  low: "from-green-500/30 to-emerald-500/30",
  medium: "from-yellow-500/30 to-orange-500/30",
  high: "from-red-500/30 to-pink-500/30",
}

const priorityBorder = {
  low: "border-green-500/50",
  medium: "border-yellow-500/50",
  high: "border-red-500/50",
}

const categoryColors = {
  personal: "bg-purple-500/20 text-purple-300",
  work: "bg-blue-500/20 text-blue-300",
  shopping: "bg-pink-500/20 text-pink-300",
  health: "bg-green-500/20 text-green-300",
  other: "bg-gray-500/20 text-gray-300",
}

export function TodoCard({ todo, onToggle, onDelete, onEdit }: TodoCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard className={`p-6 ${priorityBorder[todo.priority]}`}>
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              {/* Checkbox */}
              <motion.button
                onClick={() => onToggle(todo.id)}
                className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                  todo.completed
                    ? "bg-gradient-to-br from-purple-500 to-pink-500 border-purple-500"
                    : "border-slate-400 dark:border-white/30 hover:border-slate-600 dark:hover:border-white/50"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {todo.completed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </motion.button>

              {/* Title & Description */}
              <div className="flex-1">
                <h3
                  className={`text-lg font-semibold text-slate-900 dark:text-white transition-all ${
                    todo.completed ? "line-through opacity-60" : ""
                  }`}
                >
                  {todo.title}
                </h3>
                {todo.description && (
                  <p className="text-sm text-slate-600 dark:text-white/60 mt-1">{todo.description}</p>
                )}
              </div>
            </div>

            {/* Priority Badge */}
            <motion.div
              className={`flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r ${priorityColors[todo.priority]} backdrop-blur-sm text-slate-900 dark:text-white`}
              whileHover={{ scale: 1.05 }}
            >
              <Flag className="w-3 h-3" />
              <span className="text-xs font-medium capitalize">{todo.priority}</span>
            </motion.div>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-2">
            {/* Category */}
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[todo.category]}`}>
              {todo.category}
            </span>

            {/* Due Date */}
            {todo.dueDate && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-200 dark:bg-white/5 text-slate-700 dark:text-white/60 text-xs">
                <Calendar className="w-3 h-3" />
                {new Date(todo.dueDate).toLocaleDateString()}
              </span>
            )}

            {/* Status */}
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-200 dark:bg-white/5 text-slate-700 dark:text-white/60 text-xs">
              <Clock className="w-3 h-3" />
              {todo.status.replace("-", " ")}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <motion.button
              onClick={() => onEdit(todo)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 hover:text-slate-900 dark:text-white/70 dark:hover:text-white text-sm transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Edit className="w-4 h-4" />
              Edit
            </motion.button>

            <motion.button
              onClick={() => onDelete(todo.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </motion.button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}
