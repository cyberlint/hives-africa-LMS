/*
  Warnings:

  - Added the required column `updatedAt` to the `EmailJob` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "EmailJob_status_idx";

-- DropIndex
DROP INDEX "EmailJob_userId_idx";

-- AlterTable
ALTER TABLE "EmailJob" ADD COLUMN     "attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastError" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
