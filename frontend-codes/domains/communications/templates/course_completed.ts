import { baseEmailLayout } from "../base";
import { blocks } from "../blocks";
import { renderEmailBlocks } from "../renderers/email";

type UserContext = {
  firstName?: string;
  name?: string;
};

export function courseCompleted(payload: any, user: UserContext) {
  const firstName = user.firstName || user.name?.split(" ")[0] || "Builder";
  const courseTitle = payload.courseTitle || "your course";
  const certificateUrl = payload.certificateUrl || payload.courseUrl || "https://hives.africa/";
  const preheader = `You completed ${courseTitle}!`;

  const contentBlocks = [
    blocks.text(`Hey ${firstName},`),
    blocks.heading("Course complete!"),
    blocks.text(`Congratulations on finishing <strong>${courseTitle}</strong>.`),
    blocks.text("This is a meaningful milestone, and we’re proud of the work you’ve put in."),
    blocks.cta("View Certificate", certificateUrl),
    blocks.spacer(24),
    blocks.text("Keep building,"),
    blocks.text("<strong>The NextHive Team</strong>"),
  ];

  return {
    subject: `Course completed: ${courseTitle}`,
    html: baseEmailLayout(renderEmailBlocks(contentBlocks), preheader),
  };
}
