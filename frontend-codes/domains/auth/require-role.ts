import { redirect } from "next/navigation";
import type { AuthUser } from "./types";
import { requireAuth } from "./require-auth";

export async function requireAdmin(
  redirectTo = "/home"
): Promise<AuthUser> {
  const user = await requireAuth();

  if (user.role !== "admin") {
    redirect(redirectTo);
  }

  return user;
}
