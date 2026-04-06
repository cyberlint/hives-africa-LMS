/*
  Warnings:

  - Added the required column `creatorId` to the `Hive` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Hive" ADD COLUMN     "creatorId" TEXT NOT NULL,
ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT false;
