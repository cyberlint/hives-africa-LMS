"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth } from "@/domains/auth/require-auth";

import { createOrganization as createOrganizationService } from "@/lib/organization/create-organization";

import {
  CreateOrganizationSchema,
  type CreateOrganizationInput,
} from "@/lib/zodSchemas";

export async function createOrganization(input: CreateOrganizationInput) {
  const user = await requireAuth();

  const parsed = CreateOrganizationSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(parsed.error.errors[0].message);
  }

  const organization = await createOrganizationService({
    creatorId: user.id,
    ...parsed.data,
  });

  revalidatePath("/orgs");

  redirect(`/orgs/${organization.slug}`);
}

export async function getOrganizationDashboard(slug: string) {
  return prisma.organization.findUnique({
    where: { slug },
    include: {
      _count: {
        select: {
          members: true,
          hives: true,
        },
      },
      hives: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          createdAt: true,
        },
      },
    },
  });
}