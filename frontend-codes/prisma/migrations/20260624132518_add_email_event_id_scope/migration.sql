/*
  Warnings:

  - A unique constraint covering the columns `[eventId,email]` on the table `EventRegistration` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EventRegistration_eventId_email_key" ON "EventRegistration"("eventId", "email");
