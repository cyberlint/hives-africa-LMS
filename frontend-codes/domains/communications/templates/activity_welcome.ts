import { baseEmailLayout } from "../base";
import { blocks } from "../blocks";
import { renderEmailBlocks } from "../renderers/email";

type UserContext = {
  firstName?: string;
  name?: string;
};

export function activityJoined(payload: any, user: UserContext) {
  const firstName =
    user.firstName ||
    user.name?.split(" ")[0] || "Builder";

  const preheader = `Welcome to ${payload.activityTitle}!`;

  const contentBlocks = [
    // Greeting
    blocks.text(`Hey ${firstName},`),
    blocks.text(
      `You're locked into the ${payload.activityType} - ${payload.activityTitle}!`
    ),

    // Details
    blocks.text(
      `Here are some quick details about the ${payload.activityType}:`
    ),

    ...(payload.startDate
      ? [blocks.callout("Start Date:", payload.startDate)]
      : []),

    ...(payload.deadline
      ? [blocks.callout("End Date:", payload.deadline)]
      : []),

    ...(payload.points
      ? [blocks.callout("Reward:", `+${payload.points} REP`)]
      : []),

    ...(payload.description
      ? [
          blocks.spacer(12),
          blocks.heading(
            `Official Brief:`
          ),
          blocks.text(payload.description),
        ]
      : []),

    ...(payload.isMandatory
      ? [
          blocks.text(
            "Please note that this activity is mandatory to complete."
          ),
        ]
      : []),

    ...(payload.actionUrl
      ? [
          blocks.spacer(24),
          blocks.text(
            "Click the button below to view the activity and get started:"
          ),
          blocks.cta("Enter Activity", payload.actionUrl),
        ]
      : []),
  ];

  const htmlContent = renderEmailBlocks(contentBlocks);

  return {
    subject: `Welcome to ${payload.activityTitle}`,
    html: baseEmailLayout(htmlContent, preheader),
  };
}