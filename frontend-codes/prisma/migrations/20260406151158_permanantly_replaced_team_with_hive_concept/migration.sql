/*
  Warnings:

  - The values [TEAM_PROJECT] on the enum `ConnectionSource` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `teamId` on the `Participation` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the `Team` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeamMember` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ConnectionSource_new" AS ENUM ('HIVE_PROJECT', 'PEER_REVIEW', 'MENTORSHIP', 'BOUNTY_HELP');
ALTER TABLE "Connection" ALTER COLUMN "sourceType" TYPE "ConnectionSource_new" USING ("sourceType"::text::"ConnectionSource_new");
ALTER TYPE "ConnectionSource" RENAME TO "ConnectionSource_old";
ALTER TYPE "ConnectionSource_new" RENAME TO "ConnectionSource";
DROP TYPE "ConnectionSource_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Participation" DROP CONSTRAINT "Participation_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_activityId_fkey";

-- DropForeignKey
ALTER TABLE "TeamMember" DROP CONSTRAINT "TeamMember_teamId_fkey";

-- DropForeignKey
ALTER TABLE "TeamMember" DROP CONSTRAINT "TeamMember_userId_fkey";

-- AlterTable
ALTER TABLE "Participation" DROP COLUMN "teamId",
ADD COLUMN     "hiveId" TEXT;

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "teamId",
ADD COLUMN     "hiveId" TEXT;

-- DropTable
DROP TABLE "Team";

-- DropTable
DROP TABLE "TeamMember";

-- CreateTable
CREATE TABLE "HiveActivity" (
    "hiveId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HiveActivity_pkey" PRIMARY KEY ("hiveId","activityId")
);

-- CreateIndex
CREATE INDEX "Participation_hiveId_idx" ON "Participation"("hiveId");

-- CreateIndex
CREATE INDEX "Participation_userId_idx" ON "Participation"("userId");

-- CreateIndex
CREATE INDEX "Participation_activityId_idx" ON "Participation"("activityId");

-- AddForeignKey
ALTER TABLE "Participation" ADD CONSTRAINT "Participation_hiveId_fkey" FOREIGN KEY ("hiveId") REFERENCES "Hive"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_hiveId_fkey" FOREIGN KEY ("hiveId") REFERENCES "Hive"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HiveActivity" ADD CONSTRAINT "HiveActivity_hiveId_fkey" FOREIGN KEY ("hiveId") REFERENCES "Hive"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HiveActivity" ADD CONSTRAINT "HiveActivity_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
