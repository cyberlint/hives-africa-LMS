// lib/redirect-if-authenticated.ts
import "server-only";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DEFAULT_ADMIN_LOGIN_REDIRECT, DEFAULT_LOGIN_REDIRECT } from "@/routes";

export async function redirectIfAuthenticated() {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });

    if (session) {
        const role = session.user.role as "admin" | "user";
        redirect(role === "admin" ? DEFAULT_ADMIN_LOGIN_REDIRECT : DEFAULT_LOGIN_REDIRECT);
    }
}