import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Authentication Middleware
 *
 * Note: Since we use localStorage for JWT tokens (cross-origin from Hugging Face),
 * we can't check auth in middleware (server-side). Auth is handled client-side
 * in the useAuth hook and dashboard components.
 *
 * This middleware just passes through all requests.
 */

export async function middleware(request: NextRequest) {
  // Allow all requests - auth is handled client-side
  return NextResponse.next()
}

/**
 * Configure which routes the middleware runs on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - API routes and internal Next.js routes
     * - Static assets
     * - Public assets
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}
