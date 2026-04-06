/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Hive` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Hive` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "HiveRole" ADD VALUE 'ADMIN';

-- AlterTable
ALTER TABLE "Hive" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Hive_slug_key" ON "Hive"("slug");
