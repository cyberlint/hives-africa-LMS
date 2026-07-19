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

  const organization = await prisma.organization.findFirst({
    where: {
      OR: [{ id: orgSlug }, { slug: orgSlug }],
    },
    select: {
      id: true,
      slug: true,
      creatorId: true,
    },
  });

  if (!organization) {
    redirect("/orgs");
  }

  const membership = await prisma.organizationMember.findFirst({
    where: {
      organizationId: organization.id,
      userId: user.id,
    },
  });

  const hasAccess = membership !== null || organization.creatorId === user.id;

  if (!hasAccess) {
    redirect("/403");
  }

  return <OrganizationShell orgSlug={organization.slug}>{children}</OrganizationShell>;
}