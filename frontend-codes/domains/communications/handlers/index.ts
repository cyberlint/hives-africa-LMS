import { EVENT_TYPES } from "../events/event-types";
import { handleSubmissionApproved } from "./handleSubmissionApproved";
import { handleActivityWelcome } from "./handleActivityWelcome";
import { handleProposalRaised } from "./handleProposalRaised";
import { handleProposalOutcome } from "./handleProposalOutcome";

export async function handleImmediateEvent(event: any) {
  switch (event.type) {
    case EVENT_TYPES.SUBMISSION_APPROVED:
      return handleSubmissionApproved(event);
    case EVENT_TYPES.ACTIVITY_JOINED:
      return handleActivityWelcome(event);
    case EVENT_TYPES.PROPOSAL_RAISED:
      return handleProposalRaised(event);
    case EVENT_TYPES.PROPOSAL_OUTCOME:
      return handleProposalOutcome(event);


    // add more here later

    default:
      console.log(`[COMMUNICATION] No handler for ${event.type}`);
  }
}