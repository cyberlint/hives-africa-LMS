import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function requireAuth() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return redirect("/signin");
    }
    if (session.user.role !== "user") {
        return redirect("/signin");
    }

    return session;
}
