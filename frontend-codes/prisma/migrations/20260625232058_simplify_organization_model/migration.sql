/*
  Warnings:

  - The values [Technical_Upskilling,Workforce_Readiness,Product_Incubation,Open_Innovation,Ecosystem_Building,Academic_Research,Internal_Corporate_Training,Other] on the enum `OrgMission` will be removed. If these variants are still used in the database, this will fail.
  - The values [Bootcamp_Or_Academy,University_Or_School,Student_Chapter,Tech_Community,Open_Source_Foundation,Startup_Incubator,Corporate_L_And_D,Nonprofit_Initiative,Government_Program,Independent_Fellowship,Other] on the enum `OrgType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrgMission_new" AS ENUM ('OPEN_INNOVATION', 'TALENT_DEVELOPMENT', 'COMMUNITY_BUILDING', 'PRODUCT_INCUBATION', 'WORKFORCE_READINESS', 'OTHER');
ALTER TABLE "Organization" ALTER COLUMN "missions" TYPE "OrgMission_new"[] USING ("missions"::text::"OrgMission_new"[]);
ALTER TYPE "OrgMission" RENAME TO "OrgMission_old";
ALTER TYPE "OrgMission_new" RENAME TO "OrgMission";
DROP TYPE "OrgMission_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "OrgType_new" AS ENUM ('INNOVATION_CHALLENGE', 'FELLOWSHIP', 'BOOTCAMP', 'UNIVERSITY', 'COMMUNITY', 'INCUBATOR', 'CORPORATE_LEARNING', 'OTHER');
ALTER TABLE "Organization" ALTER COLUMN "orgType" TYPE "OrgType_new" USING ("orgType"::text::"OrgType_new");
ALTER TYPE "OrgType" RENAME TO "OrgType_old";
ALTER TYPE "OrgType_new" RENAME TO "OrgType";
DROP TYPE "OrgType_old";
COMMIT;
