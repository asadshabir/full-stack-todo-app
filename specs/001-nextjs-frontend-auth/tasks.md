# Tasks: Professional-Grade Next.js Frontend with Modern UI/UX

**Input**: Design documents from `/specs/001-nextjs-frontend-auth/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: This feature does NOT explicitly request TDD or test tasks. Tasks focus on implementation only. Testing will be added in a future phase if requested.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `frontend/src/`, `frontend/public/`
- All paths relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create frontend directory structure with Next.js 15 App Router layout (frontend/src/app/, frontend/src/components/, frontend/src/lib/, frontend/src/hooks/, frontend/src/types/, frontend/src/schemas/, frontend/src/styles/)
- [ ] T002 Initialize Next.js 15 project in frontend/ with TypeScript and App Router configuration
- [ ] T003 [P] Configure TypeScript with strict mode in frontend/tsconfig.json
- [ ] T004 [P] Install and configure Tailwind CSS 3.4+ in frontend/tailwind.config.ts and frontend/src/styles/globals.css
- [ ] T005 [P] Configure ESLint and Prettier for frontend code quality
- [ ] T006 [P] Create frontend/.env.example with required environment variables (NEXT_PUBLIC_API_BASE_URL, BETTER_AUTH_SECRET, NEXT_PUBLIC_APP_URL)
- [ ] T007 [P] Add frontend/.env.local to .gitignore
- [ ] T008 [P] Configure Next.js config in frontend/next.config.js (enable SWC, configure image domains, set strict mode)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T009 Install Shadcn UI CLI and initialize in frontend/ with neutral theme and CSS variables
- [ ] T010 [P] Install Shadcn UI Button component in frontend/src/components/ui/button.tsx
- [ ] T011 [P] Install Shadcn UI Input component in frontend/src/components/ui/input.tsx
- [ ] T012 [P] Install Shadcn UI Label component in frontend/src/components/ui/label.tsx
- [ ] T013 [P] Install Shadcn UI Card component in frontend/src/components/ui/card.tsx
- [ ] T014 [P] Install Shadcn UI Dialog component in frontend/src/components/ui/dialog.tsx
- [ ] T015 [P] Install Shadcn UI Form component in frontend/src/components/ui/form.tsx
- [ ] T016 [P] Install Shadcn UI Toast component in frontend/src/components/ui/toast.tsx and frontend/src/components/ui/toaster.tsx
- [ ] T017 Customize Tailwind theme in frontend/tailwind.config.ts with Apple/Linear aesthetic (colors: priority-high/medium/low, neutral palette, custom shadows, Inter font family)
- [ ] T018 [P] Create utility functions in frontend/src/lib/utils.ts (cn function for class merging, formatDate, etc.)
- [ ] T019 [P] Create TypeScript types for API responses in frontend/src/types/api.ts (ApiResponse<T>, ApiError interfaces)
- [ ] T020 Install Better Auth with JWT plugin in frontend/ via npm
- [ ] T021 Configure Better Auth client in frontend/src/lib/auth-client.ts (baseURL, JWT plugin, HTTP-only cookie storage)
- [ ] T022 Install TanStack Query v5 in frontend/ via npm
- [ ] T023 Configure TanStack Query client in frontend/src/lib/query-client.ts (staleTime: 5min, cacheTime: 10min, refetchOnWindowFocus: true, retry: 3)
- [ ] T024 Install Axios in frontend/ via npm
- [ ] T025 Create API client with JWT interceptors in frontend/src/lib/api-client.ts (request interceptor for Bearer token, response interceptor for 401/403/500 errors, retry logic with axios-retry)
- [ ] T026 Install Framer Motion 11+ in frontend/ via npm
- [ ] T027 Install React Hook Form and @hookform/resolvers in frontend/ via npm
- [ ] T028 Install Zod validation library in frontend/ via npm
- [ ] T029 Install Lucide React icons in frontend/ via npm
- [ ] T030 Create root layout in frontend/src/app/layout.tsx (wrap with TanStack Query Provider, Toaster, metadata configuration)
- [ ] T031 Create landing page in frontend/src/app/page.tsx (redirect to /dashboard if authenticated, otherwise /signin)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Seamless Authentication Experience (Priority: P1) 🎯 MVP

**Goal**: Users can quickly and securely sign up or sign in with real-time validation, JWT token management, and polished UI

**Independent Test**: Create new account → Sign out → Sign in → Verify redirect to dashboard

### Implementation for User Story 1

- [ ] T032 [P] [US1] Create User type interface in frontend/src/types/auth.ts (id, email, name, createdAt, updatedAt)
- [ ] T033 [P] [US1] Create AuthSession type interface in frontend/src/types/auth.ts (user, token, expiresAt, refreshToken)
- [ ] T034 [P] [US1] Create SignUpInput type interface in frontend/src/types/auth.ts (email, password, confirmPassword, name)
- [ ] T035 [P] [US1] Create SignInInput type interface in frontend/src/types/auth.ts (email, password, rememberMe)
- [ ] T036 [P] [US1] Create Zod validation schema for sign-up in frontend/src/schemas/auth.ts (email validation, password strength: 8+ chars, 1 uppercase, 1 lowercase, 1 number, confirmPassword matching)
- [ ] T037 [P] [US1] Create Zod validation schema for sign-in in frontend/src/schemas/auth.ts (email and password required)
- [ ] T038 [US1] Create useAuth hook in frontend/src/hooks/useAuth.ts (signUp, signIn, signOut functions using Better Auth, loading states, error handling)
- [ ] T039 [P] [US1] Create PasswordStrength component in frontend/src/components/features/auth/PasswordStrength.tsx (visual strength indicator with 4-level bars: weak/fair/good/strong, color-coded)
- [ ] T040 [US1] Create SignUpForm component in frontend/src/components/features/auth/SignUpForm.tsx (React Hook Form + Zod, email input, password input with PasswordStrength, confirmPassword input, name input, submit button, real-time validation feedback, error messages)
- [ ] T041 [US1] Create SignInForm component in frontend/src/components/features/auth/SignInForm.tsx (React Hook Form + Zod, email input, password input, remember me checkbox, submit button, error messages, forgot password link placeholder)
- [ ] T042 [US1] Create sign-up page in frontend/src/app/(auth)/signup/page.tsx (render SignUpForm, Shadcn Card wrapper, redirect to /dashboard on success, link to signin)
- [ ] T043 [US1] Create sign-in page in frontend/src/app/(auth)/signin/page.tsx (render SignInForm, Shadcn Card wrapper, redirect to /dashboard on success, link to signup)
- [ ] T044 [US1] Create authentication middleware in frontend/src/middleware.ts (protect /dashboard route, redirect unauthenticated users to /signin, use Better Auth session check)
- [ ] T045 [US1] Add sign-out button functionality to dashboard layout (call signOut from useAuth, clear JWT token, redirect to /signin)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Interactive Task Dashboard with Visual Excellence (Priority: P2)

**Goal**: Visually stunning task management interface with CRUD operations, Framer Motion animations, priority color coding, and elegant empty states

**Independent Test**: Authenticate user → Create task → Update task priority → Delete task → Verify animations and color coding

### Implementation for User Story 2

- [ ] T046 [P] [US2] Create TaskPriority type in frontend/src/types/task.ts (literal type: "high" | "medium" | "low")
- [ ] T047 [P] [US2] Create Task interface in frontend/src/types/task.ts (id, userId, title, description, priority, completed, createdAt, updatedAt)
- [ ] T048 [P] [US2] Create CreateTaskInput interface in frontend/src/types/task.ts (title, description, priority)
- [ ] T049 [P] [US2] Create UpdateTaskInput interface in frontend/src/types/task.ts (title?, description?, priority?, completed?)
- [ ] T050 [P] [US2] Create Zod validation schema for create task in frontend/src/schemas/task.ts (title: 1-200 chars required, description: 0-1000 chars optional, priority: enum with default "medium")
- [ ] T051 [P] [US2] Create Zod validation schema for update task in frontend/src/schemas/task.ts (all fields optional but strict schema)
- [ ] T052 [P] [US2] Define PRIORITY_COLORS constant in frontend/src/types/task.ts (high: red shades, medium: yellow shades, low: green shades for bg/border/text)
- [ ] T053 [US2] Create useTasks query hook in frontend/src/hooks/useTasks.ts (useQuery with ["tasks"] key, fetches GET /tasks, returns Task array)
- [ ] T054 [US2] Create useCreateTask mutation hook in frontend/src/hooks/useTasks.ts (useMutation for POST /tasks, optimistic update adding temp task to cache, onError rollback, onSuccess invalidate ["tasks"] query)
- [ ] T055 [US2] Create useUpdateTask mutation hook in frontend/src/hooks/useTasks.ts (useMutation for PUT /tasks/:id, optimistic update modifying task in cache, onError rollback, onSuccess invalidate queries)
- [ ] T056 [US2] Create useDeleteTask mutation hook in frontend/src/hooks/useTasks.ts (useMutation for DELETE /tasks/:id, optimistic update removing task from cache, onError rollback, onSuccess invalidate queries)
- [ ] T057 [P] [US2] Create EmptyState component in frontend/src/components/features/tasks/EmptyState.tsx (illustration SVG, "No tasks yet" message, "Create your first task" CTA button, professional copy)
- [ ] T058 [US2] Create TaskCard component in frontend/src/components/features/tasks/TaskCard.tsx (Shadcn Card, task title/description display, priority color coding using PRIORITY_COLORS, completed checkbox, edit/delete action buttons, Framer Motion: initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100 }}, whileHover={{ scale: 1.02, boxShadow }}, transition with spring physics)
- [ ] T059 [US2] Create TaskList component in frontend/src/components/features/tasks/TaskList.tsx (map over tasks array, render TaskCard for each with AnimatePresence for exit animations, handle empty state with EmptyState component, layout animations with Framer Motion layout prop)
- [ ] T060 [US2] Create TaskForm component in frontend/src/components/features/tasks/TaskForm.tsx (React Hook Form + Zod, title Input, description Textarea, priority Select with high/medium/low options, submit button, used for both create and edit modes, controlled by isEdit prop)
- [ ] T061 [US2] Create task creation dialog in TaskList component using Shadcn Dialog (trigger button "Create Task", dialog with TaskForm, onSubmit calls useCreateTask, success toast notification)
- [ ] T062 [US2] Add task editing functionality to TaskCard (edit button opens Dialog with TaskForm in edit mode pre-filled with task data, onSubmit calls useUpdateTask, success toast notification)
- [ ] T063 [US2] Add task deletion confirmation to TaskCard (delete button opens confirmation Dialog, confirm button calls useDeleteTask, success toast notification, Framer Motion exit animation on card removal)
- [ ] T064 [US2] Add task completion toggle to TaskCard (checkbox triggers useUpdateTask with completed field, instant optimistic update, Framer Motion re-animation on completion status change)
- [ ] T065 [US2] Create dashboard layout in frontend/src/app/dashboard/layout.tsx (protect route with authentication check, sidebar placeholder or header with sign-out button, main content area)
- [ ] T066 [US2] Create dashboard page in frontend/src/app/dashboard/page.tsx (fetch tasks with useTasks hook, render TaskList component, Suspense boundary with loading skeleton, error boundary for API failures)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Optimized Performance and Seamless JWT Integration (Priority: P3)

**Goal**: Instant page loads with Next.js streaming/suspense, automatic JWT attachment, optimistic updates, and caching optimization

**Independent Test**: Measure page load times < 1s → Verify JWT auto-attachment in network tab → Test optimistic updates feel instant

### Implementation for User Story 3

- [ ] T067 [P] [US3] Implement Server Component for dashboard layout in frontend/src/app/dashboard/layout.tsx (async function, fetch initial session server-side if possible, minimal client-side JS)
- [ ] T068 [P] [US3] Add Suspense boundary to dashboard page in frontend/src/app/dashboard/page.tsx (wrap TaskList with Suspense, fallback shows TaskListSkeleton component for streaming)
- [ ] T069 [P] [US3] Create TaskListSkeleton component in frontend/src/components/features/tasks/TaskListSkeleton.tsx (skeleton cards with shimmer animation, matches TaskCard dimensions)
- [ ] T070 [US3] Verify Axios interceptor in frontend/src/lib/api-client.ts automatically attaches Authorization: Bearer <token> header to all requests (test by checking network tab, ensure token from Better Auth session)
- [ ] T071 [US3] Implement 401 error handling in Axios response interceptor (on 401 Unauthorized, call signOut, redirect to /signin, clear cached queries)
- [ ] T072 [US3] Implement 403 error handling in Axios response interceptor (on 403 Forbidden, show toast: "You don't have permission to access this resource")
- [ ] T073 [US3] Implement network error handling in Axios response interceptor (on network failure, show toast: "Network error. Please check your connection", retry logic already configured in T025)
- [ ] T074 [US3] Optimize TanStack Query cache configuration in frontend/src/lib/query-client.ts (verify staleTime: 5min prevents redundant fetches, refetchOnWindowFocus ensures fresh data on tab focus)
- [ ] T075 [US3] Add dynamic import for Framer Motion in TaskCard to reduce initial bundle size (use next/dynamic with ssr: false)
- [ ] T076 [US3] Add dynamic import for Shadcn Dialog in TaskList to lazy-load dialog component
- [ ] T077 [US3] Optimize images with next/image in EmptyState component (set width/height, priority for above-the-fold, placeholder blur)
- [ ] T078 [US3] Add prefers-reduced-motion media query support to Framer Motion animations (use useReducedMotion hook, conditionally disable animations)
- [ ] T079 [US3] Verify optimistic updates in useCreateTask provide instant feedback (task appears in UI immediately, < 100ms perceived latency)
- [ ] T080 [US3] Verify optimistic updates in useUpdateTask provide instant feedback (priority color change is immediate)
- [ ] T081 [US3] Verify optimistic updates in useDeleteTask provide instant feedback (task card animates out immediately)
- [ ] T082 [US3] Test JWT token expiration handling (simulate expired token, verify redirect to /signin with context preserved)
- [ ] T083 [US3] Run Lighthouse audit on dashboard page (target: Performance 90+ desktop, 80+ mobile, Accessibility 90+, Best Practices 90+)
- [ ] T084 [US3] Fix any Lighthouse performance issues (code splitting, image optimization, bundle size reduction)

**Checkpoint**: All user stories should now be independently functional with optimized performance

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T085 [P] Add loading states to all form submissions (disable buttons, show spinner during API calls in SignUpForm, SignInForm, TaskForm)
- [ ] T086 [P] Add aria-labels and semantic HTML for accessibility (ensure all interactive elements have labels, form inputs have proper associations)
- [ ] T087 [P] Implement toast notifications for all success/error scenarios (sign-up success, sign-in success, task created, task updated, task deleted, API errors)
- [ ] T088 [P] Add keyboard navigation support (Tab key navigation, Enter to submit forms, Escape to close dialogs)
- [ ] T089 [P] Implement focus management in dialogs (focus first input on open, return focus on close)
- [ ] T090 [P] Add error boundaries for graceful error handling (catch React errors, show friendly error messages, log to console)
- [ ] T091 [P] Create empty state illustrations as SVG in frontend/public/ (professional, minimalist design matching Apple/Linear aesthetic)
- [ ] T092 [P] Add meta tags for SEO in frontend/src/app/layout.tsx (title, description, og:tags, favicon)
- [ ] T093 [P] Verify all environment variables are documented in frontend/.env.example
- [ ] T094 [P] Add frontend README.md with setup instructions, development commands, and troubleshooting tips
- [ ] T095 Code cleanup and refactoring (remove console.logs, unused imports, ensure consistent code style)
- [ ] T096 Run ESLint and fix all linting issues in frontend/
- [ ] T097 Run Prettier and format all frontend code
- [ ] T098 Final manual testing of all user flows (sign-up → sign-in → create task → update task → delete task → sign-out)
- [ ] T099 Verify constitution compliance (check all 7 principles: spec-driven, separation, isolation, agent-led, stateless auth, API security, env management)
- [ ] T100 Run quickstart.md validation (verify all setup steps work from scratch)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion - No dependencies on other stories
- **User Story 2 (Phase 4)**: Depends on Foundational phase completion - Requires US1 for authentication (users must sign in to access dashboard)
- **User Story 3 (Phase 5)**: Depends on Foundational + US1 + US2 completion - Performance optimizations apply to existing features
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - **MVP-CRITICAL**
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - **Depends on US1 for auth** (users must authenticate to see dashboard)
- **User Story 3 (P3)**: Can start after US1 + US2 complete - Optimizes existing features

### Within Each User Story

**User Story 1 (Authentication)**:
1. Types (T032-T035) → can run in parallel
2. Schemas (T036-T037) → can run in parallel (depends on types)
3. useAuth hook (T038) → depends on Better Auth config (T021)
4. Components (T039-T041) → PasswordStrength [P], then Forms (depends on schemas)
5. Pages (T042-T043) → depends on form components
6. Middleware (T044) → depends on Better Auth config
7. Sign-out (T045) → depends on useAuth hook

**User Story 2 (Task Dashboard)**:
1. Types (T046-T049) → can run in parallel
2. Schemas (T050-T051) → can run in parallel
3. Constants (T052) → can run in parallel
4. Hooks (T053-T056) → useQuery first, then mutations (depend on API client T025)
5. Components (T057-T060) → EmptyState [P], TaskCard [P], TaskList, TaskForm can run in parallel
6. Integration (T061-T064) → dialogs and interactions (depend on components)
7. Pages (T065-T066) → dashboard layout and page (depend on components)

**User Story 3 (Performance)**:
1. Server Components (T067) → can run in parallel
2. Suspense (T068-T069) → can run in parallel
3. Interceptors (T070-T073) → verify and enhance API client
4. Cache optimization (T074) → verify TanStack Query config
5. Code splitting (T075-T076) → dynamic imports
6. Image optimization (T077) → next/image
7. Accessibility (T078) → prefers-reduced-motion
8. Testing (T079-T084) → verify optimistic updates and run audits

### Parallel Opportunities

- **Setup phase**: T003, T004, T005, T006, T007, T008 can all run in parallel
- **Foundational phase**: T010-T016 (Shadcn components), T018, T019 can run in parallel
- **US1 types**: T032, T033, T034, T035 can run in parallel
- **US1 schemas**: T036, T037 can run in parallel
- **US2 types**: T046, T047, T048, T049 can run in parallel
- **US2 schemas**: T050, T051 can run in parallel
- **US2 components**: T057 (EmptyState) can be developed in parallel with T058 (TaskCard)
- **US3 optimizations**: T067, T068, T069, T075, T076, T077, T078 can run in parallel
- **Polish phase**: T085-T094 can run in parallel

---

## Parallel Example: User Story 1 (Authentication)

```bash
# Launch type definitions in parallel:
Task T032: Create User type
Task T033: Create AuthSession type
Task T034: Create SignUpInput type
Task T035: Create SignInInput type

# After types complete, launch schemas in parallel:
Task T036: Create sign-up Zod schema
Task T037: Create sign-in Zod schema

# After schemas complete, launch PasswordStrength and useAuth (if useAuth doesn't depend on components):
Task T039: Create PasswordStrength component
Task T038: Create useAuth hook
```

---

## Parallel Example: User Story 2 (Task Dashboard)

```bash
# Launch type definitions in parallel:
Task T046: Create TaskPriority type
Task T047: Create Task interface
Task T048: Create CreateTaskInput interface
Task T049: Create UpdateTaskInput interface

# Launch components in parallel after types/schemas complete:
Task T057: Create EmptyState component
Task T058: Create TaskCard component
Task T060: Create TaskForm component
# Note: TaskList (T059) depends on TaskCard being complete
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T008)
2. Complete Phase 2: Foundational (T009-T031) **CRITICAL - blocks all stories**
3. Complete Phase 3: User Story 1 (T032-T045)
4. **STOP and VALIDATE**: Test sign-up, sign-in, sign-out independently
5. Deploy/demo if ready

**Estimated tasks for MVP**: 45 tasks (Setup + Foundational + US1)

### Incremental Delivery

1. **Foundation ready** → Complete Setup + Foundational (T001-T031)
2. **MVP (US1)** → Add authentication (T032-T045) → Test independently → Deploy/Demo
3. **Feature Complete (US1 + US2)** → Add task dashboard (T046-T066) → Test independently → Deploy/Demo
4. **Performance Optimized (US1 + US2 + US3)** → Add optimizations (T067-T084) → Test independently → Deploy/Demo
5. **Production Ready** → Polish (T085-T100) → Final testing → Deploy

### Parallel Team Strategy

With multiple developers:

1. **Team completes Setup + Foundational together** (T001-T031)
2. Once Foundational is done:
   - **Developer A**: User Story 1 Authentication (T032-T045)
   - **Developer B**: Can start preparing User Story 2 components (types, schemas) but cannot fully integrate until US1 auth is complete
3. After US1 complete:
   - **Developer A**: User Story 3 Performance (T067-T084)
   - **Developer B**: User Story 2 Dashboard (T046-T066) - now has authentication dependency satisfied
4. **Team together**: Polish phase (T085-T100)

---

## Notes

- **[P]** tasks = different files, no dependencies on incomplete tasks
- **[Story]** label maps task to specific user story for traceability
- Each user story should be independently completable and testable (US2 depends on US1 for auth, but still independently testable after US1 is done)
- No test tasks included (TDD not requested in spec)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

---

## Task Summary

- **Total Tasks**: 100
- **Setup Phase**: 8 tasks
- **Foundational Phase**: 23 tasks (BLOCKS all user stories)
- **User Story 1 (P1 - MVP)**: 14 tasks
- **User Story 2 (P2)**: 21 tasks
- **User Story 3 (P3)**: 18 tasks
- **Polish Phase**: 16 tasks

**Parallel Opportunities**: 35+ tasks marked [P] can be executed in parallel within their phase

**MVP Scope**: Phases 1 + 2 + 3 (45 tasks) delivers authentication flow

**Feature Complete Scope**: Phases 1 + 2 + 3 + 4 (66 tasks) delivers authentication + task management

**Production Ready Scope**: All 100 tasks
