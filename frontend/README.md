# Frontend - Professional-Grade Next.js Application

This is the frontend application for the Phase II Task Manager project, built with Next.js 15 App Router, TypeScript, Tailwind CSS, and modern UI/UX libraries.

## Tech Stack

- **Framework**: Next.js 15.0+ (App Router)
- **Language**: TypeScript 5.3+
- **Styling**: Tailwind CSS 3.4+ with custom Apple/Linear aesthetic
- **UI Components**: Shadcn UI (to be installed)
- **Authentication**: Better Auth with JWT
- **State Management**: TanStack Query v5
- **Animations**: Framer Motion 11+
- **HTTP Client**: Axios with JWT interceptors
- **Form Handling**: React Hook Form + Zod validation
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js v20.x or later
- npm v10.x or later
- Backend API running on http://localhost:8000

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your configuration
# NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
# BETTER_AUTH_SECRET=your-secret-key
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm run start
```

## Project Structure

```
frontend/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Landing page
│   │   ├── (auth)/           # Auth routes (signin, signup)
│   │   └── dashboard/        # Dashboard (protected)
│   ├── components/
│   │   ├── ui/               # Shadcn UI components
│   │   └── features/         # Feature components (auth, tasks)
│   ├── lib/                  # Utility libraries
│   ├── hooks/                # Custom React hooks
│   ├── types/                # TypeScript types
│   ├── schemas/              # Zod validation schemas
│   └── styles/               # Global styles
├── public/                   # Static assets
└── package.json
```

## Implementation Status

- ✅ Phase 1: Setup (T001-T008) - COMPLETED
  - Next.js 15 project structure created
  - TypeScript with strict mode configured
  - Tailwind CSS with Apple/Linear theme
  - ESLint and Prettier configured
  - Environment variables template
  - Next.js configuration with security headers

- ⏳ Phase 2: Foundational (T009-T031) - PENDING
  - Shadcn UI installation
  - Better Auth setup
  - TanStack Query configuration
  - Axios client with JWT interceptors
  - Framer Motion integration

## Documentation

For detailed development guide, see:
- [Quickstart Guide](../specs/001-nextjs-frontend-auth/quickstart.md)
- [Implementation Plan](../specs/001-nextjs-frontend-auth/plan.md)
- [Task List](../specs/001-nextjs-frontend-auth/tasks.md)

## License

Private - Phase II Development Team
