/**
 * Authentication Validation Schemas
 *
 * Zod schemas for validating authentication form inputs with real-time feedback
 */

import { z } from "zod"

/**
 * Email validation schema (reusable)
 */
const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address")

/**
 * Password validation schema with strength requirements
 */
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")

/**
 * Sign-up validation schema
 * Validates email, password strength, password confirmation, and optional name
 */
export const signUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    name: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

/**
 * Sign-in validation schema
 * Validates email and password (less strict than sign-up)
 */
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional().default(false),
})

/**
 * Infer TypeScript types from schemas
 */
export type SignUpFormData = z.infer<typeof signUpSchema>
export type SignInFormData = z.infer<typeof signInSchema>

/**
 * Calculate password strength based on validation rules
 * @param password - Password string to evaluate
 * @returns Strength level: "weak" | "fair" | "good" | "strong"
 */
export function calculatePasswordStrength(
  password: string
): "weak" | "fair" | "good" | "strong" {
  if (password.length === 0) return "weak"

  let strength = 0

  // Length check
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++

  // Character variety checks
  if (/[A-Z]/.test(password)) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++ // Special characters

  // Map strength score to label
  if (strength <= 2) return "weak"
  if (strength <= 4) return "fair"
  if (strength <= 5) return "good"
  return "strong"
}
