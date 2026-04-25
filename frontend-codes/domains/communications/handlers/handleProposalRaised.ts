import { sendEmail } from "../channels/email";
import { proposalRaised } from "../templates/proposal_raised";
import { getUserContext } from "../utils/getUserContext";
import { prisma } from "@/lib/db";


export async function handleProposalRaised(event: any) {
    const { payload, userId } = event;

    const [hive, creator, target] = await Promise.all([
        prisma.hive.findUnique({
            where: { id: payload.hiveId },
            select: { name: true, slug: true },
        }),
        payload.isAnonymous || !payload.creatorId
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
    ]);

    const enrichedPayload = {
        ...payload,
        hiveName: hive?.name,
        hiveSlug: hive?.slug,
        creatorName: payload.isAnonymous
            ? null
            : creator?.name || "Anonymous",
        targetUserName: target?.name,
    };

    const user = await getUserContext(userId);

    const message = proposalRaised(enrichedPayload, user);

    await sendEmail({
        userId,
        subject: message.subject,
        html: message.html,
    });
}