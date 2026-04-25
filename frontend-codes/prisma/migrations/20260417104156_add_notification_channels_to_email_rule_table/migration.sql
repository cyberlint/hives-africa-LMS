-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('email', 'in_app', 'push');

-- AlterTable
ALTER TABLE "EmailRule" ADD COLUMN     "channel" "NotificationChannel" NOT NULL DEFAULT 'email';
