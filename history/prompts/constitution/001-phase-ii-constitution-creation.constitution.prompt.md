---
id: 001
title: Phase II Constitution Creation
stage: constitution
date: 2026-01-08
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 008-animation-rules
user: Asad Shabir
command: /sp.constitution
labels: ["constitution", "phase-ii", "governance", "principles", "tech-stack"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - N/A
---

## Prompt

/sp.constitution for Phase II

Project: Evolution of Todo - Phase II (Full-Stack AI-Native Web Application)

Core Principles:

Spec-Driven Supremacy: Strict "No Manual Coding" policy. Implementation tabhi hogi jab Markdown Spec validate ho jaye. Agar code galat hai, to code ko nahi balki Spec ko refine karein.

Architectural Separation: Frontend (Next.js) aur Backend (FastAPI) ke beech saaf judai (decoupling) honi chahiye. Dono services independently run karein.

Security by Isolation: User data isolation lazmi hai. Ek user ka data dusre user ko kabhi nahi dikhna chahiye.

Agent-Led Execution: Har kaam ke liye specific custom agent (.claude/agents) aur skills (@skills/) ka istemal karein.

Key Standards & Tech Stack:


Frontend: Next.js 15+ (App Router), TypeScript, Tailwind CSS.


Backend: Python 3.13+, FastAPI, SQLModel (ORM).


Database: Neon Serverless PostgreSQL (persistent storage).

Authentication: Better Auth (Frontend side) JWT issue karega; FastAPI (Backend side) use verify karega via BETTER_AUTH_SECRET.


Monorepo Organization: Folder structure /frontend, /backend, /specs, aur /skills ke mutabiq hona chahiye.

Operational Constraints:


Stateless Auth: Backend mein local sessions store nahi karne; sirf JWT verification par depend karein.


API Security: Har RESTful endpoint (/api/{user_id}/tasks) par JWT verification aur user ownership enforcement lazmi hai.

Env Management: Database URLs aur Auth Secrets ke liye strictly .env files ka istemal karein. Hardcoding sakht mana hai.

Skill References: Code generate karte waqt hamesha @skills/nextjs, @skills/fastapi, aur @skills/sqlmodel ko context mein rakhein.

Success Criteria:

Working User Signup/Signin flow via Better Auth.

Neon DB mein data persistence (CRUD operations) successfully save ho.

Multi-user environment mein zero data leakage (ek user dusre ka task na dekh sake).

Deployment readiness: Docker-ready aur Kubernetes architecture ke liye tayyar code.

## Response snapshot

Created initial Phase II constitution (v1.0.0) with 7 core principles:

1. **Spec-Driven Supremacy**: Mandatory spec validation before implementation; code errors indicate spec deficiencies
2. **Architectural Separation**: Frontend/Backend decoupling with independent deployment capability
3. **Security by Isolation**: Zero data leakage between users with mandatory user_id filtering
4. **Agent-Led Execution**: All work via specialized agents and skills (no ad-hoc manual coding)
5. **Stateless Authentication**: JWT-only auth using BETTER_AUTH_SECRET shared between services
6. **API Security & Ownership Enforcement**: Path parameter user_id must match JWT user_id
7. **Environment Management**: All secrets in .env files; hardcoding prohibited

Documented complete tech stack (Next.js 15+, FastAPI, SQLModel, Neon PostgreSQL, Better Auth) with enforcement requirements for each principle.

Added Success Criteria section with 4 testable checkpoints: Authentication Flow, Data Persistence, Multi-User Isolation, and Deployment Readiness.

Established governance procedures for amendments (ADR-based), compliance verification (PR checklists), and complexity justification for deviations.

Constitution file includes HTML comment at top documenting version change, modified principles, templates status, and follow-up TODOs.

## Outcome

- ✅ Impact: Established foundational governance for Phase II full-stack development with 7 mandatory principles ensuring spec-driven, secure, and scalable architecture
- 🧪 Tests: N/A (constitution document, not code)
- 📁 Files: Created/updated `.specify/memory/constitution.md` with complete Phase II principles and standards
- 🔁 Next prompts: Feature specification (`/sp.specify`), implementation planning (`/sp.plan`), or ADR creation (`/sp.adr`) for architectural decisions
- 🧠 Reflection: Constitution successfully translates user's Phase II requirements into enforceable principles with clear rationale, enforcement mechanisms, and success criteria. Template alignment verified. Ready for feature development.

## Evaluation notes (flywheel)

- Failure modes observed: None - all placeholders filled, no unresolved dependencies
- Graders run and results (PASS/FAIL): Manual validation - PASS (no bracketed placeholders, semantic versioning correct, dates ISO format, principles testable)
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Monitor first feature implementation for principle violations; refine enforcement language if ambiguities arise
