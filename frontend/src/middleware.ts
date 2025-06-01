import { NextResponse, NextRequest } from 'next/server';
import { AUTH } from './config/environment';
import { CookieConfigKeys } from './config/app-storage/cookie.config';

/**
 * List of public routes that don't require authentication
 */
const publicRoutes = [
  AUTH.login_route,
  AUTH.register_route,
  AUTH.reset_password,
];

/**
 * Middleware function to handle authentication
 * Redirects to login page if user is not authenticated and trying to access a protected route
 */
export function middleware(request: NextRequest) {
  // Get authentication token from cookies
  const token = request.cookies.get(CookieConfigKeys.features.auth.token);

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // If no token and not a public route, redirect to login
  if (!token?.value && !isPublicRoute) {
    // Create redirect URL with original destination as query parameter
    const redirectUrl = new URL(AUTH.login_route, request.url);

    // Thêm đường dẫn hiện tại vào tham số redirect
    const currentPath = request.nextUrl.pathname + request.nextUrl.search;
    redirectUrl.searchParams.set('redirect', currentPath);

    console.log(`Redirecting unauthenticated user from ${currentPath} to login page`);
    return NextResponse.redirect(redirectUrl);
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
