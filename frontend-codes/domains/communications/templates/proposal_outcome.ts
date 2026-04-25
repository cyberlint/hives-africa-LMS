import { baseEmailLayout } from "../base";
import { blocks } from "../blocks";
import { Block } from "../blocks/types";
import { renderEmailBlocks } from "../renderers/email";

type UserContext = {
  firstName?: string;
  name?: string;
};

function formatProposalType(type: string) {
  return type
    ?.toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase()) || "Proposal";
}

export function proposalOutcome(payload: any, user: UserContext) {
  const firstName = user.firstName || user.name?.split(" ")[0] || "Member";

  const {
    proposalTitle,
    hiveName,
    hiveSlug,
    targetUserName,
    type,
    outcome, 
    isTarget,
    isCreator,
  } = payload;

  const readableType = formatProposalType(type);

  // Normalize the outcome string to guarantee it matches our if/else checks
  const normalizedOutcome = outcome ? String(outcome).toUpperCase() : "UNKNOWN";

  // --- DYNAMIC TONE & COPY ENGINE (With fail-safes) ---
  // We initialize with default values so it can NEVER be blank
  let heading = "Governance Update";
  let primaryMessage = `The voting period has concluded and the hive's decision has been recorded on the ledger.`;
  let subjectLine = `Governance Update: ${readableType} • ${hiveName}`;

  if (normalizedOutcome === "FAILED") {
    heading = "Proposal Rejected";
    primaryMessage = `The voting period has concluded. The required equity threshold was not met. The proposal has been rejected and the hive's current structural state remains unchanged.`;
    subjectLine = `Rejected: ${readableType} • ${hiveName}`;
  } else if (normalizedOutcome === "PASSED") {
    heading = "Consensus Reached: Approved";
    primaryMessage = `The hive has reached algorithmic consensus. This proposal has been formally approved by the voting members and recorded on the ledger.`;
    subjectLine = `Approved: ${readableType} • ${hiveName}`;
  } else if (normalizedOutcome === "EXECUTED") {
    heading = "Decision Executed";
    primaryMessage = `Consensus was reached and the system has automatically executed the underlying decision. The structural changes to the hive take effect immediately.`;
    subjectLine = `Executed: ${readableType} • ${hiveName}`;
  }

  const preheader = `Voting has concluded for: ${proposalTitle}`;

  // --- BUILD THE BLOCKS ---
  const contentBlocks: (Block | null)[] = [
    blocks.text(`${firstName},`),

    blocks.heading(heading),

    blocks.text(primaryMessage),

    blocks.spacer(16),

    // Data Block (Using native text blocks to remain compliant)
    blocks.text(`<strong>Proposal Record:</strong> ${proposalTitle}`),
    blocks.text(`<strong>Classification:</strong> ${readableType}`),

    // Conditionally show target information using standard text if they aren't the target
    targetUserName && !isTarget
      ? blocks.text(`<strong>Target Profile:</strong> ${targetUserName}`)
      : null,

    // Personalized Target Callout 
    isTarget && normalizedOutcome === "EXECUTED"
      ? blocks.callout(
          "Direct Impact",
          `You are the direct subject of this executed proposal. Your access and permissions within ${hiveName} have been automatically updated by the system to reflect the hive's decision.`
        )
      : null,

    blocks.spacer(16),

    // Creator Acknowledgment
    isCreator && normalizedOutcome === "FAILED"
      ? blocks.text(`As the creator of this proposal, you may revise your approach and submit a new motion if you believe consensus can be reached in the future.`)
      : null,

    blocks.text(
      `This outcome reflects the collective equity of the hive. It is final and forms an immutable part of your governance record.`
    ),

    blocks.cta(
      "View Outcome in Workspace",
      `https://hives.africa/community/hives/${hiveSlug}/workspace`
    ),

    blocks.spacer(24),

    blocks.text("Governance is active. Your participation shapes outcomes."),
    blocks.text("<strong>NextHive Governance Engine</strong>"),
  ];

  // Filter out any null blocks before rendering
  const validBlocks = contentBlocks.filter((b): b is Block => b !== null);
  const html = renderEmailBlocks(validBlocks);

  return {
    subject: subjectLine,
    html: baseEmailLayout(html, preheader),
  };
}