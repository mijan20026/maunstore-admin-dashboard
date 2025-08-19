import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Paths that don't require login
const PUBLIC_PATHS = ["/login", "/api"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check token from cookies
  const token = req.cookies.get("token")?.value;

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login"; // redirect to login if no token
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Apply middleware to all routes except _next and favicon
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
