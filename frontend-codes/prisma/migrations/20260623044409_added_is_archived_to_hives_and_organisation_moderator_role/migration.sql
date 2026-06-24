-- CreateEnum
CREATE TYPE "LeadStage" AS ENUM ('INITIATED', 'PAYMENT_STARTED', 'PAYMENT_COMPLETED', 'ACTIVATED', 'DROPPED');

-- AlterEnum
ALTER TYPE "OrgRole" ADD VALUE 'MODERATOR';

-- AlterTable
ALTER TABLE "Hive" ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "stage" "LeadStage" NOT NULL DEFAULT 'INITIATED',
    "source" TEXT,
    "campaign" TEXT,
    "eventSlug" TEXT,
    "hasAccount" BOOLEAN NOT NULL DEFAULT false,
    "convertedToUser" BOOLEAN NOT NULL DEFAULT false,
    "paymentReference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);
