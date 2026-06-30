-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('Course', 'Program', 'Bootcamp', 'Event', 'Enrollment', 'Subscription', 'Other');

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "itemId" TEXT,
ADD COLUMN     "itemType" "ItemType",
ALTER COLUMN "courseId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "userType" SET DEFAULT 'INDIVIDUAL';

-- CreateIndex
CREATE INDEX "Payment_itemType_itemId_idx" ON "Payment"("itemType", "itemId");
