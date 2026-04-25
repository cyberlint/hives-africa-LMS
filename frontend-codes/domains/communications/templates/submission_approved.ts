import { baseEmailLayout } from "../base";
import { blocks } from "../blocks";
import { Block } from "../blocks/types";
import { renderEmailBlocks } from "../renderers/email";

type UserContext = {
  firstName?: string;
  name?: string;
};

export function submissionApproved(payload: any, user: UserContext) {
  const activityTitle = payload.activityTitle || "your recent activity";
  const repEarned = payload.repEarned || 0;
  const portfolioUrl = payload.portfolioUrl || "https://hives.africa/";

  // Safe name resolution
  const firstName =
    user.firstName ||
    user.name?.split(" ")[0] ||
    "Builder";

  const preheader = `Your work on ${activityTitle} was just verified.`;

  const contentBlocks = [
    blocks.text(`Hey ${firstName},`),

    blocks.text(
      `Your work on <strong>${activityTitle}</strong> has been reviewed and approved.`
    ),

    blocks.callout(
      `+${repEarned} Reputation added to your ledger.`,
      "Ledger Update"
    ),

    blocks.text(
      `Your submission is now verified and publicly visible on your portfolio.`
    ),

    blocks.cta("View Your Portfolio", portfolioUrl),

    blocks.spacer(24),

    blocks.text("Keep building,"),
    blocks.text("<strong>The NextHive Team</strong>"),
  ].filter((b): b is Block => b !== null);

  const htmlContent = renderEmailBlocks(contentBlocks);

  return {
    subject: `Verified: ${activityTitle}`,
    html: baseEmailLayout(htmlContent, preheader),
  };
}