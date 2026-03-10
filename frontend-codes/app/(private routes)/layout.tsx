import { ReactNode } from "react";
import { requireAuth } from "@/domains/auth/require-auth";
import { prisma } from "@/lib/db";
import OnboardingFlow from "@/components/onboarding-flow";

export default async function PrivateRoutesLayout({ children }: { children: ReactNode }) {
  const user = await requireAuth(); 
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { hasCompletedOnboarding: true },
  });

  if (!dbUser?.hasCompletedOnboarding) {
    return <OnboardingFlow />;
  }
  return <>{children}</>;
}