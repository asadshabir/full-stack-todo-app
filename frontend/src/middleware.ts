import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Authentication Middleware
 *
 * Protects routes by checking for Better Auth session
 * Redirects unauthenticated users to /signin
 */

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if user is accessing a protected route
  if (pathname.startsWith("/dashboard")) {
    // Check for JWT access token in cookie
    const accessToken = request.cookies.get("access_token")

    if (!accessToken) {
      // No session found, redirect to sign-in
      const signInUrl = new URL("/signin", request.url)
      signInUrl.searchParams.set("from", pathname)
      return NextResponse.redirect(signInUrl)
    }
  }

  // Allow request to continue
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
