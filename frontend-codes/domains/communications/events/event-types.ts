// This file defines the various event types that can occur within the NextHive system. Each event type corresponds to a specific action or occurrence that may trigger a communication to users. By centralizing these event types, we can ensure consistency across the application when referencing and handling different events.

const EVENT_TYPES = {
  // ==========================================
  // SUBMISSION & GRADING ENGINE
  // ==========================================
  SUBMISSION_APPROVED: "Submission_Approved", // When an instructor or reviewer approves a submission
  SUBMISSION_REJECTED: "Submission_Rejected", // When an instructor or reviewer rejects a submission
  SUBMISSION_REVISION_REQUIRED: "Submission_Revision_Required", // When an instructor or reviewer requests a revision instead of outright rejection
  REVIEW_ASSIGNED: "Review_Assigned",         // When a submission is assigned to a peer reviewer

  // ==========================================
  // GOVERNANCE & HIVES
  // ==========================================
  PROPOSAL_RAISED: "Proposal_Raised",     // When a new proposal is raised in a Hive
  PROPOSAL_OUTCOME: "Proposal_Outcome",   // Unified event for Passed, Failed, or Executed

  // Hive Activity submissions
  HIVE_ACTIVITY_SUBMISSION_RECEIVED: "Submission_Received", // When an activity is submitted by a hive member on behalf of the hive. This will help notify all those that joined the activity within the hive that their hive has submitted work and it's now pending review.
  HIVE_ACTIVITY_SUBMISSION_FEEDBACK_PROVIDED: "Submission_Feedback_Provided", // When an instructor/reviewer provides feedback on a submission (regardless of approval status)

  // ==========================================
  // THE ARENA & ACTIVITIES
  // ==========================================
  ACTIVITY_JOINED: "Activity_Joined",              // When a user joins an activity (e.g., clicks "Join" on an active activity)
  ACTIVITY_MILESTONE_REACHED: "Activity_Milestone_Reached", // When a user reaches a milestone in an activity
  EVENT_RSVP: "Event_RSVP",                 // When a user RSVPs for an event

  // ==========================================
  // THE HELP ECONOMY (Bounties & Social)
  // ==========================================
  BOUNTY_OPENED: "Bounty_Opened",          // When a new bounty is posted in the system
  BOUNTY_AWARDED: "Bounty_Awarded",        // When a bounty poster awards a hunter for their work on a bounty
  SPARK_RECEIVED: "Spark_Received",        // When someone gives a user an Insightful/Helpful spark
  CONNECTION_ESTABLISHED: "Connection_Established", // When the Work Graph connects two people

  // ==========================================
  // THE FORGE (LMS)
  // ==========================================
  COURSE_ENROLLED: "Course_Enrolled",        // When a user enrolls in a course
  COURSE_COMPLETED: "Course_Completed",      // When a user completes a course
  KSB_UNLOCKED: "KSB_Unlocked",            // When a user unlocks a new KSB
} as const;

export type EventType = typeof EVENT_TYPES[keyof typeof EVENT_TYPES];

export { EVENT_TYPES };