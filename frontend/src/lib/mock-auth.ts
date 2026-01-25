"use client"

/**
 * Mock Authentication System
 *
 * Temporary authentication implementation that works without a backend
 * Stores session in localStorage AND cookies for middleware compatibility
 */

interface User {
  id: string
  email: string
  name?: string
  createdAt: string
}

interface Session {
  user: User
  token: string
  expiresAt: string
}

const STORAGE_KEY = "mock_auth_session"
const COOKIE_NAME = "better-auth.session_token"

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Helper function to set cookie
function setCookie(name: string, value: string, days: number) {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
}

// Helper function to delete cookie
function deleteCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`
}

export const mockAuth = {
  /**
   * Sign up a new user
   */
  signUp: {
    email: async ({ email, password, name }: { email: string; password: string; name?: string }) => {
      await delay(800) // Simulate API call

      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem("mock_users") || "[]")
      if (existingUsers.find((u: any) => u.email === email)) {
        return {
          error: { message: "User already exists with this email" },
          data: null,
        }
      }

      // Create new user
      const user: User = {
        id: Math.random().toString(36).substring(7),
        email,
        name,
        createdAt: new Date().toISOString(),
      }

      // Save user
      existingUsers.push({ ...user, password })
      localStorage.setItem("mock_users", JSON.stringify(existingUsers))

      // Create session
      const token = Math.random().toString(36).substring(2)
      const session: Session = {
        user,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      }

      // Store in localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session))

      // Store token in cookie for middleware
      setCookie(COOKIE_NAME, token, 7)

      return {
        data: session,
        error: null,
      }
    },
  },

  /**
   * Sign in an existing user
   */
  signIn: {
    email: async ({ email, password }: { email: string; password: string; rememberMe?: boolean }) => {
      await delay(800) // Simulate API call

      // Find user
      const existingUsers = JSON.parse(localStorage.getItem("mock_users") || "[]")
      const user = existingUsers.find((u: any) => u.email === email && u.password === password)

      if (!user) {
        return {
          error: { message: "Invalid email or password" },
          data: null,
        }
      }

      // Create session
      const token = Math.random().toString(36).substring(2)
      const session: Session = {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
        },
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      }

      // Store in localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session))

      // Store token in cookie for middleware
      setCookie(COOKIE_NAME, token, 7)

      return {
        data: session,
        error: null,
      }
    },
  },

  /**
   * Sign out current user
   */
  signOut: async () => {
    await delay(300) // Simulate API call

    // Clear localStorage
    localStorage.removeItem(STORAGE_KEY)

    // Clear cookie
    deleteCookie(COOKIE_NAME)

    return { data: null, error: null }
  },

  /**
   * Get current session
   */
  getSession: async () => {
    await delay(200) // Simulate API call
    const session = localStorage.getItem(STORAGE_KEY)

    if (!session) {
      return { data: null, error: null }
    }

    try {
      const parsed: Session = JSON.parse(session)

      // Check if session is expired
      if (new Date(parsed.expiresAt) < new Date()) {
        localStorage.removeItem(STORAGE_KEY)
        deleteCookie(COOKIE_NAME)
        return { data: null, error: null }
      }

      return { data: parsed, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },
}
