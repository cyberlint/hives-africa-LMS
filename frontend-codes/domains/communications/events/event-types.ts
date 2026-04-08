const EVENT_TYPES = {
  // ==========================================
  // 1. SUBMISSION & GRADING ENGINE
  // ==========================================
  SUBMISSION_APPROVED: "Submission_Approved", // When an instructor or reviewer approves a submission
  SUBMISSION_REJECTED: "Submission_Rejected", // When an instructor or reviewer rejects a submission
  SUBMISSION_REVISION_REQUIRED: "Submission_Revision_Required", // When an instructor or reviewer requests a revision instead of outright rejection
  REVIEW_ASSIGNED: "Review_Assigned",         // When a submission is assigned to a peer reviewer

  // ==========================================
  // 2. GOVERNANCE & HIVES
  // ==========================================
  PROPOSAL_RAISED: "Proposal_Raised",     // When a new proposal is raised in a Hive (e.g., to change the Hive's name, expel a member, etc.)
  PROPOSAL_PASSED: "Proposal_Passed",     // When a proposal is approved by the Hive
  PROPOSAL_FAILED: "Proposal_Failed",     // When a proposal is rejected by the Hive
  PROPOSAL_EXECUTED: "Proposal_Executed", // When a proposal is implemented
  
  // Specific target notifications
  PROPOSAL_TARGET_EXPELLED: "Proposal_Target_Expelled", // When a member receives the news that they've been expelled
  PROPOSAL_TARGET_IMPEACHED: "Proposal_Target_Impeached", // When a member receives the news that they've been impeached
  PROPOSAL_TARGET_PROMOTED: "Proposal_Target_Promoted", // When a member receives the news that they've been promoted

  // ==========================================
  // 3. THE ARENA & ACTIVITIES
  // ==========================================
  ACTIVITY_JOINED: "Activity_Joined",              // When a user joins an activity (e.g., clicks "Join" on an active activity)
  ACTIVITY_MILESTONE_REACHED: "Activity_Milestone_Reached", // When a user reaches a milestone in an activity
  HACKATHON_RSVP: "Hackathon_RSVP",                 // When a user RSVPs for a hackathon

  // ==========================================
  // 4. THE HELP ECONOMY (Bounties & Social)
  // ==========================================
  BOUNTY_OPENED: "Bounty_Opened",          // When a new bounty is posted in the system
  BOUNTY_AWARDED: "Bounty_Awarded",        // When a bounty poster awards a hunter for their work on a bounty
  SPARK_RECEIVED: "Spark_Received",        // When someone gives a user an Insightful/Helpful spark
  CONNECTION_ESTABLISHED: "Connection_Established", // When the Work Graph connects two people

  // ==========================================
  // 5. THE FORGE (LMS)
  // ==========================================
  COURSE_ENROLLED: "Course_Enrolled",        // When a user enrolls in a course
  COURSE_COMPLETED: "Course_Completed",      // When a user completes a course
  KSB_UNLOCKED: "KSB_Unlocked",            // When a user unlocks a new KSB
} as const;

export type EventType = typeof EVENT_TYPES[keyof typeof EVENT_TYPES];

export { EVENT_TYPES };