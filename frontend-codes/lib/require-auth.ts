import "server-only";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import {
    adminPrefix,
    studentPrefix,
    LOGIN_URL,
    DEFAULT_ADMIN_LOGIN_REDIRECT,
    DEFAULT_LOGIN_REDIRECT
} from "@/routes";

function isAdminRoute(pathname: string): boolean {
    return pathname.startsWith(adminPrefix);
}

function isStudentRoute(pathname: string): boolean {
    return pathname.startsWith(studentPrefix);
}

export async function requireAuth(): Promise<{ user: { role: string;[key: string]: any } }>;
export async function requireAuth(pathname: string): Promise<{ user: { role: string;[key: string]: any } }>;
export async function requireAuth(pathname?: string): Promise<{ user: { role: string;[key: string]: any } }> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return redirect(LOGIN_URL);
    }

    const userRole = session.user.role;

    if (!userRole) {
        return redirect(LOGIN_URL);
    }

    if (pathname) {
        if (isAdminRoute(pathname) && userRole !== "admin") {
            // User is trying to access admin route but is not admin. Redirect to student dashboard.
            return redirect(DEFAULT_LOGIN_REDIRECT);
        }

        if (isStudentRoute(pathname) && userRole !== "user") {
            // User is trying to access student route but is not user (e.g. admin). Redirect to admin dashboard.
            return redirect(DEFAULT_ADMIN_LOGIN_REDIRECT);
        }
    }

    return { ...session, user: { ...session.user, role: userRole } };
}
