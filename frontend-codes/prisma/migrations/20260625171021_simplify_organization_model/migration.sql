/*
  Warnings:

  - The values [Open_Innovation_And_Hackathons] on the enum `OrgMission` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `collaborationMode` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `operatingModel` on the `Organization` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('INDIVIDUAL', 'ORGANIZATION');

-- AlterEnum
BEGIN;
CREATE TYPE "OrgMission_new" AS ENUM ('Technical_Upskilling', 'Workforce_Readiness', 'Product_Incubation', 'Open_Innovation', 'Ecosystem_Building', 'Academic_Research', 'Internal_Corporate_Training', 'Other');
ALTER TABLE "Organization" ALTER COLUMN "missions" TYPE "OrgMission_new"[] USING ("missions"::text::"OrgMission_new"[]);
ALTER TYPE "OrgMission" RENAME TO "OrgMission_old";
ALTER TYPE "OrgMission_new" RENAME TO "OrgMission";
DROP TYPE "OrgMission_old";
COMMIT;

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "collaborationMode",
DROP COLUMN "operatingModel",
ALTER COLUMN "orgType" DROP DEFAULT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "userType" "UserType";

-- DropEnum
DROP TYPE "CollaborationMode";

-- DropEnum
DROP TYPE "OperatingModel";

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "primaryLanguage" TEXT,
    "localLanguage" TEXT,
    "jobTitle" TEXT,
    "careerInterests" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "learningIntent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OnboardingSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userType" "UserType" NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "OnboardingSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE INDEX "OnboardingSession_userId_idx" ON "OnboardingSession"("userId");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnboardingSession" ADD CONSTRAINT "OnboardingSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
