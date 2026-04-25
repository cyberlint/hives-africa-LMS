import { baseEmailLayout } from "../base";
import { blocks } from "../blocks";
import { renderEmailBlocks } from "../renderers/email";

type UserContext = {
  firstName?: string;
};

export function sparkBatch(payload: any, user: UserContext) {
  const firstName = user.firstName || "Builder";
  const total = payload.total || 0;

  const preheader = `You received ${total} new sparks`;

  const contentBlocks = [
    blocks.text(`Hey ${firstName},`),

    blocks.heading("You're getting noticed."),

    blocks.text(
      `You received <strong>${total} new sparks</strong> on your contributions.`
    ),

    blocks.text(
      "People are finding your work valuable. Keep going."
    ),

    blocks.cta("View Activity", payload.actionUrl),

    blocks.spacer(24),

    blocks.text("Keep building,"),
    blocks.text("<strong>The NextHive Team</strong>"),
  ];

  const htmlContent = renderEmailBlocks(contentBlocks);

  return {
    subject: `+${total} Sparks on your work`,
    html: baseEmailLayout(htmlContent, preheader),
  };
}