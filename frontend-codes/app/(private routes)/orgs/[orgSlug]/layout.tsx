import { ReactNode } from "react"
import { redirect } from "next/navigation"
import { prisma } from "lib/db"
import { OrganizationShell } from "@/components/shells/OrganizationShell"
import { requireAuth } from "@/domains/auth/require-auth"

export default async function OrganizationLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ orgSlug: string }>
}) {  
  const { orgSlug } = await params;
  const user = await requireAuth();

  const membership = await prisma.organizationMember.findFirst({
    where: {
        userId: user.id,
        organization: {
            slug: orgSlug,
        },
    },
});

if (!membership) {
    redirect("/orgs");
}

  return <OrganizationShell orgSlug={orgSlug}>{children}</OrganizationShell>;
}