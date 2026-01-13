# Research: Professional-Grade Next.js Frontend with Modern UI/UX

**Feature**: `001-nextjs-frontend-auth`
**Date**: 2026-01-08
**Purpose**: Resolve technical unknowns and document architectural decisions for Better Auth, Shadcn UI, TanStack Query, and Framer Motion integration

---

## RT-001: Better Auth JWT Integration with Next.js 15 App Router

### Decision

Use **Better Auth with JWT plugin** configured in `lib/auth-client.ts`, storing tokens in **HTTP-only cookies** for optimal security, with client-side wrapper for authentication state management.

### Rationale

**Why Better Auth**:
- Native JWT plugin support with automatic token generation/verification
- Built-in session management compatible with Next.js App Router
- TypeScript-first design with excellent type inference
- Handles token refresh automatically

**Why HTTP-only Cookies over localStorage**:
- Immune to XSS attacks (JavaScript cannot access HTTP-only cookies)
- Automatically sent with requests (no manual header management)
- Secure flag ensures HTTPS-only transmission
- Better Auth's default and recommended approach

**App Router Integration Pattern**:
- Server Components: Use cookies() helper to read auth state server-side
- Client Components: Use Better Auth's useSession() hook for reactive auth state
- Middleware: Protect routes at edge before page render

### Implementation Pattern

```typescript
// lib/auth-client.ts
import { createAuthClient } from "better-auth/client"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  plugins: [jwtPlugin()],
  // Tokens stored in HTTP-only cookies automatically
})

export const { signUp, signIn, signOut, useSession } = authClient
```

**Key Configuration**:
- `baseURL`: Points to FastAPI backend (e.g., http://localhost:8000)
- JWT tokens include `user_id`, `email`, `exp` (expiration) claims
- Token expiration: 7 days (configurable)
- Refresh token: Automatic renewal 1 day before expiration

### Alternatives Considered

| Alternative | Why Rejected |
|-------------|--------------|
| NextAuth.js | Heavyweight solution with database requirements; Better Auth is lighter and JWT-focused |
| Custom JWT implementation (jose library) | Reinvents the wheel; Better Auth provides battle-tested implementation with fewer security pitfalls |
| localStorage for tokens | Vulnerable to XSS; HTTP-only cookies are more secure |

### References

- Better Auth Docs: https://better-auth.com/docs/integrations/nextjs
- JWT Plugin: https://better-auth.com/docs/plugins/jwt

---

## RT-002: Shadcn UI Component Installation and Customization

### Decision

Install Shadcn UI components via CLI, customize Tailwind theme for **Apple/Linear aesthetic** with neutral grayscale palette, subtle shadows, and clean typography (Inter font).

### Rationale

**Why Shadcn UI**:
- Copy-paste component architecture (full control, no npm dependency bloat)
- Radix UI primitives underneath (accessible, keyboard navigable)
- Tailwind CSS native (consistent with project constraints)
- Easy customization for brand-specific aesthetics

**Apple/Linear Aesthetic Principles**:
- **Colors**: Neutral grayscale with accent colors for priority (red, yellow, green)
- **Shadows**: Subtle, multi-layer shadows for depth (not heavy drop shadows)
- **Typography**: Inter font (clean, readable, professional)
- **Spacing**: Generous padding, comfortable touch targets (44px minimum)
- **Borders**: Minimal borders; use subtle background differences instead

### Component Installation List

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add form
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add select
npx shadcn-ui@latest add checkbox
```

### Tailwind Theme Customization

```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        // Apple-inspired neutral palette
        background: "hsl(0, 0%, 100%)",
        foreground: "hsl(0, 0%, 3.9%)",
        muted: "hsl(0, 0%, 96.1%)",
        'muted-foreground': "hsl(0, 0%, 45.1%)",

        // Priority color coding
        priority: {
          high: "hsl(0, 84.2%, 60.2%)",     // Red
          medium: "hsl(47.9, 95.8%, 53.1%)", // Yellow
          low: "hsl(142.1, 70.6%, 45.3%)",  // Green
        },

        // Accent for primary actions
        primary: "hsl(222.2, 47.4%, 11.2%)", // Dark blue-gray
        'primary-foreground': "hsl(210, 40%, 98%)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        // Subtle multi-layer shadows
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        card: "0 2px 8px 0 rgb(0 0 0 / 0.08), 0 0 0 1px rgb(0 0 0 / 0.02)", // Card-specific shadow
      },
      borderRadius: {
        lg: "12px", // Smooth, modern corners
        md: "8px",
        sm: "4px",
      },
    },
  },
}
```

### Alternatives Considered

| Alternative | Why Rejected |
|-------------|--------------|
| Material UI (MUI) | Too opinionated design system; harder to customize for Apple aesthetic |
| Chakra UI | Heavier bundle size; Shadcn's copy-paste approach gives more control |
| Ant Design | Enterprise-focused; not suited for consumer-grade minimalist UI |
| Custom components from scratch | Time-consuming; Shadcn provides accessibility out-of-box |

### References

- Shadcn UI Docs: https://ui.shadcn.com/docs
- Apple HIG: https://developer.apple.com/design/human-interface-guidelines/
- Linear Design System: https://linear.app/design

---

## RT-003: TanStack Query Setup and Caching Strategy

### Decision

Configure TanStack Query v5 with **5-minute stale time**, **10-minute cache time**, and **optimistic updates** for all task mutations to achieve < 100ms perceived feedback.

### Rationale

**Why TanStack Query**:
- Industry-standard for server-state management in React
- Built-in caching, background refetching, and optimistic updates
- Excellent DevTools for debugging cache state
- No Redux/Zustand needed (server state separate from client state)

**Caching Strategy**:
- **staleTime: 5 minutes**: Tasks are relatively stable; refetch after 5 min
- **cacheTime: 10 minutes**: Keep data in cache for fast navigation
- **refetchOnWindowFocus: true**: Always show fresh data when user returns to tab
- **retry: 3**: Retry failed requests 3 times before showing error

**Optimistic Update Pattern**:
1. User clicks "Create Task"
2. Immediately add task to cache with temporary ID
3. Show task card with loading indicator
4. Send API request in background
5. On success: Replace temporary ID with real ID from server
6. On failure: Revert optimistic change, show error toast

### Implementation Pattern

```typescript
// lib/query-client.ts
import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: true,
      retry: 3,
    },
    mutations: {
      retry: 1, // Retry mutations once
    },
  },
})
```

```typescript
// hooks/useTasks.ts
export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (newTask) => apiClient.post("/tasks", newTask),

    // Optimistic update
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] })
      const previousTasks = queryClient.getQueryData(["tasks"])

      // Add optimistic task
      queryClient.setQueryData(["tasks"], (old) => [
        ...old,
        { ...newTask, id: "temp-" + Date.now() }
      ])

      return { previousTasks } // Context for rollback
    },

    // Rollback on error
    onError: (err, newTask, context) => {
      queryClient.setQueryData(["tasks"], context.previousTasks)
      toast.error("Failed to create task")
    },

    // Refetch on success
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      toast.success("Task created")
    },
  })
}
```

### Cache Invalidation Rules

| Mutation | Invalidated Query Keys |
|----------|------------------------|
| Create Task | `["tasks"]` |
| Update Task | `["tasks"]`, `["task", taskId]` |
| Delete Task | `["tasks"]` |
| Sign Out | Clear all queries (queryClient.clear()) |

### Alternatives Considered

| Alternative | Why Rejected |
|-------------|--------------|
| SWR | Less feature-rich than TanStack Query; weaker TypeScript support |
| Apollo Client | GraphQL-focused; overkill for REST APIs |
| Redux Toolkit Query | Couples server state with Redux store; TanStack Query is lighter |
| Native fetch with useState | No caching, no optimistic updates, no background refetching |

### References

- TanStack Query Docs: https://tanstack.com/query/v5/docs
- Optimistic Updates Guide: https://tanstack.com/query/v5/docs/guides/optimistic-updates

---

## RT-004: Framer Motion Animation Patterns for Professional UI

### Decision

Use **Framer Motion layout animations** with `layout` prop, **GPU-accelerated transforms**, and **spring physics** for buttery-smooth 60 FPS animations.

### Rationale

**Why Framer Motion**:
- Declarative animation API (no manual requestAnimationFrame)
- Automatic layout animations (no FLIP calculations needed)
- Spring physics for natural motion
- Gesture support (drag, hover, tap)
- Excellent performance with GPU acceleration

**Performance Best Practices**:
- Animate `transform` and `opacity` only (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left` (triggers layout reflow)
- Use `will-change: transform` for elements that will animate
- Limit concurrent animations to < 10 on screen

**Animation Patterns**:

1. **Task Card Entry** (slide + fade):
   ```jsx
   <motion.div
     initial={{ opacity: 0, y: 20 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.3, ease: "easeOut" }}
   >
   ```

2. **Task Card Hover** (scale + shadow):
   ```jsx
   <motion.div
     whileHover={{ scale: 1.02, boxShadow: "0 8px 16px rgba(0,0,0,0.1)" }}
     transition={{ duration: 0.2 }}
   >
   ```

3. **Task Card Exit** (slide + fade out):
   ```jsx
   <motion.div
     exit={{ opacity: 0, x: -100 }}
     transition={{ duration: 0.3, ease: "easeIn" }}
   >
   ```

4. **List Reordering** (automatic with layout prop):
   ```jsx
   <motion.div layout transition={{ duration: 0.3, ease: "easeInOut" }}>
   ```

5. **Loading Skeleton** (pulse animation):
   ```jsx
   <motion.div
     animate={{ opacity: [0.5, 1, 0.5] }}
     transition={{ duration: 1.5, repeat: Infinity }}
   >
   ```

### Performance Optimization

- **Lazy load Framer Motion** on client components only (not Server Components)
- Use `LayoutGroup` for coordinated animations across multiple components
- Implement `prefers-reduced-motion` media query for accessibility
- Limit animation duration to 300-500ms (longer feels sluggish)

### Alternatives Considered

| Alternative | Why Rejected |
|-------------|--------------|
| React Spring | Steeper learning curve; Framer Motion has simpler API |
| CSS animations/transitions | Less flexible for complex gestures and layout animations |
| GSAP | Imperative API (not React-friendly); larger bundle size |
| Vanilla Web Animations API | Too low-level; Framer Motion provides better abstractions |

### References

- Framer Motion Docs: https://www.framer.com/motion/
- Animation Performance: https://web.dev/animations-guide/

---

## RT-005: API Client Architecture with Automatic JWT Injection

### Decision

Use **Axios with request/response interceptors** for automatic JWT attachment, centralized error handling, and retry logic.

### Rationale

**Why Axios over Fetch**:
- Built-in interceptor support (fetch requires manual wrappers)
- Automatic JSON parsing
- Better error handling (HTTP errors throw, fetch doesn't)
- Request/response transformation out-of-box
- Timeout support
- Wider browser compatibility (though less relevant with modern browsers)

**Interceptor Pattern**:

**Request Interceptor** (JWT injection):
```typescript
axios.interceptors.request.use(
  async (config) => {
    const session = await authClient.getSession()
    if (session?.token) {
      config.headers.Authorization = `Bearer ${session.token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)
```

**Response Interceptor** (error handling):
```typescript
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await authClient.signOut()
      router.push("/signin")
    } else if (error.response?.status === 403) {
      // Forbidden (user_id mismatch)
      toast.error("You don't have permission to access this resource")
    } else if (!error.response) {
      // Network error
      toast.error("Network error. Please check your connection.")
    }
    return Promise.reject(error)
  }
)
```

**Retry Logic**:
- Use `axios-retry` library for automatic retries
- Retry on 5xx errors and network failures
- Max 3 retries with exponential backoff

### Implementation Pattern

```typescript
// lib/api-client.ts
import axios from "axios"
import axiosRetry from "axios-retry"
import { authClient } from "./auth-client"

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
})

// Retry configuration
axiosRetry(apiClient, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
           error.response?.status >= 500
  },
})

// Add interceptors (code above)

export default apiClient
```

### TypeScript Type Safety

```typescript
// types/api.ts
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  message: string
  code: string
  details?: Record<string, string[]>
}

// Usage
const response = await apiClient.get<ApiResponse<Task[]>>("/tasks")
const tasks = response.data.data // Fully typed
```

### Alternatives Considered

| Alternative | Why Rejected |
|-------------|--------------|
| Native Fetch API | Requires custom interceptor implementation; no built-in retry logic |
| ky (Fetch-based) | Smaller bundle, but less mature than Axios; fewer plugins |
| tRPC | Requires TypeScript on backend; FastAPI uses Python (no type sharing) |

### References

- Axios Docs: https://axios-http.com/docs/interceptors
- axios-retry: https://github.com/softonic/axios-retry

---

## RT-006: Next.js 15 App Router Performance Optimization

### Decision

Use **Server Components by default**, **dynamic imports for client-heavy libraries**, **Suspense boundaries for async data**, and **next/image for all images** to achieve < 1 second initial page load.

### Rationale

**Server Component vs Client Component Trade-offs**:

| Component Type | Use When | Performance Benefit |
|----------------|----------|---------------------|
| Server Component | Static content, layouts, data fetching | Zero JavaScript sent to client; faster initial load |
| Client Component | Interactive UI (forms, animations), browser APIs | Necessary for interactivity; use sparingly |

**Performance Patterns**:

1. **Server Components** (default):
   ```tsx
   // app/dashboard/page.tsx (Server Component by default)
   export default async function DashboardPage() {
     // Fetch data server-side
     const tasks = await getTasks()
     return <TaskList tasks={tasks} />
   }
   ```

2. **Client Components** (explicit):
   ```tsx
   // components/features/tasks/TaskCard.tsx
   "use client" // Marks as Client Component

   import { motion } from "framer-motion"
   export function TaskCard() { /* interactive UI */ }
   ```

3. **Dynamic Imports** (lazy loading):
   ```tsx
   const FramerMotionDialog = dynamic(
     () => import("./FramerMotionDialog"),
     { ssr: false } // Don't server-render (Framer Motion is client-only)
   )
   ```

4. **Suspense Boundaries**:
   ```tsx
   <Suspense fallback={<TaskListSkeleton />}>
     <TaskList /> {/* Streams in when data ready */}
   </Suspense>
   ```

5. **Image Optimization**:
   ```tsx
   import Image from "next/image"

   <Image
     src="/empty-state.svg"
     alt="No tasks"
     width={400}
     height={300}
     priority // Load above-the-fold images eagerly
   />
   ```

### Code Splitting Strategy

| Library | Loading Strategy | Rationale |
|---------|------------------|-----------|
| Framer Motion | Dynamic import with `ssr: false` | Heavy animation library; not needed for initial render |
| Shadcn Dialog | Dynamic import | Only needed when user opens dialog |
| React Hook Form | Static import | Small size; needed frequently |
| TanStack Query | Static import | Core functionality; needed on every page |

### Bundle Size Budget

- **Initial JavaScript**: < 150 KB gzipped
- **First Contentful Paint (FCP)**: < 1.0 second
- **Largest Contentful Paint (LCP)**: < 1.5 seconds
- **Total Blocking Time (TBT)**: < 200ms

### Alternatives Considered

| Alternative | Why Rejected |
|-------------|--------------|
| Pages Router | Deprecated in favor of App Router; worse performance |
| No code splitting | Initial bundle too large (> 500 KB) |
| Aggressive code splitting (every component) | Too many HTTP requests; worse performance |

### References

- Next.js App Router: https://nextjs.org/docs/app
- Server Components: https://nextjs.org/docs/app/building-your-application/rendering/server-components
- Image Optimization: https://nextjs.org/docs/app/building-your-application/optimizing/images

---

## RT-007: Form Validation with React Hook Form and Zod

### Decision

Use **React Hook Form with Zod resolver** for declarative validation schemas, **mode: "onChange"** for real-time feedback, and **custom PasswordStrength component** for visual indicators.

### Rationale

**Why React Hook Form**:
- Minimal re-renders (uncontrolled inputs by default)
- Built-in validation with Zod integration
- Excellent TypeScript support
- Small bundle size (< 10 KB gzipped)

**Why Zod**:
- TypeScript-first schema validation
- Better error messages than Yup
- Runtime type safety (infer types from schemas)
- Composable schemas (reuse email/password schemas)

**Real-Time Validation Pattern**:

```typescript
// schemas/auth.ts
import { z } from "zod"

export const signUpSchema = z.object({
  email: z.string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),

  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),

  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type SignUpFormData = z.infer<typeof signUpSchema>
```

```tsx
// components/features/auth/SignUpForm.tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

export function SignUpForm() {
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange", // Validate on every change
  })

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} type="email" />
            </FormControl>
            <FormMessage /> {/* Shows error in real-time */}
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input {...field} type="password" />
            </FormControl>
            <PasswordStrength password={field.value} />
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  )
}
```

### Password Strength Indicator

```tsx
// components/features/auth/PasswordStrength.tsx
export function PasswordStrength({ password }: { password: string }) {
  const strength = calculateStrength(password) // 0-4
  const colors = ["bg-gray-300", "bg-red-500", "bg-yellow-500", "bg-green-500"]

  return (
    <div className="flex gap-1 mt-2">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded ${i <= strength ? colors[strength] : "bg-gray-200"}`}
        />
      ))}
    </div>
  )
}
```

### Accessibility Considerations

- Use `aria-invalid` on fields with errors
- Use `aria-describedby` to link errors to inputs
- Announce errors to screen readers
- Provide clear, actionable error messages

### Alternatives Considered

| Alternative | Why Rejected |
|-------------|--------------|
| Formik | Heavier bundle size; causes more re-renders |
| Native HTML5 validation | Not flexible enough; poor UX |
| Yup validation | Zod has better TypeScript integration |
| Manual validation with useState | Error-prone; reinvents the wheel |

### References

- React Hook Form: https://react-hook-form.com/
- Zod: https://zod.dev/
- Shadcn Form: https://ui.shadcn.com/docs/components/form

---

## Architectural Decisions Summary

| Decision ID | Topic | Decision | Status |
|-------------|-------|----------|--------|
| **AD-001** | Token Storage | HTTP-only cookies via Better Auth | ✅ Finalized |
| **AD-002** | HTTP Client | Axios with interceptors and axios-retry | ✅ Finalized |
| **AD-003** | Animation Strategy | Framer Motion with layout animations and spring physics | ✅ Finalized |
| **AD-004** | Component Composition | Shadcn UI with Apple/Linear theme customization | ✅ Finalized |
| **AD-005** | Performance Boundaries | Server Components default + dynamic imports for client-heavy libraries | ✅ Finalized |
| **AD-006** | Form Validation | React Hook Form + Zod with onChange mode | ✅ Finalized |
| **AD-007** | State Management | TanStack Query for server state (no Redux/Zustand) | ✅ Finalized |

---

## Implementation Readiness Checklist

- [x] Better Auth integration pattern documented
- [x] Shadcn UI components list finalized
- [x] Tailwind theme customization defined
- [x] TanStack Query caching strategy decided
- [x] Framer Motion animation patterns documented
- [x] API client architecture with interceptors designed
- [x] Next.js performance optimization strategy outlined
- [x] Form validation approach (React Hook Form + Zod) finalized

**Status**: ✅ All research tasks complete; ready for Phase 1 (design artifacts)

---

## Next Steps

1. Generate `data-model.md` with TypeScript types for User, Task, AuthSession
2. Generate `contracts/auth-api.yaml` OpenAPI spec for authentication endpoints
3. Generate `contracts/tasks-api.yaml` OpenAPI spec for task CRUD endpoints
4. Generate `quickstart.md` developer setup guide
5. Proceed to `/sp.tasks` to generate implementation task list
