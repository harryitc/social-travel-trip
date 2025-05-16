import { NextResponse, NextRequest } from "next/server";
import { AUTH } from "./config/environment";
import { CookieConfigKeys } from "./config/app-storage/cookie.config";

// List of public routes
const publicRoutes = [
  AUTH.login_route,
  "/about",
  "/contact",
  "/",
];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // const token = request.cookies.get(CookieConfigKeys.features.auth.token);

  // const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname.startsWith(route));

  // if (!token?.value && !isPublicRoute) {
  //   const redirectUrl = new URL(AUTH.login_route, request.url);
  //   redirectUrl.searchParams.set('redirect', request.nextUrl.pathname + request.nextUrl.search);
  //   return NextResponse.redirect(redirectUrl);
  // }

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
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
