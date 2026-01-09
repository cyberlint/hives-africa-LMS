"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { AuthUser } from "./types";

type UseRequireAuthOptions = {
  redirectTo?: string;
};

/**
 * Enforces authentication on the client.
 * Redirects if user is not present.
 */
export function useRequireAuth(
  user: AuthUser | null | undefined,
  options: UseRequireAuthOptions = {}
) {
  const router = useRouter();
  const { redirectTo = "/signin" } = options;

  useEffect(() => {
    if (user === null) {
      router.replace(redirectTo);
    }
  }, [user, redirectTo, router]);
}