/**
 * API Client with Axios
 *
 * Configured with:
 * - Automatic JWT token attachment (Authorization header)
 * - Error handling for 401, 403, and network errors
 * - Retry logic for transient failures
 */

import axios, { AxiosError } from "axios"
import axiosRetry from "axios-retry"
import { authClient } from "./auth-client"

// Create Axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
})

// Configure retry logic
axiosRetry(apiClient, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error: AxiosError) => {
    // Retry on network errors or 5xx server errors
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || (error.response?.status ?? 0) >= 500
  },
})

// Request interceptor: Attach JWT token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const session = await authClient.getSession()
      // Better Auth session structure: check if session exists and has data
      if (session && 'data' in session && session.data) {
        // Extract token from session - adjust based on actual Better Auth response
        const token = (session.data as any).token || (session as any).accessToken
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
    } catch (error) {
      console.error("Failed to get session for API request:", error)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor: Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status

      if (status === 401) {
        // Token expired or invalid - sign out and redirect
        try {
          await authClient.signOut()
          if (typeof window !== "undefined") {
            window.location.href = "/signin"
          }
        } catch (signOutError) {
          console.error("Failed to sign out:", signOutError)
        }
      } else if (status === 403) {
        // Forbidden - user doesn't have permission
        console.error("Access forbidden:", error.response.data)
      }
    } else if (error.request) {
      // Network error - no response received
      console.error("Network error:", error.message)
    }

    return Promise.reject(error)
  }
)

export default apiClient
