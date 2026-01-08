import "server-only";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./user";
import type { AuthUser } from "./types";

const DEFAULT_REDIRECT = "/signin";

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) redirect(DEFAULT_REDIRECT);
  return user;
}