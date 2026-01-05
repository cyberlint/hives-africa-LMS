import { ReactNode } from "react";
import { requireAuth } from "@/domains/auth/require-auth";
import { AdminShell } from "@/components/shells/AdminShell";
import LearnerShell from "@/components/shells/LearnerShell";

export default async function PrivateRoutesLayout({ children }: { children: ReactNode }) {
  const user = await requireAuth(); // returns AuthUser or redirects

  // Choose layout depending on role
  if (user.role === "admin") {
    return <AdminShell>
      {children}
      </AdminShell>;
  } else {
    return <LearnerShell>
      {children}
      </LearnerShell>;
  }
}