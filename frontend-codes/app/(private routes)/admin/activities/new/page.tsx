import { redirect } from "next/navigation";
import { createActivityDraft } from "../_actions/create-activity";
import { requireAdmin } from "@/lib/require-admin";

export default async function NewActivityRoute() {
  // 1. Check if the user is an admin and get the current user ID
  const session = await requireAdmin(); // This will redirect if not admin
  const userId = session.user.id;

  // 2. Create the draft
  const result = await createActivityDraft(userId);

  if (result.status === "error" || !result.activityId) {
    // If it fails, send them back to the list with an error state
    redirect("/admin/activities?error=creation_failed");
  }

  // 3. Redirect immediately to the builder for this specific activity
  redirect(`/admin/activities/${result.activityId}`);
}