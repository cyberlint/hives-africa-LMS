/*
  Warnings:

  - The values [BrainstormingSession,NetworkingEvent,PanelDiscussion,QandASession,StudyGroup,DemoDay,OfficeHours,FiresideChat,CertificationCourse] on the enum `EventCategory` will be removed. If these variants are still used in the database, this will fail.
  - The values [GoogleMeet,MicrosoftTeams] on the enum `EventVenue` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('Project', 'Task', 'Capstone', 'Case_Study', 'Client_Simulation', 'Challenge', 'Hackathon', 'Datathon', 'Team_Project', 'Open_Source_Contribution', 'Event_Hosting', 'Event_Participation', 'Study_Group_Leadership', 'Mentorship', 'Peer_Review', 'Community_Contribution', 'Tutorial_Creation', 'Content_Translation', 'Research', 'Article_Publication');

-- CreateEnum
CREATE TYPE "ActivityStatus" AS ENUM ('Draft', 'Published', 'Active', 'Completed', 'Archived');

-- CreateEnum
CREATE TYPE "ActivityVisibility" AS ENUM ('Public', 'Private', 'Connections_Only', 'Program_Only', 'Invite_Only');

-- CreateEnum
CREATE TYPE "ActivityDifficulty" AS ENUM ('Beginner', 'Intermediate', 'Advanced', 'Expert');

-- CreateEnum
CREATE TYPE "RequirementType" AS ENUM ('File_Upload', 'GitHub_Repo', 'Video_Link', 'Text_Report', 'Peer_Reviews', 'Host_An_Online_Event', 'Event_Attendance', 'Live_Demo');

-- CreateEnum
CREATE TYPE "ParticipationRole" AS ENUM ('Participant', 'Reviewer', 'Mentor', 'Organizer');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('Draft', 'Submitted', 'Under_Review', 'Revision_Required', 'Approved', 'Rejected');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('Pending', 'Accepted', 'Declined', 'Completed', 'Expired');

-- CreateEnum
CREATE TYPE "ReviewType" AS ENUM ('Peer', 'Instructor', 'Mentor');

-- CreateEnum
CREATE TYPE "KSBType" AS ENUM ('Knowledge', 'Skill', 'Behavior');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('Public', 'Private', 'Connections_Only', 'Program_Only', 'Invite_Only');

-- AlterEnum
BEGIN;
CREATE TYPE "EventCategory_new" AS ENUM ('Hackathon', 'Webinar', 'Brainstorming_Session', 'Networking_Event', 'Panel_Discussion', 'QandA_Session', 'Workshop', 'Meetup', 'Tutorial', 'Lecture', 'Study_Group', 'Roundtable', 'Demo_Day', 'Office_Hours', 'Competition', 'Fireside_Chat', 'Certification_Course', 'Bootcamp');
ALTER TABLE "Event" ALTER COLUMN "eventCategory" DROP DEFAULT;

-- SAFE DATA CONVERSION FOR CATEGORY
ALTER TABLE "Event" ALTER COLUMN "eventCategory" TYPE "EventCategory_new" USING (
  CASE 
    WHEN "eventCategory"::text = 'BrainstormingSession' THEN 'Brainstorming_Session'::"EventCategory_new"
    WHEN "eventCategory"::text = 'NetworkingEvent'      THEN 'Networking_Event'::"EventCategory_new"
    WHEN "eventCategory"::text = 'PanelDiscussion'      THEN 'Panel_Discussion'::"EventCategory_new"
    WHEN "eventCategory"::text = 'QandASession'         THEN 'QandA_Session'::"EventCategory_new"
    WHEN "eventCategory"::text = 'StudyGroup'           THEN 'Study_Group'::"EventCategory_new"
    WHEN "eventCategory"::text = 'DemoDay'              THEN 'Demo_Day'::"EventCategory_new"
    WHEN "eventCategory"::text = 'OfficeHours'          THEN 'Office_Hours'::"EventCategory_new"
    WHEN "eventCategory"::text = 'FiresideChat'         THEN 'Fireside_Chat'::"EventCategory_new"
    WHEN "eventCategory"::text = 'CertificationCourse'  THEN 'Certification_Course'::"EventCategory_new"
    ELSE "eventCategory"::text::"EventCategory_new"
  END
);

ALTER TYPE "EventCategory" RENAME TO "EventCategory_old";
ALTER TYPE "EventCategory_new" RENAME TO "EventCategory";
DROP TYPE "EventCategory_old";
ALTER TABLE "Event" ALTER COLUMN "eventCategory" SET DEFAULT 'Tutorial';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "EventVenue_new" AS ENUM ('NextHive', 'Google_Meet', 'Zoom', 'Microsoft_Teams', 'Offline', 'Hybrid');
ALTER TABLE "Event" ALTER COLUMN "venue" DROP DEFAULT;

-- SAFE DATA CONVERSION FOR VENUE
ALTER TABLE "Event" ALTER COLUMN "venue" TYPE "EventVenue_new" USING (
  CASE 
    WHEN "venue"::text = 'GoogleMeet'     THEN 'Google_Meet'::"EventVenue_new"
    WHEN "venue"::text = 'MicrosoftTeams' THEN 'Microsoft_Teams'::"EventVenue_new"
    ELSE "venue"::text::"EventVenue_new"
  END
);

ALTER TYPE "EventVenue" RENAME TO "EventVenue_old";
ALTER TYPE "EventVenue_new" RENAME TO "EventVenue";
DROP TYPE "EventVenue_old";
ALTER TABLE "Event" ALTER COLUMN "venue" SET DEFAULT 'NextHive';
COMMIT;

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortdescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "fileKey" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramCourse" (
    "programId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "isMandatory" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ProgramCourse_pkey" PRIMARY KEY ("programId","courseId")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "ActivityType" NOT NULL,
    "status" "ActivityStatus" NOT NULL DEFAULT 'Draft',
    "visibility" "ActivityVisibility" NOT NULL DEFAULT 'Public',
    "difficulty" "ActivityDifficulty" NOT NULL DEFAULT 'Intermediate',
    "points" INTEGER NOT NULL DEFAULT 0,
    "isMandatory" BOOLEAN NOT NULL DEFAULT false,
    "startDate" TIMESTAMP(3),
    "deadline" TIMESTAMP(3),
    "courseId" TEXT,
    "programId" TEXT,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityRequirement" (
    "id" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "type" "RequirementType" NOT NULL,
    "config" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "activityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "teamId" TEXT,
    "role" "ParticipationRole" NOT NULL DEFAULT 'Participant',
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Participation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "userId" TEXT,
    "teamId" TEXT,
    "participationId" TEXT,
    "content" JSONB NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'Draft',
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewAssignment" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "status" "AssignmentStatus" NOT NULL DEFAULT 'Pending',
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "ReviewAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "type" "ReviewType" NOT NULL DEFAULT 'Peer',
    "score" DOUBLE PRECISION,
    "feedback" TEXT,
    "rubricScores" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KSB" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "KSBType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KSB_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityKSB" (
    "activityId" TEXT NOT NULL,
    "ksbId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION DEFAULT 1.0,

    CONSTRAINT "ActivityKSB_pkey" PRIMARY KEY ("activityId","ksbId")
);

-- CreateTable
CREATE TABLE "UserKSB" (
    "userId" TEXT NOT NULL,
    "ksbId" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sourceId" TEXT,

    CONSTRAINT "UserKSB_pkey" PRIMARY KEY ("userId","ksbId")
);

-- CreateTable
CREATE TABLE "ReputationTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "activityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReputationTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "visibility" "Visibility" NOT NULL DEFAULT 'Private',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PortfolioItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Program_slug_key" ON "Program"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_teamId_userId_key" ON "TeamMember"("teamId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Participation_userId_activityId_key" ON "Participation"("userId", "activityId");

-- CreateIndex
CREATE INDEX "Submission_activityId_idx" ON "Submission"("activityId");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewAssignment_submissionId_reviewerId_key" ON "ReviewAssignment"("submissionId", "reviewerId");

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioItem_submissionId_key" ON "PortfolioItem"("submissionId");

-- AddForeignKey
ALTER TABLE "ProgramCourse" ADD CONSTRAINT "ProgramCourse_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramCourse" ADD CONSTRAINT "ProgramCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityRequirement" ADD CONSTRAINT "ActivityRequirement_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participation" ADD CONSTRAINT "Participation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participation" ADD CONSTRAINT "Participation_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participation" ADD CONSTRAINT "Participation_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_participationId_fkey" FOREIGN KEY ("participationId") REFERENCES "Participation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewAssignment" ADD CONSTRAINT "ReviewAssignment_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewAssignment" ADD CONSTRAINT "ReviewAssignment_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityKSB" ADD CONSTRAINT "ActivityKSB_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityKSB" ADD CONSTRAINT "ActivityKSB_ksbId_fkey" FOREIGN KEY ("ksbId") REFERENCES "KSB"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserKSB" ADD CONSTRAINT "UserKSB_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserKSB" ADD CONSTRAINT "UserKSB_ksbId_fkey" FOREIGN KEY ("ksbId") REFERENCES "KSB"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReputationTransaction" ADD CONSTRAINT "ReputationTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioItem" ADD CONSTRAINT "PortfolioItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioItem" ADD CONSTRAINT "PortfolioItem_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;