import { ReactNode } from "react"
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getCurrentUser } from "@/domains/auth/user";
import LearnerShell from "@/components/shells/LearnerShell";
import { buildLoginRedirect, getRedirectPathFromReferer } from "@/lib/auth-redirect";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  const headersList = await headers();
  const referer = headersList.get("referer");

  // This ensures that even if they are logged in, they must have one of your two recognized roles.
 if (!user || (user.role !== "user" && user.role !== "admin")) {
    redirect(buildLoginRedirect(getRedirectPathFromReferer(referer)));
}

  if (user.role === "admin") {
    redirect("/admin");
  }

  return (
    <LearnerShell>
      {children}
    </LearnerShell>
  );
}
