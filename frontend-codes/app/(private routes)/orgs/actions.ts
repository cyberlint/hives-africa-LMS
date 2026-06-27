"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth } from "@/domains/auth/require-auth";
import slugify from "slugify"

import {
  CreateOrganizationSchema,
  type CreateOrganizationInput,
} from "@/lib/zodSchemas";

async function generateUniqueSlug(name: string) {
  const baseSlug = slugify(name);
  
  let slug = baseSlug;
  let counter = 2;

  while (
    await prisma.organization.findUnique({
      where: { slug },
      select: { id: true },
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

  // Generate unique slug
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