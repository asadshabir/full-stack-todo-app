# Quickstart: Professional-Grade Next.js Frontend Development

**Feature**: `001-nextjs-frontend-auth`
**Date**: 2026-01-08
**Purpose**: Step-by-step guide for developers to set up, run, and contribute to the Next.js frontend

---

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js**: v20.x or later (LTS recommended)
- **npm**: v10.x or later (comes with Node.js)
- **Git**: Latest version
- **Code Editor**: VS Code recommended with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features

**Backend Requirement**: FastAPI backend must be running on `http://localhost:8000` (or configure `NEXT_PUBLIC_API_BASE_URL` in `.env.local`)

---

## Project Setup

### 1. Clone Repository

```bash
# Clone the monorepo
git clone <repository-url>
cd Phase-2

# Switch to feature branch
git checkout 001-nextjs-frontend-auth
```

### 2. Navigate to Frontend Directory

```bash
cd frontend
```

### 3. Install Dependencies

```bash
npm install
```

**Expected Installation Time**: 2-3 minutes

**Key Dependencies Installed**:
- Next.js 15.x (App Router)
- React 19.x
- TypeScript 5.3+
- Tailwind CSS 3.4+
- Better Auth (JWT plugin)
- TanStack Query (React Query) v5
- Framer Motion 11+
- Axios
- React Hook Form + Zod
- Lucide React (icons)

### 4. Configure Environment Variables

Create `.env.local` file in `frontend/` directory:

```bash
# Copy example environment file
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Backend API Base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Better Auth Secret (must match backend BETTER_AUTH_SECRET)
BETTER_AUTH_SECRET=your-super-secret-key-change-in-production

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important**:
- `BETTER_AUTH_SECRET` MUST match the backend's `BETTER_AUTH_SECRET` environment variable
- Use a strong, random secret for production (e.g., generated with `openssl rand -base64 32`)
- Never commit `.env.local` to version control (already in `.gitignore`)

### 5. Install Shadcn UI Components

Initialize Shadcn UI (first-time setup):

```bash
npx shadcn-ui@latest init
```

**Configuration Prompts**:
- TypeScript: Yes
- Style: Default
- Base color: Neutral
- CSS variables: Yes

Install required components:

```bash
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

Components will be installed in `src/components/ui/`.

---

## Running the Application

### Development Server

Start the Next.js development server:

```bash
npm run dev
```

**Expected Output**:
```
▲ Next.js 15.0.0
- Local: http://localhost:3000
- Network: http://192.168.x.x:3000

✓ Ready in 2.5s
```

Open browser and navigate to: `http://localhost:3000`

**Hot Reload**: Changes to code automatically trigger page refresh (no need to restart server)

### Production Build

Build optimized production bundle:

```bash
npm run build
```

**Expected Output**:
```
Route (app)                  Size     First Load JS
┌ ○ /                        1.2 kB        85.2 kB
├ ○ /signin                  3.5 kB        88.5 kB
├ ○ /signup                  3.8 kB        88.8 kB
└ ● /dashboard              12.4 kB        97.4 kB

○  Static Route
●  Dynamic Route
```

**Build Success Criteria**:
- No TypeScript errors
- Bundle size < 150 KB (First Load JS)
- All routes built successfully

### Run Production Server

After successful build:

```bash
npm run start
```

Production server runs on `http://localhost:3000` (faster than dev server).

---

## Project Structure

```
frontend/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout with providers
│   │   ├── page.tsx              # Landing page (redirects to dashboard or signin)
│   │   ├── (auth)/               # Auth route group (no layout)
│   │   │   ├── signin/page.tsx   # Sign-in page
│   │   │   └── signup/page.tsx   # Sign-up page
│   │   └── dashboard/
│   │       ├── layout.tsx        # Dashboard layout (protected)
│   │       └── page.tsx          # Task dashboard
│   │
│   ├── components/
│   │   ├── ui/                   # Shadcn UI components (reusable)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   └── features/             # Feature-specific components
│   │       ├── auth/
│   │       │   ├── SignUpForm.tsx
│   │       │   ├── SignInForm.tsx
│   │       │   └── PasswordStrength.tsx
│   │       └── tasks/
│   │           ├── TaskCard.tsx
│   │           ├── TaskList.tsx
│   │           ├── TaskForm.tsx
│   │           └── EmptyState.tsx
│   │
│   ├── lib/
│   │   ├── auth-client.ts        # Better Auth configuration
│   │   ├── api-client.ts         # Axios wrapper with JWT interceptors
│   │   ├── query-client.ts       # TanStack Query configuration
│   │   └── utils.ts              # Utility functions (cn, formatDate, etc.)
│   │
│   ├── hooks/
│   │   ├── useAuth.ts            # Authentication hook
│   │   ├── useTasks.ts           # Task CRUD hooks
│   │   └── useToast.ts           # Toast notifications
│   │
│   ├── types/
│   │   ├── auth.ts               # Auth-related types
│   │   ├── task.ts               # Task entity types
│   │   └── api.ts                # API response types
│   │
│   ├── schemas/
│   │   ├── auth.ts               # Zod schemas for auth forms
│   │   └── task.ts               # Zod schemas for task forms
│   │
│   └── styles/
│       └── globals.css           # Global styles (Tailwind imports)
│
├── public/
│   └── empty-state.svg           # Empty state illustration
│
├── .env.local                    # Environment variables (gitignored)
├── .env.example                  # Example environment variables
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies
└── README.md                     # Frontend-specific documentation
```

---

## Key Development Patterns

### 1. Authentication Flow

```typescript
// components/features/auth/SignUpForm.tsx
import { useAuth } from "@/hooks/useAuth"
import { signUpSchema } from "@/schemas/auth"

export function SignUpForm() {
  const { signUp, isLoading } = useAuth()

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    mode: "onChange", // Real-time validation
  })

  const onSubmit = async (data) => {
    await signUp(data)
    router.push("/dashboard")
  }

  return <Form {...form} onSubmit={onSubmit}>...</Form>
}
```

### 2. Protected Routes

```typescript
// app/dashboard/layout.tsx
import { redirect } from "next/navigation"
import { authClient } from "@/lib/auth-client"

export default async function DashboardLayout({ children }) {
  const session = await authClient.getSession()

  if (!session) {
    redirect("/signin")
  }

  return <div>{children}</div>
}
```

### 3. Task CRUD with TanStack Query

```typescript
// hooks/useTasks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import apiClient from "@/lib/api-client"

export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await apiClient.get("/tasks")
      return response.data.data
    },
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (newTask) => apiClient.post("/tasks", newTask),
    onMutate: async (newTask) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["tasks"] })
      const previousTasks = queryClient.getQueryData(["tasks"])

      queryClient.setQueryData(["tasks"], (old) => [
        ...old,
        { ...newTask, id: `temp-${Date.now()}` },
      ])

      return { previousTasks }
    },
    onError: (err, newTask, context) => {
      // Rollback on error
      queryClient.setQueryData(["tasks"], context.previousTasks)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
  })
}
```

### 4. Framer Motion Animations

```typescript
// components/features/tasks/TaskCard.tsx
import { motion } from "framer-motion"

export function TaskCard({ task }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02, boxShadow: "0 8px 16px rgba(0,0,0,0.1)" }}
    >
      <Card>...</Card>
    </motion.div>
  )
}
```

---

## Testing

### Run Unit Tests

```bash
npm run test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run End-to-End Tests (Playwright)

```bash
# Start dev server first
npm run dev

# In another terminal
npm run test:e2e
```

### Check Test Coverage

```bash
npm run test:coverage
```

**Minimum Coverage Target**: 80%

---

## Linting and Formatting

### Lint Code

```bash
npm run lint
```

Fix linting issues automatically:

```bash
npm run lint:fix
```

### Format Code with Prettier

```bash
npm run format
```

**Pre-commit Hook**: Linting and formatting run automatically before git commits (via Husky).

---

## Common Development Tasks

### Add a New Page

1. Create file in `src/app/[route]/page.tsx`
2. Export default component:
   ```tsx
   export default function MyPage() {
     return <div>My Page</div>
   }
   ```
3. Access at `http://localhost:3000/[route]`

### Add a New Component

1. Create file in `src/components/features/[category]/ComponentName.tsx`
2. Use TypeScript and export:
   ```tsx
   interface Props {
     title: string
   }

   export function ComponentName({ title }: Props) {
     return <div>{title}</div>
   }
   ```

### Add a New API Hook

1. Create function in `src/hooks/useSomething.ts`
2. Use TanStack Query patterns:
   ```tsx
   export function useSomething() {
     return useQuery({
       queryKey: ["something"],
       queryFn: fetchSomething,
     })
   }
   ```

### Update Environment Variables

1. Edit `.env.local`
2. Restart dev server (`npm run dev`)
3. Variables prefixed with `NEXT_PUBLIC_` are exposed to browser

---

## Troubleshooting

### Issue: "Cannot connect to backend API"

**Solution**:
1. Check backend is running on `http://localhost:8000`
2. Verify `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
3. Check browser console for CORS errors

### Issue: "JWT token not attaching to requests"

**Solution**:
1. Verify `BETTER_AUTH_SECRET` matches backend
2. Check Better Auth session exists: `console.log(await authClient.getSession())`
3. Inspect network tab for Authorization header

### Issue: "Shadcn components not styled correctly"

**Solution**:
1. Ensure Tailwind CSS is configured (`tailwind.config.ts`)
2. Check `src/styles/globals.css` imports Tailwind directives
3. Restart dev server after Tailwind config changes

### Issue: "Framer Motion animations lagging"

**Solution**:
1. Ensure animating `transform` and `opacity` only (not `width`/`height`)
2. Add `will-change: transform` CSS property
3. Limit concurrent animations to < 10 elements

### Issue: "TypeScript errors in IDE but build succeeds"

**Solution**:
1. Restart TypeScript server in VS Code (Cmd+Shift+P → "TypeScript: Restart TS Server")
2. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
3. Check `tsconfig.json` is correctly configured

---

## Performance Optimization Checklist

- [ ] Use Server Components for static layouts
- [ ] Dynamic import Framer Motion: `const MotionDiv = dynamic(() => import('framer-motion').then(mod => mod.motion.div), { ssr: false })`
- [ ] Optimize images with `next/image`
- [ ] Lazy load non-critical components
- [ ] Enable Next.js caching with `revalidate` in fetch requests
- [ ] Minimize JavaScript bundle size (check `npm run build` output)
- [ ] Run Lighthouse audit: `npm run lighthouse`

**Target Lighthouse Scores**:
- Performance: 90+ (desktop), 80+ (mobile)
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

---

## Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub repository
2. Import project in Vercel dashboard: https://vercel.com/new
3. Configure environment variables in Vercel:
   - `NEXT_PUBLIC_API_BASE_URL` → Production API URL
   - `BETTER_AUTH_SECRET` → Production secret
4. Deploy: Vercel automatically builds and deploys

**Build Command**: `npm run build`
**Output Directory**: `.next`

### Deploy to Netlify

1. Push code to GitHub repository
2. Import project in Netlify dashboard
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Add environment variables in Netlify settings

---

## Agent-Led Development

This feature uses specialized agents for development:

### Frontend Agent (`nextjs-frontend-developer`)

Responsible for:
- UI components implementation
- Better Auth integration
- TanStack Query setup
- Framer Motion animations

Invoke with:
```bash
# Via claude-code CLI
/agent nextjs-frontend-developer "Implement TaskCard component with animations"
```

### Skills Referenced

- `@skills/nextjs`: Next.js 15 App Router patterns
- `@skills/better-auth`: Better Auth JWT integration

---

## Additional Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Better Auth Docs**: https://better-auth.com/docs
- **TanStack Query**: https://tanstack.com/query/latest
- **Shadcn UI**: https://ui.shadcn.com
- **Framer Motion**: https://www.framer.com/motion
- **Tailwind CSS**: https://tailwindcss.com/docs

---

**Need Help?**

1. Check `specs/001-nextjs-frontend-auth/` for planning documents
2. Review `contracts/` for API specifications
3. Search existing PHRs in `history/prompts/001-nextjs-frontend-auth/`
4. Contact development team in project Slack channel

---

**Last Updated**: 2026-01-08
