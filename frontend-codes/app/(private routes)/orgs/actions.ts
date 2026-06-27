"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth } from "@/domains/auth/require-auth";

import {
  CreateOrganizationSchema,
  type CreateOrganizationInput,
} from "@/lib/zodSchemas";

async function generateUniqueSlug(name: string) {
  let slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const baseSlug = slug;
  let counter = 2;

  while (
    await prisma.organization.findUnique({
      where: { slug },
    })
  ) {
    slug = `${baseSlug}-${counter++}`;
  }

  return slug;
}

export async function createOrganization(input: CreateOrganizationInput) {
  const user = await requireAuth();

  const parsed = CreateOrganizationSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(parsed.error.errors[0].message);
  }

  const {
    name,
    website,
    logoUrl,
    orgType,
    missions,
  } = parsed.data;

  const slug = await generateUniqueSlug(name);

  const organization = await prisma.organization.create({
    data: {
      name,
      slug,

      website: website || null,
      logoUrl: logoUrl || null,

      creatorId: user.id,

      orgType,
      missions,

      members: {
        create: {
          userId: user.id,
          role: "OWNER",
        },
      },
    },
  });

  revalidatePath("/orgs");

  redirect(`/orgs/${organization.slug}`);
}