-- CreateEnum
CREATE TYPE "SplitStatus" AS ENUM ('PENDING', 'APPROVED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "SignalType" AS ENUM ('DISCUSSION', 'SHOWCASE', 'MILESTONE', 'FIELD_NOTES', 'HELP_NEEDED');

-- CreateEnum
CREATE TYPE "SparkType" AS ENUM ('INSIGHTFUL', 'HELPFUL', 'BRILLIANT');

-- CreateEnum
CREATE TYPE "BountyStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'AWARDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ConnectionSource" AS ENUM ('TEAM_PROJECT', 'PEER_REVIEW', 'MENTORSHIP', 'BOUNTY_HELP');

-- CreateEnum
CREATE TYPE "HiveRole" AS ENUM ('FOUNDER', 'LEAD', 'MEMBER');

-- CreateEnum
CREATE TYPE "ProposalType" AS ENUM ('LEADERSHIP_VOTE', 'IMPEACHMENT', 'MEMBER_EXPULSION', 'POLICY_CHANGE');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('ACTIVE', 'PASSED', 'FAILED', 'EXECUTED');

-- CreateEnum
CREATE TYPE "VoteChoice" AS ENUM ('FOR', 'AGAINST', 'ABSTAIN');

-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "verificationUrl" TEXT;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "verification" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "SubmissionRoster" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "claimedShare" DOUBLE PRECISION NOT NULL,
    "approvalStatus" "SplitStatus" NOT NULL DEFAULT 'PENDING',
    "verifiedMetrics" JSONB,

    CONSTRAINT "SubmissionRoster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Signal" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "SignalType" NOT NULL DEFAULT 'DISCUSSION',
    "activityId" TEXT,
    "ksbId" TEXT,
    "portfolioItemId" TEXT,
    "trustScore" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Signal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Spark" (
    "id" TEXT NOT NULL,
    "signalId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "SparkType" NOT NULL DEFAULT 'INSIGHTFUL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Spark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Thread" (
    "id" TEXT NOT NULL,
    "signalId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Thread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bounty" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "signalId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "stake" INTEGER NOT NULL,
    "status" "BountyStatus" NOT NULL DEFAULT 'OPEN',
    "winnerId" TEXT,
    "awardedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bounty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Connection" (
    "id" TEXT NOT NULL,
    "userAId" TEXT NOT NULL,
    "userBId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "sourceType" "ConnectionSource" NOT NULL,
    "strength" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Connection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hive" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "reputation" INTEGER NOT NULL DEFAULT 0,
    "treasurySplit" DOUBLE PRECISION NOT NULL DEFAULT 0.15,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HiveMember" (
    "id" TEXT NOT NULL,
    "hiveId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "HiveRole" NOT NULL DEFAULT 'MEMBER',
    "equityShare" DOUBLE PRECISION NOT NULL DEFAULT 0.01,
    "earnedDividends" INTEGER NOT NULL DEFAULT 0,
    "termEndsAt" TIMESTAMP(3),
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HiveMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HiveKSB" (
    "hiveId" TEXT NOT NULL,
    "ksbId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,

    CONSTRAINT "HiveKSB_pkey" PRIMARY KEY ("hiveId","ksbId")
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL,
    "hiveId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "targetUserId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "ProposalType" NOT NULL,
    "status" "ProposalStatus" NOT NULL DEFAULT 'ACTIVE',
    "isAnonymous" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "choice" "VoteChoice" NOT NULL,
    "voteWeight" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubmissionRoster_submissionId_userId_key" ON "SubmissionRoster"("submissionId", "userId");

-- CreateIndex
CREATE INDEX "Signal_authorId_idx" ON "Signal"("authorId");

-- CreateIndex
CREATE INDEX "Signal_trustScore_idx" ON "Signal"("trustScore" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "Spark_signalId_userId_key" ON "Spark"("signalId", "userId");

-- CreateIndex
CREATE INDEX "Bounty_status_idx" ON "Bounty"("status");

-- CreateIndex
CREATE INDEX "Connection_userAId_idx" ON "Connection"("userAId");

-- CreateIndex
CREATE INDEX "Connection_userBId_idx" ON "Connection"("userBId");

-- CreateIndex
CREATE UNIQUE INDEX "Connection_userAId_userBId_sourceId_key" ON "Connection"("userAId", "userBId", "sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "Hive_name_key" ON "Hive"("name");

-- CreateIndex
CREATE UNIQUE INDEX "HiveMember_hiveId_userId_key" ON "HiveMember"("hiveId", "userId");

-- CreateIndex
CREATE INDEX "Proposal_hiveId_status_idx" ON "Proposal"("hiveId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_proposalId_userId_key" ON "Vote"("proposalId", "userId");

-- AddForeignKey
ALTER TABLE "SubmissionRoster" ADD CONSTRAINT "SubmissionRoster_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionRoster" ADD CONSTRAINT "SubmissionRoster_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signal" ADD CONSTRAINT "Signal_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Spark" ADD CONSTRAINT "Spark_signalId_fkey" FOREIGN KEY ("signalId") REFERENCES "Signal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Spark" ADD CONSTRAINT "Spark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_signalId_fkey" FOREIGN KEY ("signalId") REFERENCES "Signal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bounty" ADD CONSTRAINT "Bounty_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bounty" ADD CONSTRAINT "Bounty_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bounty" ADD CONSTRAINT "Bounty_signalId_fkey" FOREIGN KEY ("signalId") REFERENCES "Signal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_userAId_fkey" FOREIGN KEY ("userAId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_userBId_fkey" FOREIGN KEY ("userBId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HiveMember" ADD CONSTRAINT "HiveMember_hiveId_fkey" FOREIGN KEY ("hiveId") REFERENCES "Hive"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HiveMember" ADD CONSTRAINT "HiveMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HiveKSB" ADD CONSTRAINT "HiveKSB_hiveId_fkey" FOREIGN KEY ("hiveId") REFERENCES "Hive"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HiveKSB" ADD CONSTRAINT "HiveKSB_ksbId_fkey" FOREIGN KEY ("ksbId") REFERENCES "KSB"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_hiveId_fkey" FOREIGN KEY ("hiveId") REFERENCES "Hive"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
