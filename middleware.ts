import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// List of paths that don't require authentication
const publicPaths = ["/", "/login", "/register", "/learn"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is public
  if (publicPaths.some(path => pathname === path || pathname.startsWith(`${path}/`))) {
    return NextResponse.next();
  }
  
  // Check for authentication token
  const token = request.cookies.get("token")?.value;
  
  if (!token) {
    // Redirect to login if no token is present
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", encodeURI(pathname));
    return NextResponse.redirect(url);
  }
  
  try {
    // Verify token
    const decoded = verify(token, JWT_SECRET) as {
      userId: string;
      role: string;
    };
    
    // Check admin access for admin routes
    if (pathname.startsWith("/admin") && decoded.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    
    return NextResponse.next();
  } catch (error) {
    // Token is invalid, redirect to login
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", encodeURI(pathname));
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
};