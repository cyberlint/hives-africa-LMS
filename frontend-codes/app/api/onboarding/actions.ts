"use server";

import { OrgMission, OrgType } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/domains/auth/require-auth";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

type OnboardingData = {
  userType: "INDIVIDUAL" | "ORGANIZATION";

  jobTitle?: string;
  careerInterests?: string[];
  learningIntent?: string;

  organizationName?: string;
  organizationType?: string;
  organizationMission?: string;
};

async function generateUniqueSlug(name: string) {
  const baseSlug = slugify(name, {
    lower: true,
    strict: true,
    trim: true,
  });

  let slug = baseSlug;
  let counter = 2;

  while (
    await prisma.organization.findUnique({
      where: { slug },
      select: { id: true },
    })
  ) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

export async function completeOnboardingAction(
  data: OnboardingData
) {
  const session = await requireAuth();

  try {
    /**
     * Validation
     */
    if (data.userType === "INDIVIDUAL") {
      if (
        !data.jobTitle ||
        !data.careerInterests ||
        data.careerInterests.length < 2 ||
        !data.learningIntent
      ) {
        return {
          success: false,
          error: "Missing required onboarding fields.",
        };
      }
    }

    if (data.userType === "ORGANIZATION") {
      if (
        !data.organizationName ||
        !data.organizationType ||
        !data.organizationMission
      ) {
        return {
          success: false,
          error: "Missing required onboarding fields.",
        };
      }
    }

    await prisma.$transaction(async (tx) => {
      /**
       * Organization Flow
       */
      if (data.userType === "ORGANIZATION") {
        const slug = await generateUniqueSlug(
          data.organizationName!
        );

        const organization = await tx.organization.create({
          data: {
            name: data.organizationName!,
            slug,
            creatorId: session.id,
            orgType: data.organizationType as OrgType,
            missions: [data.organizationMission as OrgMission],
          },
        });

        await tx.organizationMember.create({
          data: {
            organizationId: organization.id,
            userId: session.id,
            role: "OWNER",
          },
        });
      }

      /**
       * Individual Flow
       */
      if (data.userType === "INDIVIDUAL") {
        await tx.userProfile.upsert({
          where: {
            userId: session.id,
          },
          update: {
            jobTitle: data.jobTitle,
            careerInterests: data.careerInterests,
            learningIntent: data.learningIntent,
          },
          create: {
            userId: session.id,
            jobTitle: data.jobTitle!,
            careerInterests: data.careerInterests!,
            learningIntent: data.learningIntent!,
          },
        });
      }

      /**
       * Complete onboarding
       */
      await tx.user.update({
        where: {
          id: session.id,
        },
        data: {
          hasCompletedOnboarding: true,
          userType: data.userType,
        },
      });
    });

    revalidatePath("/dashboard", "layout");

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "Failed to complete onboarding:",
      error
    );

    return {
      success: false,
      error: "Internal server error",
    };
  }
}