import { baseEmailLayout } from "../base";
import { blocks } from "../blocks";
import { renderEmailBlocks } from "../renderers/email";

type UserContext = {
  firstName?: string;
  name?: string;
};

export function courseWelcome(payload: any, user: UserContext) {
  const firstName = user.firstName || user.name?.split(" ")[0] || "Builder";
  const courseTitle = payload.courseTitle || "your course";
  const courseUrl = payload.courseUrl || "https://hives.africa/";
  const preheader = `Welcome to ${courseTitle}!`;

  const contentBlocks = [
    blocks.text(`Hey ${firstName},`),
    blocks.heading(`Welcome to ${courseTitle}`),
    blocks.text("You’re all set to start learning. Here’s how to make the most of your course:"),
    blocks.text("• Open the course and review the first lesson"),
    blocks.text("• Mark lessons complete as you go"),
    blocks.text("• Keep your momentum going with short, consistent study sessions"),
    blocks.cta("Start Learning", courseUrl),
    blocks.spacer(24),
    blocks.text("Keep building,"),
    blocks.text("<strong>The NextHive Team</strong>"),
  ];

  return {
    subject: `Welcome to ${courseTitle}`,
    html: baseEmailLayout(renderEmailBlocks(contentBlocks), preheader),
  };
}
