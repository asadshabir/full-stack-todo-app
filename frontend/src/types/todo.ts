/**
 * Todo Types
 *
 * TypeScript interfaces for todo items and related data
 */

export type TodoPriority = "low" | "medium" | "high"
export type TodoStatus = "pending" | "in-progress" | "completed"
export type TodoCategory = "personal" | "work" | "shopping" | "health" | "other"

export interface Todo {
  id: string
  title: string
  description?: string
  priority: TodoPriority
  status: TodoStatus
  category: TodoCategory
  dueDate?: string
  completed: boolean
  createdAt: string
  updatedAt: string
  userId: string
  reminderTime?: string // ISO string of when to show notification reminder
  reminderEnabled?: boolean // Whether the reminder is active
}

export interface TodoFormData {
  title: string
  description?: string
  priority: TodoPriority
  category: TodoCategory
  dueDate?: string
  reminderTime?: string
  reminderEnabled?: boolean
}

export interface TodoStats {
  total: number
  completed: number
  pending: number
  inProgress: number
  high: number
  medium: number
  low: number
}
