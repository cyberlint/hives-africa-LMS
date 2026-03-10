-- AlterTable
ALTER TABLE "user" ADD COLUMN     "careerInterests" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "hasCompletedOnboarding" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "jobTitle" TEXT,
ADD COLUMN     "learningIntent" TEXT,
ADD COLUMN     "localLanguage" TEXT,
ADD COLUMN     "primaryLanguage" TEXT NOT NULL DEFAULT 'English';
