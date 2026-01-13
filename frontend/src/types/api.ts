/**
 * Generic wrapper for successful API responses
 */
export interface ApiResponse<T> {
  /**
   * Response data (typed generically)
   */
  data: T

  /**
   * Optional success message
   * @example "Task created successfully"
   */
  message?: string

  /**
   * Timestamp of response (ISO 8601 format)
   * @example "2026-01-08T14:30:00Z"
   */
  timestamp?: string
}

/**
 * Standardized error response structure
 */
export interface ApiError {
  /**
   * HTTP status code
   * @example 400, 401, 403, 500
   */
  statusCode: number

  /**
   * Error message (user-friendly)
   * @example "Invalid credentials"
   */
  message: string

  /**
   * Machine-readable error code
   * @example "AUTH_INVALID_CREDENTIALS"
   */
  code?: string

  /**
   * Detailed validation errors (for 400 Bad Request)
   * Key = field name, Value = array of error messages
   * @example { "email": ["Invalid email format"], "password": ["Password too short"] }
   */
  details?: Record<string, string[]>

  /**
   * Timestamp when error occurred (ISO 8601 format)
   */
  timestamp?: string
}

/**
 * Type guard to check if a value is an ApiError
 */
export function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === "object" &&
    value !== null &&
    "statusCode" in value &&
    "message" in value
  )
}
