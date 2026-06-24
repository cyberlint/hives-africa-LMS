// Organization-specific Hive actions

"use server";

import { prisma } from "@/lib/db";
import { requireOrganizationRole } from "@/lib/organization/require-organization-role";
import { revalidatePath } from "next/cache";

/**
 * ARCHIVE HIVE (soft delete)
 */
export async function archiveHiveAction(orgSlug: string, hiveId: string) {
  const context = await requireOrganizationRole(orgSlug, ["OWNER", "ADMIN"]);

  const hive = await prisma.hive.findFirst({
    where: {
      id: hiveId,
      organizationId: context.organization.id,
    },
  });

  if (!hive) {
    throw new Error("Hive not found");
  }

  const updated = await prisma.hive.update({
    where: { id: hiveId },
    data: {
      isArchived: true,
    },
  });

  revalidatePath(`/orgs/${orgSlug}/hives`);

  return updated;
}

/**
 * DELETE HIVE (hard delete)
 */
export async function deleteHiveAction(orgSlug: string, hiveId: string) {
  const context = await requireOrganizationRole(orgSlug, ["OWNER"]);

  const hive = await prisma.hive.findFirst({
    where: {
      id: hiveId,
      organizationId: context.organization.id,
    },
  });

  if (!hive) {
    throw new Error("Hive not found");
  }

  await prisma.hive.delete({
    where: { id: hiveId },
  });

  revalidatePath(`/orgs/${orgSlug}/hives`);

  return { success: true };
}