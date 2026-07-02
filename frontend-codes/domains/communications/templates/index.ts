// This file serves as a central registry for all communication templates used in the NextHive system. Each template corresponds to a specific type of notification that can be sent to users based on various events and actions within the platform. By centralizing the templates here, we can easily manage and maintain the different communication formats, ensuring consistency and scalability as we add more templates in the future.

import { submissionApproved } from "./submission_approved";
import { activityJoined } from "./activity_welcome";
import { sparkBatch } from "./spark_batch";
import { courseWelcome } from "./course_welcome";
import { courseProgressReminder } from "./course_progress_reminder";
import { courseCompleted } from "./course_completed";

// Hive Governance templates
import { proposalRaised } from "./proposal_raised";
import { proposalOutcome } from "./proposal_outcome";

type UserContext = {
  firstName?: string;
  name?: string;
};

export const templates: Record<
  string,
  (payload: any, user: UserContext) => { subject: string; html: string }
> = {
  spark_batch: sparkBatch,   // New template for spark (likes) batch notifications
  
  submission_approved: submissionApproved,
  activity_welcome: activityJoined,
  course_welcome: courseWelcome,
  course_progress_reminder: courseProgressReminder,
  course_completed: courseCompleted,

  // Hive Governance templates
  proposal_raised: proposalRaised,
  proposal_outcome: proposalOutcome,
};