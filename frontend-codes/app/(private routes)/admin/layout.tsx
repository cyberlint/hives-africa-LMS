import { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/domains/auth/user";
import { AdminShell } from "@/components/shells/AdminShell";
import { buildLoginRedirect, getRedirectPathFromReferer } from "@/lib/auth-redirect";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  const headersList = await headers();
  const referer = headersList.get("referer");

  if (!user || (user.role !== "user" && user.role !== "admin")) {
    redirect(buildLoginRedirect(getRedirectPathFromReferer(referer)));
  }

  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  return <AdminShell>{children}</AdminShell>;
}