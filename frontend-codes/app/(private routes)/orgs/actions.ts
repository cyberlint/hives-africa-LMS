"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth } from "@/domains/auth/require-auth";

// 👇 Simply import your exact schema and type from your validation file
import { 
  CreateOrganizationSchema, 
  type CreateOrganizationInput 
} from "@/lib/zodSchemas";

export async function createOrganization(input: CreateOrganizationInput) {
  const user = await requireAuth();

  // 1. Validate against your imported Zod Schema
  const parsed = CreateOrganizationSchema.safeParse(input);
  
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0].message);
  }
  
  const { name, website, logoUrl, orgType, missions, operatingModel, collaborationMode } = parsed.data;

  // 2. Slug generation
  let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  const existing = await prisma.organization.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
  }

  // 3. Database Execution
const org = await prisma.organization.create({
  data: {
    name,
    slug,
    website: website === "" ? null : website,
    logoUrl: logoUrl === "" ? null : logoUrl,
    orgType,
    missions,
    operatingModel,
    collaborationMode,
    creatorId: user.id,
    members: {
      create: {
        userId: user.id,
        role: "OWNER",
      },
    },
  },
});

  revalidatePath("/orgs");
  redirect(`/orgs/${org.slug}`);
}

export async function getOrganizationDashboard(slug: string) {
  // Fetch the org, its members count, and its connected Hives
  const org = await prisma.organization.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { members: true },
      },
      hives: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          createdAt: true,
        }
      }
    },
  });

  if (!org) return null;
  return org;
}