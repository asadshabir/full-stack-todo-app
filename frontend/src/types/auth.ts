/**
 * Authentication Types
 *
 * Type definitions for user authentication, sessions, and auth forms
 */

/**
 * User entity representing an authenticated user account
 */
export interface User {
  /**
   * Unique identifier for the user (UUID or integer from backend)
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  id: string

  /**
   * User's email address (used for authentication)
   * @example "user@example.com"
   */
  email: string

  /**
   * User's full name (optional, may not be collected during signup)
   * @example "John Doe"
   */
  name?: string

  /**
   * Timestamp when user account was created (ISO 8601 format)
   * @example "2026-01-08T14:30:00Z"
   */
  createdAt: string

  /**
   * Timestamp of last account update (ISO 8601 format)
   * @example "2026-01-08T14:30:00Z"
   */
  updatedAt?: string
}

/**
 * Authentication session state (managed by Better Auth)
 */
export interface AuthSession {
  /**
   * Authenticated user information
   */
  user: User

  /**
   * JWT access token (used for API authorization)
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   */
  token: string

  /**
   * Timestamp when token expires (ISO 8601 format)
   * @example "2026-01-15T14:30:00Z"
   */
  expiresAt: string

  /**
   * Optional refresh token for renewing access token
   */
  refreshToken?: string
}

/**
 * Request payload for user registration
 */
export interface SignUpInput {
  /**
   * User's email address
   * Must be valid email format
   */
  email: string

  /**
   * User's password
   * Must meet strength requirements:
   * - At least 8 characters
   * - At least one uppercase letter
   * - At least one lowercase letter
   * - At least one number
   */
  password: string

  /**
   * Password confirmation (must match password)
   * Frontend-only validation field
   */
  confirmPassword: string

  /**
   * Optional user full name
   */
  name?: string
}

/**
 * Request payload for user authentication
 */
export interface SignInInput {
  /**
   * User's email address
   */
  email: string

  /**
   * User's password
   */
  password: string

  /**
   * Optional "Remember me" flag (extends token expiration)
   * @default false
   */
  rememberMe?: boolean
}

/**
 * Password strength levels
 */
export type PasswordStrength = "weak" | "fair" | "good" | "strong"

/**
 * Type guard to check if a value is a User
 */
export function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "email" in value &&
    "createdAt" in value
  )
}
