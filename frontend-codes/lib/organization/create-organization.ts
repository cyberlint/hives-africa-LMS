import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/db";
import slugify from "slugify";

type DbClient = Prisma.TransactionClient | PrismaClient;

type CreateOrganizationParams = {
  creatorId: string;
  name: string;
  website?: string | null;
  logoUrl?: string | null;
  orgType: any;
  missions: any[];

  db?: DbClient;
};

async function generateUniqueSlug(
  db: DbClient,
  name: string
) {
  const baseSlug = slugify(name, {
    lower: true,
    strict: true,
    trim: true,
  });

  let slug = baseSlug;
  let counter = 2;

  while (
    await db.organization.findUnique({
      where: { slug },
      select: { id: true },
    })
  ) {
    slug = `${baseSlug}-${counter++}`;
  }

  return slug;
}

export async function createOrganization({
  creatorId,
  name,
  website,
  logoUrl,
  orgType,
  missions,
  db = prisma,
}: CreateOrganizationParams) {
  const slug = await generateUniqueSlug(db, name);

  return db.organization.create({
    data: {
      name,
      slug,

      website: website || null,
      logoUrl: logoUrl || null,

      creatorId,

      orgType,
      missions,

      members: {
        create: {
          userId: creatorId,
          role: "OWNER",
        },
      },
    },
  });
}