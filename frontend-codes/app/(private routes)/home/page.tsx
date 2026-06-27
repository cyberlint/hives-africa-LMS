// This page is the central router that redirects users to other sections of the app after they've been cleared by the middleware.

import { requireAuth } from "@/domains/auth/require-auth";
import { redirect } from "next/navigation" 
import {prisma} from "lib/db"

export default async function HomePage() {
    const user = await requireAuth();

    if (user.role === "admin") {
        redirect("/admin");
    }

    const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
            userType: true,
        },
    });

    if (dbUser?.userType === "ORGANIZATION") {
        redirect("/orgs");
    }

    redirect("/dashboard");
}