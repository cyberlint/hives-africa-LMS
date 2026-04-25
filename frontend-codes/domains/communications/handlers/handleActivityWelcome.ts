import { sendEmail } from "../channels/email";
import { activityJoined } from "../templates/activity_welcome";
import { getUserContext } from "../utils/getUserContext";

export async function handleActivityWelcome(event: any) {
  const { userId, payload } = event;

  const user = await getUserContext(userId);

  const message = activityJoined( payload, user );

  await sendEmail({
    userId,
    subject: message.subject,
    html: message.html,
  });
}