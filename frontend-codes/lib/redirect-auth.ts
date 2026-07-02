import "server-only";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getRedirectPathFromReferer, getSafeRedirectPath } from "@/lib/auth-redirect";

export async function redirectIfAuthenticated(){
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList});
    if (session) {
        const redirectTo = getSafeRedirectPath(headersList.get("x-redirect-to") || getRedirectPathFromReferer(headersList.get("referer")));
        redirect(redirectTo);
    }
}