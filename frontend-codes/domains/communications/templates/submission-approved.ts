export function submissionApproved(payload: any, name: string) {
  const firstName = name?.split(" ")[0] || "Builder";

  return {
    subject: "🎉 Your submission was approved!",
    html: `
      <h2>Great job, ${firstName}!</h2>
      <p>Your work on <strong>${payload.activityTitle}</strong> was approved.</p>
    `,
  };
}