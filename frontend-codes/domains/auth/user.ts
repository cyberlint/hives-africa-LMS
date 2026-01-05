import "server-only";
import { auth } from "@/lib/auth";
import type { AuthUser } from "./types";
import { headers } from "next/headers";

export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  return {
    id: session.user.id,
    role: session.user.role as "user" | "admin",
    name: session.user.name ?? undefined,   // normalize null to undefined
    image: session.user.image ?? undefined, // normalize null to undefined
    banned: session.user.banned ?? undefined,
  };
}
