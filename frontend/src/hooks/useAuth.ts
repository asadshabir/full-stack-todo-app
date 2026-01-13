"use client"

/**
 * useAuth Hook
 *
 * Custom hook for authentication operations
 * Currently using mock authentication - will connect to Better Auth when backend is ready
 */

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api"
import { clearQueries } from "@/lib/query-client"
import { useToast } from "@/hooks/use-toast"
import type { SignUpInput, SignInInput } from "@/types/auth"

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

export function useAuth() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [session, setSession] = useState<Session | null>(null)
  const [isSessionLoading, setIsSessionLoading] = useState(true)

  /**
   * Load session on mount
   */
  useEffect(() => {
    const loadSession = async () => {
      try {
        if (apiClient.isAuthenticated()) {
          const userData = await apiClient.getMe()
          // Create a session object from the user data
          const sessionData: Session = {
            user: {
              id: userData.id,
              email: userData.email,
              name: userData.name,
              createdAt: userData.created_at,
            },
            token: localStorage.getItem('access_token') || '',
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
          }
          setSession(sessionData)
        }
      } catch (error) {
        // 401 errors are expected when not logged in or token expired
        // Only log non-401 errors to avoid confusion
        if (error instanceof Error && !error.message.includes('401')) {
          console.error("Failed to load session:", error)
        }
        // Clear any invalid or expired token
        localStorage.removeItem('access_token')
      } finally {
        setIsSessionLoading(false)
      }
    }

    loadSession()
  }, [])

  /**
   * Sign up a new user
   * @param input - User registration data
   */
  const signUp = async (input: SignUpInput) => {
    setIsLoading(true)
    try {
      // Remove confirmPassword before sending
      const { confirmPassword, ...signUpData } = input

      const result = await apiClient.signup(signUpData.email, signUpData.password, signUpData.name)

      if (result) {
        // Store the token in localStorage
        localStorage.setItem('access_token', result.access_token)

        // Create a session object from the user data
        const sessionData: Session = {
          user: {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            createdAt: result.user.created_at,
          },
          token: result.access_token,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
        }

        setSession(sessionData)

        toast({
          title: "Account created successfully!",
          description: "Welcome! Redirecting to dashboard...",
        })

        // Small delay for better UX
        setTimeout(() => {
          router.push("/dashboard")
        }, 500)

        return { success: true, data: sessionData }
      }

      return { success: false, error: new Error("Sign up failed") }
    } catch (error) {
      console.error("Sign up error:", error)
      toast({
        title: "Sign up failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
      return { success: false, error }
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Sign in an existing user
   * @param input - User credentials
   */
  const signIn = async (input: SignInInput) => {
    setIsLoading(true)
    try {
      const result = await apiClient.signin(input.email, input.password)

      if (result) {
        // Store the token in localStorage
        localStorage.setItem('access_token', result.access_token)

        // Create a session object from the user data
        const sessionData: Session = {
          user: {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            createdAt: result.user.created_at,
          },
          token: result.access_token,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
        }

        setSession(sessionData)

        toast({
          title: "Signed in successfully!",
          description: "Welcome back! Redirecting to dashboard...",
        })

        // Small delay for better UX
        setTimeout(() => {
          router.push("/dashboard")
        }, 500)

        return { success: true, data: sessionData }
      }

      return { success: false, error: new Error("Sign in failed") }
    } catch (error) {
      console.error("Sign in error:", error)
      toast({
        title: "Sign in failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
      return { success: false, error }
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Sign out the current user
   */
  const signOut = async () => {
    setIsLoading(true)
    try {
      // Call the API to sign out (though with JWT it's mainly client-side)
      await apiClient.signout()

      // Clear session
      setSession(null)

      // Clear all cached queries
      clearQueries()

      // Clear the access token from localStorage
      localStorage.removeItem('access_token')

      toast({
        title: "Signed out successfully",
        description: "You have been logged out.",
      })

      // Redirect to sign-in page
      router.push("/signin")
      return { success: true }
    } catch (error) {
      console.error("Sign out error:", error)
      toast({
        title: "Sign out failed",
        description: "An error occurred while signing out.",
        variant: "destructive",
      })
      return { success: false, error }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    signUp,
    signIn,
    signOut,
    isLoading: isLoading || isSessionLoading,
    session,
    user: session?.user ?? null,
    isAuthenticated: !!session?.user,
  }
}
