---
id: 002
title: Next.js Frontend Plan Creation
stage: plan
date: 2026-01-08
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-nextjs-frontend-auth
branch: 001-nextjs-frontend-auth
user: Asad Shabir
command: /sp.plan
labels: ["plan", "nextjs", "frontend", "architecture", "agent-execution", "research"]
links:
  spec: specs/001-nextjs-frontend-auth/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-nextjs-frontend-auth/plan.md
  - specs/001-nextjs-frontend-auth/research.md
  - specs/001-nextjs-frontend-auth/data-model.md
  - specs/001-nextjs-frontend-auth/contracts/auth-api.yaml
  - specs/001-nextjs-frontend-auth/contracts/tasks-api.yaml
  - specs/001-nextjs-frontend-auth/quickstart.md
tests:
  - N/A
---

## Prompt

---
 (Integrated with Agents & Skills)

**Phase II Strategy:** Orchestrate a multi-agent workflow to build a professional Full-Stack Web App using our custom Skills library.

**Architecture Sketch:**

* **Auth & Security:** **Frontend Agent** uses `@skills/better-auth` to setup JWT on Next.js.
* **Data Layer:** **Backend Agent** uses `@skills/sqlmodel` and `@skills/fastapi` to link Neon DB with User IDs.
* **Integration:** **Architect Agent** ensures both sides follow the `@sp.constitution` and `@specs/`.

**Agent-Based Execution structure:**

1. **Foundation (Architect Agent):** Initialize monorepo structure. Validate that `@skills/` are accessible and `@sp.constitution` is active.
2. **Security Setup (Frontend Agent):** Use `@skills/better-auth` to configure `auth-client.ts`. Implement Sign-up/Sign-in with professional Shadcn UI.
3. **API & DB (Backend Agent):** Use `@skills/fastapi` and `@skills/sqlmodel` to create JWT-protected CRUD endpoints. Ensure strict user isolation.
4. **UI Development (Frontend Agent):** Use `@skills/nextjs` to build the dashboard. Implement **Framer Motion** for "eye-catching" transitions as per `@sp.specify`.
5. **Quality Sync (Architect Agent):** Verify that the Frontend's `api-client` correctly sends the JWT issued by Better Auth to the FastAPI backend.

**Decisions & Tradeoffs:**

* **Agent Switching:** Use **Frontend Agent** for UI components and **Backend Agent** for database/logic to maintain clean code separation.
* **Skill Enforcement:** Every code block must strictly follow the patterns defined in the respective `skills/<tech>/skill.md`.

**Testing Strategy & Validation:**

* **Cross-Agent Check:** Ensure the Backend Agent's API models match the Frontend Agent's TypeScript interfaces.
* **Security Validation:** Verify that a user cannot access another user's tasks (JWT User-ID matching).
* **Visual Audit:** Use Shadcn UI and Framer Motion to meet the "Professional & Eye-catching" criteria.

**Technical Details:**

* Follow the Monorepo structure: `/frontend`, `/backend`, `/specs`, `/skills`, and `.claude/agents`.
* Maintain a strict audit trail in `specs/history/` for every agent-led change.

---

## Response snapshot

Created comprehensive implementation plan with agent-based execution strategy for professional-grade Next.js frontend.

**Phase 0 - Research (Completed)**:
- RT-001: Better Auth JWT integration with HTTP-only cookies
- RT-002: Shadcn UI installation with Apple/Linear aesthetic customization
- RT-003: TanStack Query v5 with optimistic updates and 5-minute cache
- RT-004: Framer Motion animation patterns with GPU acceleration
- RT-005: Axios HTTP client with JWT interceptors and retry logic
- RT-006: Next.js 15 performance optimization (Server Components, streaming, suspense)
- RT-007: React Hook Form + Zod validation with real-time feedback

**Architectural Decisions Finalized**:
- AD-001: HTTP-only cookies for token storage (security)
- AD-002: Axios with interceptors (automatic JWT injection)
- AD-003: Framer Motion layout animations with spring physics
- AD-004: Shadcn UI with custom Apple/Linear theme
- AD-005: Server Components by default + dynamic imports for client-heavy libraries
- AD-006: React Hook Form + Zod with onChange mode
- AD-007: TanStack Query for server state (no Redux)

**Phase 1 - Design Artifacts (Completed)**:
- data-model.md: 11 TypeScript types (User, Task, Auth Session, DTOs, API wrappers)
- contracts/auth-api.yaml: OpenAPI spec for signup, signin, signout, /auth/me endpoints
- contracts/tasks-api.yaml: OpenAPI spec for GET/POST/PUT/PATCH/DELETE /tasks with user isolation
- quickstart.md: 100+ line developer setup guide with troubleshooting and performance tips

**Agent Execution Strategy**:
- Foundation Phase: Architect Agent validates monorepo structure and constitution compliance
- Security Setup: Frontend Agent implements Better Auth + Shadcn UI auth forms
- API Integration: Frontend Agent creates api-client.ts with JWT interceptors + TanStack Query hooks
- UI Development: Frontend Agent builds TaskCard with Framer Motion animations + dashboard
- Quality Sync: Architect Agent verifies contract compliance and multi-user isolation

**Constitution Check**: All 7 principles validated ✅
- Spec-Driven Supremacy: Spec complete with zero clarifications
- Architectural Separation: Frontend/Backend independent deployables
- Security by Isolation: JWT-based ownership enforcement
- Agent-Led Execution: Frontend/Backend/Architect agents assigned
- Stateless Authentication: JWT-only, no session storage
- API Security: Backend enforces user_id matching from JWT
- Environment Management: All secrets in .env files

**Project Structure**: Monorepo with /frontend, /backend, /specs, .claude/agents, .claude/skills

**Testing Strategy**: Unit tests (Jest + RTL), integration tests (Playwright), cross-agent validation checkpoints

**Risk Mitigation**: 6 risks identified with mitigation strategies (Better Auth compatibility, Framer Motion performance, TanStack Query cache invalidation, JWT expiration handling, API contract changes)

## Outcome

- ✅ Impact: Complete, executable implementation plan with agent orchestration ready for /sp.tasks - establishes clear technical architecture, research-backed decisions, and agent coordination workflow
- 🧪 Tests: N/A (planning document, not code)
- 📁 Files: Created plan.md, research.md, data-model.md, contracts/*.yaml, quickstart.md (6 planning artifacts)
- 🔁 Next prompts: `/sp.tasks` to generate actionable task list with dependencies, then invoke agents (nextjs-frontend-developer, fastapi-backend-builder, architecture-architect)
- 🧠 Reflection: Plan successfully translates spec requirements into detailed implementation strategy with 7 research tasks resolved, 7 architectural decisions finalized, and 5-phase agent execution workflow. Constitution compliance verified across all principles. Ready for task generation and agent-led implementation.

## Evaluation notes (flywheel)

- Failure modes observed: None - all research questions resolved, constitution gates passed
- Graders run and results (PASS/FAIL): Manual validation - PASS (all unknowns resolved, contracts align with types, agent assignments clear)
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Monitor agent execution in /sp.tasks to validate if plan provides sufficient guidance without ambiguity; refine agent coordination if handoffs unclear
