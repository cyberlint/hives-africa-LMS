import "server-only";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/require-auth";

class OrganizationAccessError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrganizationAccessError";
  }
}

export async function getOrganizationContext(orgSlug: string) {
  const session = await requireAuth();

  // 1. Get organization first
  const organization = await prisma.organization.findUnique({
    where: { slug: orgSlug },
  });

  if (!organization) {
    throw new OrganizationAccessError("Organization not found");
  }

  // 2. Get membership using organizationId
  const membership = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId: organization.id,
        userId: session.user.id,
      },
    },
  });

  if (!membership) {
    throw new OrganizationAccessError("User is not a member of this organization");
  }

  return {
    user: session.user,
    organization,
    membership,
  };
}