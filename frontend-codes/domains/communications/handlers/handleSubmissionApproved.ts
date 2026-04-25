import { sendEmail } from "../channels/email";
import { submissionApproved } from "../templates/submission_approved";
import { getUserContext } from "../utils/getUserContext";

export async function handleSubmissionApproved(event: any) {
  const { userId, payload } = event;

  const user = await getUserContext(userId);

  const message = submissionApproved( payload, user );

  await sendEmail({
    userId,
    subject: message.subject,
    html: message.html,
  });
}