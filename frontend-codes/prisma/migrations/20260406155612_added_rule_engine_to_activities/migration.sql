-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "allowHive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "allowSolo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "maxHiveSize" INTEGER,
ADD COLUMN     "minHiveSize" INTEGER;
