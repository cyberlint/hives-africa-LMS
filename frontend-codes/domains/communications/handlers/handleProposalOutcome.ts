import { sendEmail } from "../channels/email";
import { proposalOutcome } from "../templates/proposal_outcome";
import { getUserContext } from "../utils/getUserContext";
import { prisma } from "@/lib/db";

export async function handleProposalOutcome(event: any) {
  const { payload, userId } = event;

  const [hive, creator, target, proposal] = await Promise.all([
    prisma.hive.findUnique({
      where: { id: payload.hiveId },
      select: { name: true, slug: true },
    }),
    payload.isAnonymous
      ? null
      : prisma.user.findUnique({
          where: { id: payload.creatorId },
          select: { name: true },
        }),
    payload.targetUserId
      ? prisma.user.findUnique({
          where: { id: payload.targetUserId },
          select: { name: true },
        })
      : null,
    prisma.proposal.findUnique({
      where: { id: payload.proposalId },
      select: { title: true },
    }),
  ]);

  const enrichedPayload = {
    ...payload,
    proposalTitle: proposal?.title,
    hiveName: hive?.name,
    hiveSlug: hive?.slug,
    creatorName: payload.isAnonymous
      ? null
      : creator?.name || "Anonymous",
    targetUserName: target?.name,
    isTarget: payload.targetUserId === userId,
    isCreator: payload.creatorId === userId,
  };

  const user = await getUserContext(userId);

  const message = proposalOutcome(enrichedPayload, user);

  await sendEmail({
    userId,
    subject: message.subject,
    html: message.html,
  });
}