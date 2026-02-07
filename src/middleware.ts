import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")

    // Check for admin access
    if (isAdminRoute && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/learn/:path*",
    "/practice/:path*",
    "/exam/:path*",
    "/admin/:path*",
    "/settings/:path*",
    "/profile/:path*",
    "/achievements/:path*",
    "/leaderboard/:path*",
    "/skills/:path*",
  ],
}
