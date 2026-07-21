import { ReactNode } from "react"
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getCurrentUser } from "@/domains/auth/user";
import LearnerShell from "@/components/shells/LearnerShell";
import { buildLoginRedirect, getRedirectPathFromReferer, getSafeRedirectPath } from "@/lib/auth-redirect";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  const headersList = await headers();
  const referer = headersList.get("referer");
  const xRedirectTo = headersList.get("x-redirect-to");

  if (!user || (user.role !== "user" && user.role !== "admin")) {
    const redirectTarget = xRedirectTo
      ? getSafeRedirectPath(xRedirectTo)
      : getRedirectPathFromReferer(referer);
    const loginRedirect = buildLoginRedirect(redirectTarget);
    redirect(loginRedirect);
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