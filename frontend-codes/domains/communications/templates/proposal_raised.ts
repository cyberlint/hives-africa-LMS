import { baseEmailLayout } from "../base";
import { blocks } from "../blocks";
import { Block } from "../blocks/types";
import { renderEmailBlocks } from "../renderers/email";

type UserContext = {
  firstName?: string;
  name?: string;
};

export function proposalRaised(payload: any, user: UserContext) {
  const proposalType = payload.type || "Proposal";
  const proposalTitle = payload.title || "a new proposal";
  const hiveName = payload.hiveName;
  const hiveSlug = payload.hiveSlug;
  const creatorName = payload.creatorName;
  const targetUserName = payload.targetUserName;
  const isAnonymous = payload.isAnonymous;
  const deadline = payload.expiresAt;
  const description = payload.description;
  const preheader = `A new ${proposalType} has been raised: ${proposalTitle}`;

//   Ressolve name with fallbacks
const firstName =
  user.firstName ||
  user.name?.split(" ")[0] ||
  "Builder";

  const contentBlocks = [
    blocks.text(`Hey ${firstName},`),
    isAnonymous ? blocks.text(`A new ${proposalType} has been raised by an anonymous member of your hive.`
    ) 
      : blocks.text(`${creatorName} has raised a new ${proposalType} proposal in the ${hiveName} hive.`),
    blocks.text(`Title: <strong>${proposalTitle}</strong>`),
    targetUserName      ? blocks.text(`This proposal is directed at ${targetUserName}.`)
      : null,
    blocks.text("Your voice matters."),
    blocks.heading("Important Details"),
    blocks.callout("Deadline", `${deadline}`),
    blocks.callout("Rationale", `${description}`),
    blocks.spacer(),
    blocks.text(
      `Head over to the ${hiveName} hive to read more and cast your vote.`
    ),
    blocks.cta("View Proposal", `https://hives.africa/community/hives/${hiveSlug}/workspace`),
    blocks.spacer(24),
    blocks.text("Keep building,"),
    blocks.text("<strong>The NextHive Team</strong>"),
  ].filter((b): b is Block => b !== null);

  const htmlContent = renderEmailBlocks(contentBlocks);

  return {
    subject: `Action Required: New ${proposalType} in ${hiveName}`,
    html: baseEmailLayout(htmlContent, preheader),
  };
};