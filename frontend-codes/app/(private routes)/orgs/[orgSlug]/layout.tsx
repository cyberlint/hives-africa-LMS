import { ReactNode } from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/domains/auth/user"
import { OrganizationShell } from "@/components/shells/OrganizationShell"

export default async function OrganizationLayout({
  children,
  params,
}: {
  children: ReactNode
  params: { orgSlug: string }
}) {
  const user = await getCurrentUser();

  if (!user || (user.role !== "user" && user.role !== "admin")) {
    redirect("/signin");
  }

  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  return <OrganizationShell orgSlug={params.orgSlug}>{children}</OrganizationShell>;
}