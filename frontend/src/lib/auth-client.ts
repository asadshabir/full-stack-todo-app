/**
 * Better Auth Client Configuration
 *
 * Configures Better Auth with JWT plugin for authentication
 * Stores tokens in HTTP-only cookies for security
 */

import { createAuthClient } from "better-auth/client"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  // Better Auth automatically handles JWT storage in HTTP-only cookies
  // No additional configuration needed for cookie management
})

// Export commonly used functions for convenience
export const { signUp, signIn, signOut, useSession } = authClient

/**
 * Get current session
 * @returns Promise<AuthSession | null>
 */
export async function getSession() {
  try {
    return await authClient.getSession()
  } catch (error) {
    console.error("Failed to get session:", error)
    return null
  }
}

/**
 * Check if user is authenticated
 * @returns Promise<boolean>
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  if (!session) return false
  // Check if session has data with user information
  if ('data' in session && session.data) {
    return !!(session.data as any).user
  }
  return false
}
