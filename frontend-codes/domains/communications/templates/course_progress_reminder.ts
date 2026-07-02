import { baseEmailLayout } from "../base";
import { blocks } from "../blocks";
import { renderEmailBlocks } from "../renderers/email";

type UserContext = {
  firstName?: string;
  name?: string;
};

export function courseProgressReminder(payload: any, user: UserContext) {
  const firstName = user.firstName || user.name?.split(" ")[0] || "Builder";
  const courseTitle = payload.courseTitle || "your course";
  const courseUrl = payload.courseUrl || "https://hives.africa/";
  const preheader = `You’ve made progress in ${courseTitle}.`;

  const contentBlocks = [
    blocks.text(`Hey ${firstName},`),
    blocks.heading("You’re making progress"),
    blocks.text(`We noticed you’re still building momentum in <strong>${courseTitle}</strong>. A quick reminder to keep going.`),
    blocks.cta("Return to Course", courseUrl),
    blocks.spacer(24),
    blocks.text("Keep building,"),
    blocks.text("<strong>The NextHive Team</strong>"),
  ];

  return {
    subject: `Continue your learning in ${courseTitle}`,
    html: baseEmailLayout(renderEmailBlocks(contentBlocks), preheader),
  };
}
