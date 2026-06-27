import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
    authRoutes,
    DEFAULT_LOGIN_REDIRECT,
    DEFAULT_ADMIN_LOGIN_REDIRECT,
    publicRoutes,
} from "./routes";

export async function middleware(request: NextRequest){
    const { nextUrl } = request;
    const session = await auth.api.getSession({
        headers: await headers()
    })
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    if (session && isAuthRoute) {
        return NextResponse.redirect(
            new URL("/home", nextUrl.origin)
        )
    }
}

// export async function middleware(request: NextRequest) {
//     const { nextUrl } = request;
//     const session = await auth.api.getSession({
//         headers: await headers()
//     })
//     console.log(session)
//     const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
//     const isAuthRoute = authRoutes.includes(nextUrl.pathname);
//     const isAdminRoute = nextUrl.pathname.startsWith("/admin");
//     const isStudentRoute = nextUrl.pathname.startsWith("/dashboard");

//     if (isAuthRoute) {
//         if (session) {
//             if (session.user.role === "admin") {
//                 return NextResponse.redirect(
//                     new URL(DEFAULT_ADMIN_LOGIN_REDIRECT, nextUrl.origin)
//                 );
//             }
//             return NextResponse.redirect(
//                 new URL(DEFAULT_LOGIN_REDIRECT, nextUrl.origin)
//             );
//         }
//         return null;
//     }

//     if (!session && !isPublicRoute) {
//         const signInUrl = new URL("/signin", nextUrl.origin);
//         signInUrl.searchParams.set("callbackUrl", nextUrl.router.push(router.push(pathname + nextUrl.search);
//         return NextResponse.redirect(signInUrl);
//     }

//     if (session && session.user.role) {
//         if (isAdminRoute && session.user.role !== "admin") {
//             return NextResponse.redirect(
//                 new URL(DEFAULT_LOGIN_REDIRECT, nextUrl.origin)
//             );
//         }
//         if (isStudentRoute && session.user.role !== "user") {
//             return NextResponse.redirect(
//                 new URL(DEFAULT_ADMIN_LOGIN_REDIRECT, nextUrl.origin)
//             );
//         }
//     }

//     return null;
// }

// export const config = {
//     //  runtime: "nodejs",
//     runtime: "bun",
//     matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
// };