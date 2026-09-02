import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./features/auth/lib/token";

const protectedRoutes = ["/account", "/seller", "/admin"];

const authRoutes = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

const verifyEmailRoute = "/verify-email";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Inject current pathname + search params into request headers so server components can read it
  const requestHeaders = new Headers(request.headers);
  const fullPath = pathname + request.nextUrl.search;
  requestHeaders.set("x-pathname", fullPath);

  const isProtectedRoute = protectedRoutes.some(
    (route) => route === pathname || pathname.startsWith(`${route}/`),
  );

  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const isVerifyEmailRoute = pathname === verifyEmailRoute;

  if (!isProtectedRoute && !isAuthRoute && !isVerifyEmailRoute) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const token = request.cookies.get("session")?.value;

  const session = await verifyToken(token);

  const isAuthenticated = !!session?.sessionId;
  const isVerified = !!session?.isVerified;

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set(
      "redirectTo",
      `${pathname}${request.nextUrl.search}`,
    );

    return NextResponse.redirect(loginUrl);
  }

  if (isProtectedRoute && isAuthenticated && !isVerified) {
    return NextResponse.redirect(new URL("/verify-email", request.url));
  }

  if (isAuthRoute && isAuthenticated && isVerified) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (isAuthRoute && isAuthenticated && !isVerified) {
    return NextResponse.redirect(new URL("/verify-email", request.url));
  }

  if (isVerifyEmailRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (isVerified) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
