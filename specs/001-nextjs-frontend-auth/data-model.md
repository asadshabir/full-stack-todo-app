# Data Model: Professional-Grade Next.js Frontend with Modern UI/UX

**Feature**: `001-nextjs-frontend-auth`
**Date**: 2026-01-08
**Purpose**: Define TypeScript types and interfaces for frontend entities (User, Task, AuthSession)

---

## Overview

This document defines the TypeScript types used in the Next.js frontend application. These types correspond to entities managed by the FastAPI backend and must align with backend response schemas documented in `contracts/`.

**Key Principles**:
- Types are **client-side representations** of server data
- All dates/timestamps use **ISO 8601 strings** (not Date objects) for JSON serialization
- Optional fields marked with `?` to reflect API response optionality
- Types are **frontend-focused** (e.g., no database IDs unless exposed by API)

---

## Entity Definitions

### User

Represents an authenticated user account.

```typescript
// types/auth.ts

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
```

**Usage Context**:
- Returned by `/auth/signup` and `/auth/signin` endpoints
- Stored in Better Auth session
- Displayed in user profile (if implemented in future)

**Validation Rules**:
- `email`: Must be valid email format (validated by Zod schema)
- `id`: Non-empty string
- `createdAt`: Must be valid ISO 8601 timestamp

---

### Task

Represents a task item in the task management dashboard.

```typescript
// types/task.ts

export type TaskPriority = "high" | "medium" | "low"

export interface Task {
  /**
   * Unique identifier for the task (UUID or integer from backend)
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id: string

  /**
   * User ID who owns this task (enforced by backend)
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  userId: string

  /**
   * Task title (required, user-facing)
   * @example "Complete project proposal"
   */
  title: string

  /**
   * Optional detailed description of the task
   * @example "Write a 5-page proposal for the new client project including budget and timeline"
   */
  description?: string

  /**
   * Priority level affecting visual color-coding
   * - high: Red (urgent, critical)
   * - medium: Yellow (important, not urgent)
   * - low: Green (nice-to-have)
   * @default "medium"
   */
  priority: TaskPriority

  /**
   * Whether the task has been completed
   * @default false
   */
  completed: boolean

  /**
   * Timestamp when task was created (ISO 8601 format)
   * @example "2026-01-08T14:30:00Z"
   */
  createdAt: string

  /**
   * Timestamp of last task update (ISO 8601 format)
   * @example "2026-01-08T16:45:00Z"
   */
  updatedAt: string
}
```

**Usage Context**:
- Returned by `GET /tasks` (list all tasks)
- Returned by `GET /tasks/:id` (get single task)
- Sent to `POST /tasks` (create task)
- Sent to `PUT /tasks/:id` (update task)
- Displayed in TaskCard and TaskList components

**Validation Rules**:
- `title`: 1-200 characters, non-empty
- `description`: 0-1000 characters (optional)
- `priority`: Must be one of "high", "medium", "low"
- `completed`: Boolean only

**Priority Color Mapping**:
```typescript
export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  high: "bg-red-100 border-red-500 text-red-900",
  medium: "bg-yellow-100 border-yellow-500 text-yellow-900",
  low: "bg-green-100 border-green-500 text-green-900",
}
```

---

### CreateTaskInput

Request payload for creating a new task (excludes system-generated fields).

```typescript
// types/task.ts

export interface CreateTaskInput {
  /**
   * Task title (required)
   * @minLength 1
   * @maxLength 200
   */
  title: string

  /**
   * Optional task description
   * @maxLength 1000
   */
  description?: string

  /**
   * Priority level (defaults to "medium" if not provided)
   * @default "medium"
   */
  priority?: TaskPriority
}
```

**Usage Context**:
- Sent to `POST /tasks` endpoint
- Used in TaskForm component for task creation
- Validated by Zod schema before submission

---

### UpdateTaskInput

Request payload for updating an existing task (all fields optional).

```typescript
// types/task.ts

export interface UpdateTaskInput {
  /**
   * Updated task title
   * @minLength 1
   * @maxLength 200
   */
  title?: string

  /**
   * Updated task description
   * @maxLength 1000
   */
  description?: string

  /**
   * Updated priority level
   */
  priority?: TaskPriority

  /**
   * Updated completion status
   */
  completed?: boolean
}
```

**Usage Context**:
- Sent to `PUT /tasks/:id` or `PATCH /tasks/:id` endpoint
- Used in TaskForm component for task editing
- Used for toggling task completion status

---

### AuthSession

Represents the current authentication session state (managed by Better Auth).

```typescript
// types/auth.ts

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
```

**Usage Context**:
- Returned by Better Auth after successful sign-in/sign-up
- Stored in HTTP-only cookies (managed by Better Auth)
- Accessed via `useSession()` hook in client components
- Token extracted and sent in `Authorization: Bearer` header for API requests

**Security Notes**:
- `token` never stored in localStorage (XSS vulnerability)
- Cookies have `HttpOnly`, `Secure`, `SameSite=Strict` flags
- Frontend never parses JWT payload (backend handles verification)

---

### SignUpInput

Request payload for user registration.

```typescript
// types/auth.ts

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
   */
  confirmPassword: string

  /**
   * Optional user full name
   */
  name?: string
}
```

**Usage Context**:
- Sent to `/auth/signup` endpoint
- Validated by Zod schema in SignUpForm component
- `confirmPassword` not sent to backend (frontend-only validation)

---

### SignInInput

Request payload for user authentication.

```typescript
// types/auth.ts

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
```

**Usage Context**:
- Sent to `/auth/signin` endpoint
- Validated by Zod schema in SignInForm component

---

## API Response Types

### ApiResponse<T>

Generic wrapper for successful API responses.

```typescript
// types/api.ts

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
```

**Usage Example**:
```typescript
const response = await apiClient.get<ApiResponse<Task[]>>("/tasks")
const tasks: Task[] = response.data.data
```

---

### ApiError

Standardized error response structure.

```typescript
// types/api.ts

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
```

**Usage Context**:
- Returned by backend for all error responses
- Parsed in Axios response interceptor
- Displayed in toast notifications or form error messages

---

## Type Guards

Utility functions for runtime type checking.

```typescript
// types/guards.ts

export function isTask(value: unknown): value is Task {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "title" in value &&
    "priority" in value &&
    "completed" in value
  )
}

export function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === "object" &&
    value !== null &&
    "statusCode" in value &&
    "message" in value
  )
}
```

---

## Zod Validation Schemas

TypeScript types must have corresponding Zod schemas for runtime validation.

```typescript
// schemas/task.ts
import { z } from "zod"
import type { CreateTaskInput, UpdateTaskInput, TaskPriority } from "@/types/task"

export const taskPrioritySchema = z.enum(["high", "medium", "low"])

export const createTaskSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),

  description: z.string()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),

  priority: taskPrioritySchema.default("medium"),
})

export const updateTaskSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters")
    .optional(),

  description: z.string()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),

  priority: taskPrioritySchema.optional(),

  completed: z.boolean().optional(),
}).strict() // Reject unknown fields

// Infer types from schemas (ensures type/schema sync)
export type CreateTaskInputValidated = z.infer<typeof createTaskSchema>
export type UpdateTaskInputValidated = z.infer<typeof updateTaskSchema>
```

---

## Type Alignment with Backend

Frontend types must align with backend SQLModel schemas. Discrepancies require documentation.

| Frontend Type | Backend Model | Alignment Status | Notes |
|---------------|---------------|------------------|-------|
| `User` | `User` (SQLModel) | ✅ Aligned | - |
| `Task` | `Task` (SQLModel) | ✅ Aligned | Backend uses `user_id` (snake_case), frontend uses `userId` (camelCase) - handled by API serialization |
| `AuthSession` | JWT Payload | ✅ Aligned | Better Auth manages session structure |
| `CreateTaskInput` | `TaskCreate` (Pydantic) | ✅ Aligned | - |
| `UpdateTaskInput` | `TaskUpdate` (Pydantic) | ✅ Aligned | - |

**Transformation Notes**:
- Backend uses snake_case (`user_id`, `created_at`), frontend uses camelCase (`userId`, `createdAt`)
- API serialization layer handles case conversion automatically
- Date fields serialized as ISO 8601 strings (not Python `datetime` objects)

---

## Summary

**Total Types Defined**: 11
- Core Entities: 3 (User, Task, AuthSession)
- Input DTOs: 4 (CreateTaskInput, UpdateTaskInput, SignUpInput, SignInInput)
- API Wrappers: 2 (ApiResponse, ApiError)
- Utility Types: 2 (Type guards)

**Validation Coverage**: All input types have corresponding Zod schemas for runtime validation.

**Next Steps**:
1. Generate `contracts/auth-api.yaml` OpenAPI spec matching these types
2. Generate `contracts/tasks-api.yaml` OpenAPI spec matching these types
3. Generate `quickstart.md` with TypeScript usage examples
