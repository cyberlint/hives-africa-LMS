import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./user";
import type { AuthUser } from "./types";
import { buildLoginRedirect, getRedirectPathFromReferer } from "@/lib/auth-redirect";

const DEFAULT_REDIRECT = "/signin";

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    const headersList = await headers();
    const referer = headersList.get("referer");
    const redirectTo = getRedirectPathFromReferer(referer);
    redirect(buildLoginRedirect(redirectTo));
  }
  return user;
}