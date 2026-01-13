"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Search, CheckCircle, Clock, AlertCircle, TrendingUp } from "lucide-react"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { FloatingParticles } from "@/components/ui/floating-particles"
import { AnimatedButton } from "@/components/ui/animated-button"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientText } from "@/components/ui/gradient-text"
import { TodoCard } from "@/components/features/todos/TodoCard"
import { StatsCard } from "@/components/features/todos/StatsCard"
import { TodoDialog } from "@/components/features/todos/TodoDialog"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api"
import {
  requestPermissionWithUI,
  scheduleNotification,
  cancelScheduledNotification,
} from "@/lib/notifications"
import type { Todo, TodoPriority, TodoCategory, TodoFormData } from "@/types/todo"

/**
 * TodoDashboard Page
 *
 * Advanced todo management dashboard with 3D UI, filters, search, and statistics
 * Features: Full CRUD operations, API persistence, toast notifications
 */

// Get current ISO date string
const getCurrentDate = () => new Date().toISOString().split("T")[0]

export default function TodoDashboard() {
  const { toast } = useToast()

  // State
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPriority, setFilterPriority] = useState<TodoPriority | "all">("all")
  const [filterCategory, setFilterCategory] = useState<TodoCategory | "all">("all")
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "active">("all")

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create")
  const [editingTodo, setEditingTodo] = useState<Todo | undefined>()

  // Notification timeout IDs (todoId -> timeoutId)
  const notificationTimeouts = useRef<Map<string, number>>(new Map())

  // Load todos from API on mount
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const fetchedTodos = await apiClient.getTodos()
        setTodos(fetchedTodos)
      } catch (error) {
        console.error("Failed to load todos:", error)
        toast({
          title: "Error",
          description: "Failed to load todos from server",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadTodos()
  }, [toast])

  // Filter and search todos
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      const matchesSearch =
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        todo.description?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesPriority = filterPriority === "all" || todo.priority === filterPriority
      const matchesCategory = filterCategory === "all" || todo.category === filterCategory
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "completed" && todo.completed) ||
        (filterStatus === "active" && !todo.completed)

      return matchesSearch && matchesPriority && matchesCategory && matchesStatus
    })
  }, [todos, searchQuery, filterPriority, filterCategory, filterStatus])

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      total: todos.length,
      completed: todos.filter((t) => t.completed).length,
      pending: todos.filter((t) => !t.completed && t.status === "pending").length,
      inProgress: todos.filter((t) => t.status === "in-progress").length,
    }
  }, [todos])

  // Notification Management

  /**
   * Schedule a notification for a todo
   */
  const scheduleReminderForTodo = (todo: Todo) => {
    // Cancel existing notification if any
    const existingTimeoutId = notificationTimeouts.current.get(todo.id)
    if (existingTimeoutId) {
      cancelScheduledNotification(existingTimeoutId)
      notificationTimeouts.current.delete(todo.id)
    }

    // Only schedule if reminder is enabled and todo is not completed
    if (!todo.reminderEnabled || !todo.reminderTime || todo.completed) {
      return
    }

    // Schedule the notification
    const timeoutId = scheduleNotification(
      todo.reminderTime,
      todo.title,
      todo.description || "You have a task due soon!"
    )

    if (timeoutId !== null) {
      notificationTimeouts.current.set(todo.id, timeoutId)
    }
  }

  /**
   * Cancel a scheduled notification for a todo
   */
  const cancelReminderForTodo = (todoId: string) => {
    const timeoutId = notificationTimeouts.current.get(todoId)
    if (timeoutId) {
      cancelScheduledNotification(timeoutId)
      notificationTimeouts.current.delete(todoId)
    }
  }

  /**
   * Schedule notifications for all todos on mount
   */
  useEffect(() => {
    if (isLoading) return

    // Schedule reminders for all active todos
    todos.forEach((todo) => {
      if (todo.reminderEnabled && todo.reminderTime && !todo.completed) {
        scheduleReminderForTodo(todo)
      }
    })

    // Cleanup: cancel all notifications when component unmounts
    return () => {
      notificationTimeouts.current.forEach((timeoutId) => {
        cancelScheduledNotification(timeoutId)
      })
      notificationTimeouts.current.clear()
    }
  }, [isLoading]) // Only run once when loading completes

  // CRUD Operations

  /**
   * Create a new todo
   */
  const handleCreateTodo = async (formData: TodoFormData) => {
    try {
      // Request notification permission if reminder is enabled
      if (formData.reminderEnabled && formData.reminderTime) {
        const permissionGranted = await requestPermissionWithUI()
        if (!permissionGranted) {
          // User denied permission, disable reminder
          formData.reminderEnabled = false
          formData.reminderTime = ""
          toast({
            title: "Reminder Disabled",
            description: "Notification permission was denied. Task created without reminder.",
            variant: "destructive",
          })
        }
      }

      // Create todo via API
      const newTodo = await apiClient.createTodo(formData)

      // Update local state
      setTodos((prev) => [newTodo, ...prev])

      // Schedule notification if reminder is enabled
      if (newTodo.reminderEnabled && newTodo.reminderTime) {
        scheduleReminderForTodo(newTodo)
      }

      toast({
        title: "Success",
        description: formData.reminderEnabled
          ? "Task created with reminder notification"
          : "Task created successfully",
      })
    } catch (error) {
      console.error("Failed to create todo:", error)
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      })
    }
  }

  /**
   * Update an existing todo
   */
  const handleUpdateTodo = async (formData: TodoFormData) => {
    if (!editingTodo) return

    try {
      // Request notification permission if reminder is newly enabled
      if (formData.reminderEnabled && formData.reminderTime && !editingTodo.reminderEnabled) {
        const permissionGranted = await requestPermissionWithUI()
        if (!permissionGranted) {
          formData.reminderEnabled = false
          formData.reminderTime = ""
          toast({
            title: "Reminder Disabled",
            description: "Notification permission was denied. Task updated without reminder.",
            variant: "destructive",
          })
        }
      }

      // Update todo via API
      const updatedTodo = await apiClient.updateTodo(editingTodo.id, formData)

      // Update local state
      setTodos((prev) =>
        prev.map((todo) => (todo.id === editingTodo.id ? updatedTodo : todo))
      )

      // Re-schedule notification
      if (updatedTodo.reminderEnabled && updatedTodo.reminderTime) {
        scheduleReminderForTodo(updatedTodo)
      } else {
        // Cancel reminder if disabled
        cancelReminderForTodo(updatedTodo.id)
      }

      toast({
        title: "Success",
        description: formData.reminderEnabled
          ? "Task updated with reminder notification"
          : "Task updated successfully",
      })

      setEditingTodo(undefined)
    } catch (error) {
      console.error("Failed to update todo:", error)
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      })
    }
  }

  /**
   * Toggle todo completion status
   */
  const handleToggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id)
    if (!todo) return

    const willBeCompleted = !todo.completed

    try {
      // Update todo via API
      const updatedTodo = await apiClient.toggleTodoCompletion(id, willBeCompleted)

      // Update local state
      setTodos((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                completed: willBeCompleted,
                status: willBeCompleted ? "completed" : "pending",
                updatedAt: updatedTodo.updatedAt,
              }
            : t
        )
      )

      // Cancel reminder when completing a task, re-schedule when reopening
      if (willBeCompleted) {
        cancelReminderForTodo(id)
      } else if (todo.reminderEnabled && todo.reminderTime) {
        scheduleReminderForTodo({ ...todo, completed: false }) // Use original todo but with completed = false
      }

      toast({
        title: willBeCompleted ? "Task completed" : "Task reopened",
        description: willBeCompleted ? "Great job!" : "Keep going!",
      })
    } catch (error) {
      console.error("Failed to toggle todo:", error)
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive",
      })
    }
  }

  /**
   * Delete a todo
   */
  const handleDeleteTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id)

    if (confirm(`Are you sure you want to delete "${todo?.title}"?`)) {
      try {
        // Cancel any scheduled reminder
        cancelReminderForTodo(id)

        // Delete todo via API
        await apiClient.deleteTodo(id)

        // Update local state
        setTodos((prev) => prev.filter((todo) => todo.id !== id))

        toast({
          title: "Deleted",
          description: "Task deleted successfully",
          variant: "destructive",
        })
      } catch (error) {
        console.error("Failed to delete todo:", error)
        toast({
          title: "Error",
          description: "Failed to delete task. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  /**
   * Open edit dialog
   */
  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo)
    setDialogMode("edit")
    setDialogOpen(true)
  }

  /**
   * Open create dialog
   */
  const handleOpenCreateDialog = () => {
    setEditingTodo(undefined)
    setDialogMode("create")
    setDialogOpen(true)
  }

  /**
   * Handle dialog save
   */
  const handleDialogSave = (formData: TodoFormData) => {
    if (dialogMode === "create") {
      handleCreateTodo(formData)
    } else {
      handleUpdateTodo(formData)
    }
  }

  if (isLoading) {
    return (
      <>
        <AnimatedBackground />
        <div className="relative min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-white/80">Loading your tasks...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <AnimatedBackground />
      <FloatingParticles count={30} />

      <div className="relative min-h-screen p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <GradientText className="text-5xl mb-4">Your Tasks</GradientText>
            <p className="text-slate-600 dark:text-white/80 text-lg">Manage your todos with style and efficiency</p>
          </motion.div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard title="Total Tasks" value={stats.total} icon={TrendingUp} gradient="from-purple-500 to-pink-500" delay={0} />
            <StatsCard title="Completed" value={stats.completed} icon={CheckCircle} gradient="from-green-500 to-emerald-500" delay={0.1} />
            <StatsCard title="In Progress" value={stats.inProgress} icon={Clock} gradient="from-blue-500 to-cyan-500" delay={0.2} />
            <StatsCard title="Pending" value={stats.pending} icon={AlertCircle} gradient="from-yellow-500 to-orange-500" delay={0.3} />
          </div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <GlassCard className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 dark:text-white/40" />
                    <input
                      type="text"
                      placeholder="Search tasks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/80 dark:bg-white/10 border border-slate-300 dark:border-white/20 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-white/50 focus:border-purple-500 dark:focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-colors"
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="flex gap-3">
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value as TodoPriority | "all")}
                    className="px-4 py-3 rounded-xl bg-white/80 dark:bg-white/10 border border-slate-300 dark:border-white/20 text-slate-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-500/50 focus:outline-none transition-colors appearance-none"
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>

                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value as TodoCategory | "all")}
                    className="px-4 py-3 rounded-xl bg-white/80 dark:bg-white/10 border border-slate-300 dark:border-white/20 text-slate-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-500/50 focus:outline-none transition-colors appearance-none"
                  >
                    <option value="all">All Categories</option>
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="shopping">Shopping</option>
                    <option value="health">Health</option>
                    <option value="other">Other</option>
                  </select>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as "all" | "completed" | "active")}
                    className="px-4 py-3 rounded-xl bg-white/80 dark:bg-white/10 border border-slate-300 dark:border-white/20 text-slate-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-500/50 focus:outline-none transition-colors appearance-none"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {/* Add Button */}
                <AnimatedButton variant="primary" className="whitespace-nowrap" onClick={handleOpenCreateDialog}>
                  <Plus className="w-5 h-5 mr-2" />
                  Add Task
                </AnimatedButton>
              </div>
            </GlassCard>
          </motion.div>

          {/* Todo List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="space-y-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredTodos.length > 0 ? (
                filteredTodos.map((todo) => (
                  <TodoCard
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggleTodo}
                    onDelete={handleDeleteTodo}
                    onEdit={handleEditTodo}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <GlassCard className="p-12 text-center">
                    <p className="text-slate-600 dark:text-white/80 text-lg">
                      {searchQuery || filterPriority !== "all" || filterCategory !== "all" || filterStatus !== "all"
                        ? "No tasks match your filters"
                        : "No tasks yet. Create your first task!"}
                    </p>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Todo Dialog */}
      <TodoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleDialogSave}
        todo={editingTodo}
        mode={dialogMode}
      />
    </>
  )
}
