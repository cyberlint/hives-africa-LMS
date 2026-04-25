import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const emailRules = [
  // ==========================================
  // SUBMISSION & GRADING ENGINE
  // ==========================================
  {
    id: "rule-submission-approved",            // When a submission is approved (either by an instructor or via peer-review)
    eventType: "Submission_Approved",
    templateKey: "submission_approved",
    delay: 0,
    isActive: true,
  },
  {
    id: "rule-submission-rejected",         // When a submission is rejected (either by an instructor or via peer-review)
    eventType: "Submission_Rejected",
    templateKey: "submission_rejected",
    delay: 0,
    isActive: true,
  },
  {
    id: "rule-submission-revision",          // When a submission receives a "Revision Required" status (either by an instructor or via peer-review)
    eventType: "Submission_Revision_Required",
    templateKey: "submission_revision_required",
    delay: 0,
    isActive: true,
  },
  {
    id: "rule-review-assigned",             // When a submission is assigned to a peer reviewer (to notify the reviewer that they have a new review task)
    eventType: "Review_Assigned",
    templateKey: "review_assigned",
    delay: 0,
    isActive: true,
  },

  // ==========================================
  // GOVERNANCE & HIVES
  // ==========================================
  {
    id: "rule-proposal-raised",          // When a new proposal is raised in a Hive (e.g., to change the Hive's name, expel a member, etc.)
    eventType: "Proposal_Raised",
    templateKey: "proposal_raised",
    delay: 0,
    isActive: true,
  },
  {
    id: "rule-proposal-outcome",          // When a proposal is approved by the Hive (after the voting period ends and the votes are tallied)
    eventType: "Proposal_Outcome",
    templateKey: "proposal_outcome",
    delay: 0,
    isActive: true,
  },
  {
    id: "rule-hive-submission-received",         // When a hive submits work for an activity on behalf of its members. This is an important notification to send to all members who joined the activity within the hive to let them know their hive has submitted work and it's now pending review.
    eventType: "Submission_Received",
    templateKey: "hive_submission_received",
    delay: 0,
    isActive: true,
  },
  {
    id: "rule-hive-submission-feedback",         // When an instructor/reviewer provides feedback on a hive submission (regardless of approval status). This is an important notification to send to all members who joined the activity within the hive to let them know feedback has been provided on their submission and encourage them to check it out.
    eventType: "Submission_Feedback_Provided",
    templateKey: "hive_submission_feedback",
    delay: 0,
    isActive: true,
  },

  // ==========================================
  // THE ARENA & ACTIVITIES
  // ==========================================
  {
    id: "rule-activity-joined",                      // When a user joins an activity (e.g., clicks "Join" on an active activity). This is a key moment to send a welcome email with next steps and resources.
    eventType: "Activity_Joined",
    templateKey: "activity_welcome",
    delay: 5, // 5 min delay to feel natural
    isActive: true,
  },
  {
    id: "rule-activity-joined-followup-day3",        // A follow-up email to check in on the user's progress and offer encouragement/resources if they haven't completed the activity within 3 days of joining. This can help boost completion rates by re-engaging users who may have dropped off after the initial excitement of joining.
    eventType: "Activity_Joined",
    templateKey: "activity_checkin_day3",
    delay: 4320, // 3 days (in minutes)
    isActive: true,
  },
  {
    id: "rule-activity-milestone",                  // When a user reaches a milestone in an activity (e.g., submits their work, gets their submission approved, receives peer review feedback, etc.). This is a great opportunity to send an encouraging email that celebrates the user's progress and motivates them to keep going.
    eventType: "Activity_Milestone_Reached",
    templateKey: "activity_milestone_reached",
    delay: 0,
    isActive: true,
  },
  {
    id: "rule-event-rsvp",                        // When a user RSVPs for an event. This is an important moment to send a confirmation email with event details, calendar invites, and any preparatory materials to ensure they are set up for a great event experience.
    eventType: "Event_RSVP",
    templateKey: "event_rsvp_confirmation",
    delay: 2,
    isActive: true,
  },

  // ==========================================
  // THE HELP ECONOMY (Bounties & Social)
  // ==========================================
  {
    id: "rule-bounty-opened",                  // When a new bounty is posted in the system. This can be used to notify users who have expressed interest in certain topics or skills about relevant new opportunities to earn rewards and engage with the community.
    eventType: "Bounty_Opened",
    templateKey: "bounty_opened",
    delay: 0,
    isActive: true,
  },
  {
    id: "rule-bounty-awarded",                // When a bounty poster awards a hunter for their work on a bounty. This is a key moment to send a congratulatory email to the hunter, along with details about the award and encouragement to continue engaging with the platform.
    eventType: "Bounty_Awarded",
    templateKey: "bounty_awarded",
    delay: 0,
    isActive: true,
  },
  {
    id: "rule-connection-established",         // When the Work Graph connects two people (e.g., a mentor-mentee connection, a peer collaboration connection, etc.). This is an important moment to send an introduction email that encourages the new connection to reach out to each other and start building their relationship.
    eventType: "Connection_Established",
    templateKey: "connection_established",
    delay: 2,
    isActive: true,
  },

  // ==========================================
  // THE FORGE (LMS)
  // ==========================================
  {
    id: "rule-course-enrolled",                  // When a user enrolls in a course. This is a critical moment to send a welcome email that provides an overview of the course, what to expect, and how to get started to set the tone for a successful learning experience.
    eventType: "Course_Enrolled",
    templateKey: "course_welcome",
    delay: 2,
    isActive: true,
  },
  {
    id: "rule-course-enrolled-followup-week1",      // A follow-up email to check in on the user's progress and offer encouragement/resources if they haven't completed the first week's material within 7 days of enrolling. This can help boost completion rates by re-engaging users who may have dropped off after the initial excitement of enrolling.
    eventType: "Course_Enrolled",
    templateKey: "course_progress_reminder",
    delay: 10080, // 7 days (in minutes)
    isActive: true,
  },
  {
    id: "rule-course-completed",                   // When a user completes a course. This is a key moment to send a congratulatory email that celebrates the user's achievement, provides any relevant certificates or badges, and encourages them to share their accomplishment with their network. This can help reinforce the value of completing courses and motivate continued learning on the platform.
    eventType: "Course_Completed",
    templateKey: "course_completed",
    delay: 0,
    isActive: true,
  },
  {
    id: "rule-ksb-unlocked",                      // When a user unlocks a new KSB (Knowledge, Skill, or Behavior). This is an important moment to send an encouraging email that celebrates the user's progress in their learning journey, highlights the significance of the newly unlocked KSB, and motivates them to continue engaging with the platform to unlock more KSBs and advance their skills.
    eventType: "KSB_Unlocked",
    templateKey: "ksb_unlocked",
    delay: 0,
    isActive: true,
  },
];

async function main() {
  console.log("🌱 Seeding NextHive email routing rules...");

  let updatedCount = 0;
  let createdCount = 0;

  for (const rule of emailRules) {
    const existingRule = await prisma.emailRule.findUnique({
      where: { id: rule.id },
    });

    await prisma.emailRule.upsert({
      where: { id: rule.id },
      update: {
        templateKey: rule.templateKey,
        delay: rule.delay,
        isActive: rule.isActive,
      },
      create: rule,
    });

    if (existingRule) {
      updatedCount++;
    } else {
      createdCount++;
    }
  }

  console.log(`✅ Seed complete. Created ${createdCount} rules, updated ${updatedCount} rules.`);
}

main()
  .catch((e) => {
    console.error("❌ Failed to seed email rules:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });