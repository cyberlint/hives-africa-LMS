-- AlterTable
ALTER TABLE "EmailJob" ADD COLUMN     "channel" "NotificationChannel" NOT NULL DEFAULT 'email';
