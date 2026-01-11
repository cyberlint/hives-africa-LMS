import { ReactNode } from "react";
import { requireAuth } from "@/domains/auth/require-auth";
import { AdminShell } from "@/components/shells/AdminShell";
import LearnerShell from "@/components/shells/LearnerShell";

export default async function PrivateRoutesLayout({ children }: { children: ReactNode }) {
  await requireAuth(); // returns AuthUser or redirects

  return <>{children}</>;
}