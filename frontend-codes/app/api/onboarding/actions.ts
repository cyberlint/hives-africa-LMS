"use server";

import { prisma } from '@/lib/db';
import { requireAuth } from '@/domains/auth/require-auth';
import { revalidatePath } from 'next/cache';

type OnboardingData = {
  primaryLanguage: string;
  localLanguage: string;
  jobTitle: string;
  careerInterests: string[];
  learningIntent: string;
};

export async function completeOnboardingAction(data: OnboardingData) {
  const session = await requireAuth();

  try {
    // Validate Payload
    if (!data.jobTitle || data.careerInterests.length < 2 || !data.learningIntent) {
      return { success: false, error: "Missing required onboarding fields." };
    }

    // Update the User Record
    await prisma.user.update({
      where: { id: session.id },
      data: {
        hasCompletedOnboarding: true,
        primaryLanguage: data.primaryLanguage,
        localLanguage: data.localLanguage || null,
        jobTitle: data.jobTitle,
        careerInterests: data.careerInterests,
        learningIntent: data.learningIntent,
      },
    });

    // Clear the cache so the dashboard layout re-renders without the onboarding overlay
    revalidatePath("/dashboard", "layout");

    return { success: true };
    
  } catch (error) {
    console.error("Failed to complete onboarding:", error);
    return { success: false, error: "Internal server error" };
  }
}