-- CreateTable
CREATE TABLE "HiveMessage" (
    "id" TEXT NOT NULL,
    "hiveId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "proposalId" TEXT,

    CONSTRAINT "HiveMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HiveMessage_hiveId_idx" ON "HiveMessage"("hiveId");

-- CreateIndex
CREATE INDEX "HiveMessage_createdAt_idx" ON "HiveMessage"("createdAt");

-- AddForeignKey
ALTER TABLE "HiveMessage" ADD CONSTRAINT "HiveMessage_hiveId_fkey" FOREIGN KEY ("hiveId") REFERENCES "Hive"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HiveMessage" ADD CONSTRAINT "HiveMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HiveMessage" ADD CONSTRAINT "HiveMessage_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
