/**
 * API Client for Todo AI Chatbot
 *
 * Comprehensive API client supporting:
 * - Authentication (JWT via localStorage)
 * - Todo CRUD operations
 * - AI Chat functionality
 * - Conversations management
 */

import type { Todo, TodoFormData } from "@/types/todo"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// ==================== Types ====================

export interface User {
  id: string
  email: string
  name?: string
  createdAt?: string
  created_at?: string
}

export interface AuthResponse {
  user: User
  access_token: string
  message?: string
}

export interface Task {
  id: string
  title: string
  completed: boolean
  created_at: string
  completed_at: string | null
}

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  created_at: string
}

export interface Conversation {
  id: string
  created_at: string
  last_activity_at: string
}

export interface ChatResponse {
  response: string
  conversation_id: string
}

// ==================== API Client ====================

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl
  }

  /**
   * Get the auth token from localStorage
   */
  private getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("access_token")
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  /**
   * Make an authenticated API request
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const token = this.getToken()

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      const errorMessage =
        data?.error || data?.detail || `Request failed with status ${response.status}`
      throw new Error(errorMessage)
    }

    return data
  }

  // ==================== AUTH ====================

  /**
   * Sign up a new user
   */
  async signup(
    email: string,
    password: string,
    name?: string
  ): Promise<AuthResponse> {
    return this.request<AuthResponse>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    })
  }

  /**
   * Sign in an existing user
   */
  async signin(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  /**
   * Sign out the current user
   */
  async signout(): Promise<{ message: string }> {
    const result = await this.request<{ message: string }>("/api/auth/signout", {
      method: "POST",
    })
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token")
    }
    return result
  }

  /**
   * Get current user info
   */
  async getMe(): Promise<User> {
    return this.request<User>("/api/auth/me")
  }

  // ==================== TODOS ====================

  /**
   * Map backend Task to frontend Todo
   */
  private mapTaskToTodo(task: Task): Todo {
    return {
      id: task.id,
      title: task.title,
      completed: task.completed,
      status: task.completed ? "completed" : "pending",
      priority: "medium",
      category: "personal",
      createdAt: task.created_at,
      updatedAt: task.completed_at || task.created_at,
      userId: "",
    }
  }

  /**
   * Get all todos for the current user
   */
  async getTodos(filter: "all" | "pending" | "completed" = "all"): Promise<Todo[]> {
    const response = await this.request<{ tasks: Task[]; count: number }>(
      `/api/tasks?filter=${filter}`
    )
    return response.tasks.map((task) => this.mapTaskToTodo(task))
  }

  /**
   * Create a new todo
   */
  async createTodo(todoData: Partial<TodoFormData> & { title: string }): Promise<Todo> {
    const task = await this.request<Task>("/api/tasks", {
      method: "POST",
      body: JSON.stringify({ title: todoData.title }),
    })
    return {
      ...this.mapTaskToTodo(task),
      description: todoData.description,
      priority: todoData.priority || "medium",
      category: todoData.category || "personal",
      dueDate: todoData.dueDate,
      reminderTime: todoData.reminderTime,
      reminderEnabled: todoData.reminderEnabled,
    }
  }

  /**
   * Update an existing todo
   */
  async updateTodo(
    id: string,
    updates: Partial<TodoFormData> & { completed?: boolean }
  ): Promise<Todo> {
    const task = await this.request<Task>(`/api/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        title: updates.title,
        completed: updates.completed,
      }),
    })
    return {
      ...this.mapTaskToTodo(task),
      description: updates.description,
      priority: updates.priority || "medium",
      category: updates.category || "personal",
      dueDate: updates.dueDate,
      reminderTime: updates.reminderTime,
      reminderEnabled: updates.reminderEnabled,
    }
  }

  /**
   * Toggle todo completion status
   */
  async toggleTodoCompletion(id: string, completed: boolean): Promise<Todo> {
    const task = await this.request<Task>(`/api/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ completed }),
    })
    return this.mapTaskToTodo(task)
  }

  /**
   * Delete a todo
   */
  async deleteTodo(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/tasks/${id}`, {
      method: "DELETE",
    })
  }

  // ==================== CHAT ====================

  /**
   * Send a message to the AI chatbot
   */
  async sendMessage(
    message: string,
    conversationId?: string
  ): Promise<ChatResponse> {
    return this.request<ChatResponse>("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        message,
        conversation_id: conversationId,
      }),
    })
  }

  // ==================== CONVERSATIONS ====================

  /**
   * Get all conversations for the current user
   */
  async getConversations(limit: number = 20): Promise<Conversation[]> {
    const response = await this.request<{
      conversations: Conversation[]
      count: number
    }>(`/api/conversations?limit=${limit}`)
    return response.conversations
  }

  /**
   * Get messages for a specific conversation
   */
  async getConversationMessages(
    conversationId: string,
    limit: number = 100
  ): Promise<Message[]> {
    const response = await this.request<{ messages: Message[]; count: number }>(
      `/api/conversations/${conversationId}/messages?limit=${limit}`
    )
    return response.messages
  }

  // ==================== HEALTH ====================

  /**
   * Check API health status
   */
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>("/api/health")
  }
}

// Create singleton instance
export const apiClient = new ApiClient(API_BASE_URL)

// For backward compatibility
export const api = apiClient
