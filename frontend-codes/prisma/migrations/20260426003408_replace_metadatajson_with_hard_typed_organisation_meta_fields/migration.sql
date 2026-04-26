/*
  Warnings:

  - You are about to drop the column `metadata` on the `Organization` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "OrgType" AS ENUM ('Bootcamp_Or_Academy', 'University_Or_School', 'Student_Chapter', 'Tech_Community', 'Open_Source_Foundation', 'Startup_Incubator', 'Corporate_L_And_D', 'Nonprofit_Initiative', 'Government_Program', 'Independent_Fellowship', 'Other');

-- CreateEnum
CREATE TYPE "OrgMission" AS ENUM ('Technical_Upskilling', 'Workforce_Readiness', 'Product_Incubation', 'Open_Innovation_And_Hackathons', 'Ecosystem_Building', 'Academic_Research', 'Internal_Corporate_Training');

-- CreateEnum
CREATE TYPE "OperatingModel" AS ENUM ('Strict_Cohort_Based', 'Self_Paced_Continuous', 'Apprenticeship_Driven', 'Event_Driven_Sprints', 'Community_Led_Mentorship');

-- CreateEnum
CREATE TYPE "CollaborationMode" AS ENUM ('Solo_Execution', 'Squad_Based', 'Open_Crowdsourced', 'Fluid_Hybrid');

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "metadata",
ADD COLUMN     "CollaborationMode" "CollaborationMode" NOT NULL DEFAULT 'Fluid_Hybrid',
ADD COLUMN     "OperatingModel" "OperatingModel" NOT NULL DEFAULT 'Event_Driven_Sprints',
ADD COLUMN     "missions" "OrgMission"[],
ADD COLUMN     "orgType" "OrgType" NOT NULL DEFAULT 'Bootcamp_Or_Academy';
