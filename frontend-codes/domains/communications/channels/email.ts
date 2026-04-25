type SendEmailParams = {
  userId: string;
  subject: string;
  html: string;
};

export async function sendEmail({
  userId,
  subject,
  html,
}: SendEmailParams) {
  // lookup user email if needed
  // send via resend or provider

  console.log("Sending email:", { userId, subject });

  // example:
  // await resend.emails.send({ ... })
}