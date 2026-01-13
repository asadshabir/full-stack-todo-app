# Evolution of Todo - Phase II Constitution

<!--
Version: 1.0.0 → New constitution for Phase II
Changes Summary:
  - Initial ratification for Phase II full-stack AI-native web application
  - Established 7 core principles: Spec-Driven Supremacy, Architectural Separation,
    Security by Isolation, Agent-Led Execution, Stateless Auth, API Security, Environment Management
  - Added Tech Stack Standards section with Next.js, FastAPI, PostgreSQL, Better Auth
  - Added Operational Constraints section for deployment readiness
  - Added Success Criteria section for multi-user data isolation validation

Templates Status:
  ✅ plan-template.md - Constitution Check section aligns with 7 principles
  ✅ spec-template.md - Requirements align with security and user isolation mandates
  ✅ tasks-template.md - Task organization supports independent user story testing

Follow-up TODOs: None - all placeholders filled
-->

## Core Principles

### I. Spec-Driven Supremacy

**MANDATORY**: Implementation MUST NOT proceed until Markdown specifications are validated and approved. Code errors indicate specification deficiencies, not implementation failures. When code conflicts with reality, refine the spec, NOT the code.

**Rationale**: This "No Manual Coding" policy ensures all work is traceable, reviewable, and aligned with documented intent. Ad-hoc coding leads to drift between documentation and implementation.

**Enforcement**:
- All PRs MUST reference a validated spec document in `specs/<feature>/spec.md`
- Spec validation gate MUST pass before tasks.md generation
- Code reviews MUST verify implementation matches spec exactly

---

### II. Architectural Separation

**MANDATORY**: Frontend (Next.js) and Backend (FastAPI) MUST operate as independently deployable services with clearly defined API boundaries. Neither service may directly access the other's internal state or database.

**Rationale**: Decoupling enables independent scaling, technology evolution, and fault isolation. Tight coupling creates fragile systems where changes ripple unpredictably.

**Enforcement**:
- Frontend MUST communicate with backend exclusively via RESTful API endpoints
- Backend MUST NOT serve frontend assets or HTML
- Each service MUST have independent environment configuration (`.env` files)
- Shared schemas MUST be documented in `specs/<feature>/contracts/` directory

---

### III. Security by Isolation

**MANDATORY**: User data MUST be isolated such that one user CANNOT access, view, or modify another user's data under any circumstances. All database queries MUST enforce user ownership verification.

**Rationale**: Multi-tenant applications require strict data isolation to prevent security breaches, privacy violations, and regulatory compliance failures.

**Enforcement**:
- Every database query filtering user-specific data MUST include `WHERE user_id = {authenticated_user_id}` clause
- All RESTful endpoints MUST verify JWT token AND match `user_id` from token to resource ownership
- Integration tests MUST include multi-user isolation test cases (User A cannot see User B's tasks)
- Code reviews MUST verify no global/shared state for user-specific data

---

### IV. Agent-Led Execution

**MANDATORY**: All development tasks MUST be executed through specialized custom agents (`.claude/agents/`) and reusable skills (`@skills/`) rather than ad-hoc manual interventions.

**Rationale**: Agents encode domain expertise, enforce consistency, and ensure repeatable processes. Manual work introduces variability and undocumented knowledge.

**Enforcement**:
- New features MUST invoke appropriate agents: `architecture-architect`, `fastapi-backend-builder`, `nextjs-frontend-developer`, etc.
- Skills MUST be referenced for technology-specific work: `@skills/nextjs`, `@skills/fastapi`, `@skills/sqlmodel`, `@skills/better-auth`
- Agents MUST document their execution in Prompt History Records (PHRs) under `history/prompts/`
- Custom workflows MUST be codified as new agents or skills, not left as tribal knowledge

---

### V. Stateless Authentication

**MANDATORY**: Backend MUST NOT maintain local session storage. Authentication MUST rely exclusively on JWT token verification using `BETTER_AUTH_SECRET` shared between Frontend (Better Auth) and Backend (FastAPI).

**Rationale**: Stateless auth enables horizontal scaling, simplifies deployment, and eliminates session synchronization complexity across distributed services.

**Enforcement**:
- Backend MUST verify JWT signature and expiration on every protected endpoint call
- Backend MUST extract `user_id` from validated JWT payload, NEVER from request body or query parameters
- Frontend MUST include JWT in `Authorization: Bearer <token>` header for all authenticated requests
- NO session storage, cookies, or server-side session state permitted in backend
- Environment variable `BETTER_AUTH_SECRET` MUST match across frontend and backend configurations

---

### VI. API Security & Ownership Enforcement

**MANDATORY**: Every RESTful API endpoint accepting `user_id` as a path parameter (e.g., `/api/{user_id}/tasks`) MUST verify that the authenticated user (from JWT) matches the `user_id` in the request path.

**Rationale**: Path parameters are user-controllable and must not be trusted. Without verification, users can access other users' data by simply changing the URL.

**Enforcement**:
- Middleware or dependency injection MUST extract `user_id` from validated JWT
- Endpoint handlers MUST compare JWT `user_id` with path parameter `user_id`
- Mismatches MUST return HTTP 403 Forbidden with error message: "User ID mismatch"
- All endpoints MUST be protected by JWT authentication middleware
- Code reviews MUST verify ownership checks on every endpoint accepting `user_id`

---

### VII. Environment Management

**MANDATORY**: Database connection strings, authentication secrets, and API keys MUST be stored in `.env` files and loaded via environment variables. Hardcoded credentials are STRICTLY PROHIBITED.

**Rationale**: Hardcoded secrets lead to security breaches, credential leaks in version control, and inflexible deployments across environments (dev, staging, production).

**Enforcement**:
- All secrets MUST be referenced via `process.env.VARIABLE_NAME` (frontend) or `os.getenv("VARIABLE_NAME")` (backend)
- `.env` files MUST be listed in `.gitignore` to prevent accidental commits
- Example `.env.example` files MUST be provided with placeholder values (no real secrets)
- CI/CD pipelines MUST inject environment variables from secure secret stores
- Code reviews MUST reject any PR containing hardcoded database URLs, API keys, or auth secrets

---

## Tech Stack Standards

**MANDATORY**: All implementations MUST adhere to the following technology stack requirements.

### Frontend

- **Framework**: Next.js 15+ with App Router (NOT Pages Router)
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS
- **Authentication**: Better Auth for JWT issuance and client-side session management
- **State Management**: React Context API or Zustand (avoid Redux unless justified)
- **API Client**: Fetch API or Axios for RESTful backend communication

### Backend

- **Framework**: FastAPI (latest stable version)
- **Language**: Python 3.13+
- **ORM**: SQLModel for database models and queries
- **Database**: Neon Serverless PostgreSQL (persistent storage)
- **Authentication**: JWT verification using `python-jose` or `pyjwt` with `BETTER_AUTH_SECRET`
- **Validation**: Pydantic models for request/response validation

### Monorepo Organization

**MANDATORY**: Project MUST follow this directory structure:

```
Phase-2/
├── frontend/          # Next.js application
│   ├── src/
│   ├── public/
│   ├── .env.local     # Frontend environment variables
│   └── package.json
├── backend/           # FastAPI application
│   ├── src/
│   ├── tests/
│   ├── .env           # Backend environment variables
│   └── requirements.txt
├── specs/             # Feature specifications
│   └── <feature>/
│       ├── spec.md
│       ├── plan.md
│       ├── tasks.md
│       └── contracts/
├── .claude/
│   ├── agents/        # Custom development agents
│   └── skills/        # Reusable technology skills
└── history/
    ├── prompts/       # Prompt History Records (PHRs)
    └── adr/           # Architecture Decision Records
```

---

## Operational Constraints

### Deployment Readiness

**MANDATORY**: Code MUST be structured for containerized deployment with Docker and Kubernetes orchestration.

**Requirements**:
- Both frontend and backend MUST have `Dockerfile` definitions
- Services MUST expose health check endpoints (`/health` or `/api/health`)
- Configuration MUST support 12-factor app principles (environment-based config)
- Dependencies MUST be locked (package-lock.json, requirements.txt with pinned versions)

### Database Migration Strategy

**MANDATORY**: Database schema changes MUST be managed through migration scripts (Alembic for SQLModel).

**Requirements**:
- All schema changes MUST be versioned and reversible
- Migrations MUST be tested in development before production deployment
- Migration scripts MUST be stored in `backend/migrations/` directory

---

## Success Criteria

The constitution is considered successfully implemented when ALL of the following conditions are met:

### SC-001: Authentication Flow

- [ ] Users can sign up with email and password via Better Auth
- [ ] Users can sign in and receive a valid JWT token
- [ ] Backend successfully verifies JWT signature using `BETTER_AUTH_SECRET`
- [ ] Invalid or expired tokens are rejected with HTTP 401 Unauthorized

### SC-002: Data Persistence

- [ ] User tasks are successfully stored in Neon PostgreSQL database
- [ ] CRUD operations (Create, Read, Update, Delete) work correctly for tasks
- [ ] Database connection uses environment variable `DATABASE_URL` from `.env`
- [ ] Data persists across application restarts

### SC-003: Multi-User Isolation

- [ ] User A cannot retrieve User B's tasks via API endpoints
- [ ] Attempting to access another user's tasks returns HTTP 403 Forbidden
- [ ] Integration tests verify zero data leakage between users
- [ ] Database queries include `user_id` filtering on all user-specific tables

### SC-004: Deployment Readiness

- [ ] Docker containers build successfully for frontend and backend
- [ ] Services can be deployed to Kubernetes cluster without modification
- [ ] Environment variables are externalized (no hardcoded secrets)
- [ ] Health check endpoints respond correctly

---

## Governance

### Amendment Procedure

**MANDATORY**: Constitution amendments MUST follow this workflow:

1. **Proposal**: Submit proposed changes via Architecture Decision Record (ADR) in `history/adr/`
2. **Review**: ADR MUST be reviewed and approved before implementation
3. **Version Bump**: Update `CONSTITUTION_VERSION` according to semantic versioning:
   - **MAJOR**: Backward-incompatible principle removals or redefinitions
   - **MINOR**: New principle additions or material expansions
   - **PATCH**: Clarifications, wording fixes, non-semantic refinements
4. **Propagation**: Update all dependent templates (plan, spec, tasks) and agent instructions
5. **Migration Plan**: Document migration path for existing code to comply with new principles

### Compliance Verification

**MANDATORY**: All pull requests MUST include a compliance checklist verifying adherence to constitution principles.

**Required Checks**:
- [ ] Spec-driven: PR references validated spec document
- [ ] Separation: No frontend-backend coupling violations
- [ ] Security: User isolation verified in affected endpoints
- [ ] Agent-led: Work executed via documented agent/skill
- [ ] Stateless auth: No session storage added
- [ ] API security: Ownership checks on user-specific endpoints
- [ ] Environment: No hardcoded secrets

### Complexity Justification

Any deviation from principles MUST be justified in the implementation plan's "Complexity Tracking" section with:
- **Violation**: Which principle is violated
- **Why Needed**: Specific problem requiring deviation
- **Simpler Alternative Rejected Because**: Why compliant approach is insufficient

---

**Version**: 1.0.0 | **Ratified**: 2026-01-08 | **Last Amended**: 2026-01-08
