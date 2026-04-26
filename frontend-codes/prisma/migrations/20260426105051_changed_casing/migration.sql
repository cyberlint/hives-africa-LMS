/*
  Warnings:

  - You are about to drop the column `CollaborationMode` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `OperatingModel` on the `Organization` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "CollaborationMode",
DROP COLUMN "OperatingModel",
ADD COLUMN     "collaborationMode" "CollaborationMode" NOT NULL DEFAULT 'Fluid_Hybrid',
ADD COLUMN     "operatingModel" "OperatingModel" NOT NULL DEFAULT 'Event_Driven_Sprints';
