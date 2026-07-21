import "server-only";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getRedirectPathFromReferer, getSafeRedirectPath } from "@/lib/auth-redirect";

export async function redirectIfAuthenticated(){
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList});
    const xRedirectTo = headersList.get("x-redirect-to");
    const referer = headersList.get("referer");
    const redirectTo = session ? getSafeRedirectPath(xRedirectTo || getRedirectPathFromReferer(referer)) : null;
    if (session) {
        redirect(redirectTo!);
    }
}