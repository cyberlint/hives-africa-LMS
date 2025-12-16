import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { adminRoutes, studentRoutes } from "@/routes";

function isAdminRoute(pathname: string): boolean {
    return adminRoutes.some(route => pathname.startsWith(route));
}

function isStudentRoute(pathname: string): boolean {
    return studentRoutes.some(route => pathname.startsWith(route));
}

export async function requireAuth(): Promise<{ user: { role: string; [key: string]: any } }>;
export async function requireAuth(pathname: string): Promise<{ user: { role: string; [key: string]: any } }>;
export async function requireAuth(pathname?: string): Promise<{ user: { role: string; [key: string]: any } }> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return redirect("/signin");
    }

    const userRole = session.user.role;
    
    if (!userRole) {
        return redirect("/signin");
    }

    if (pathname) {
        if (isAdminRoute(pathname) && userRole !== "admin") {
            return redirect("/signin");
        }

        if (isStudentRoute(pathname) && userRole !== "user") {
            return redirect("/signin");
        }
    }

    return { ...session, user: { ...session.user, role: userRole } };
}
