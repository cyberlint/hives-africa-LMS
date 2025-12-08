// import { parse } from "cookie";
// import { NextRequest, NextResponse } from "next/server";
// import { authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes } from "./routes";

// export function middleware(request: NextRequest) {
//   const { nextUrl } = request;
//   const cookies = parse(request.headers.get("cookie") || "");
//   // const isLoggedIn = !!cookies.user ? !!cookies.user : !!cookies.access_token;
//   const isLoggedIn = !!cookies.user;
//   const isPublicRoute =
//     publicRoutes.includes(nextUrl.pathname) ||
//     nextUrl.pathname.startsWith("/accept-invite");
//   const isAuthRoute = authRoutes.includes(nextUrl.pathname);
//   const resetPasswordAuth = nextUrl.pathname.startsWith("/new-password");

//   if (isAuthRoute || resetPasswordAuth) {
//     if (isLoggedIn) {
//       const loginRedirect = new URL(DEFAULT_LOGIN_REDIRECT, nextUrl.origin);
//       const reference = nextUrl.searchParams.get("inviteReference");
//       if (reference) {
//         loginRedirect.searchParams.set("reference", reference);
//       }
//       return NextResponse.redirect(new URL(loginRedirect, nextUrl.origin));
//     }
//     return null;
//   }

//   if (!isLoggedIn && !isPublicRoute) {
//     const signInUrl = new URL("/signin", nextUrl.origin);
//     signInUrl.searchParams.set(
//       "callbackUrl",
//       nextUrl.pathname + nextUrl.search,
//     );
//     return NextResponse.redirect(signInUrl);
//   }

//   return null;
// }

// export const config = {
//   matcher: ["/((?!.+\\.[\\w]+$|_next).)", "/", "/(api|trpc)(.)"],
// };

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  // THIS IS NOT SECURE!
  // This is the recommended approach to optimistically redirect users
  // We recommend handling auth checks in each page/route
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs", // Required for auth.api calls
  matcher: ["/(private routes)/admin/:path*"], // Specify the routes the middleware applies to
};