import { redirect } from "next/navigation";
import { createActivityDraft } from "../_actions/create-activity";
import { requireOrganizationRole } from "@/lib/organization/require-organization-role";

export default async function NewActivityRoute({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;

  // 1. Validate org access (OWNER / ADMIN)
  const context = await requireOrganizationRole(orgSlug, [
    "OWNER",
    "ADMIN",
  ]);

  const userId = context.user.id;
  const organization = context.organization;

  // 2. Create draft (org-aware in future improvement)
  const result = await createActivityDraft(userId, organization.id);

  if (result.status === "error" || !result.activityId) {
    redirect(`/orgs/${orgSlug}/activities?error=creation_failed`);
  }

  // 3. Redirect into ORG context (NOT admin)
  redirect(`/orgs/${orgSlug}/activities/${result.activityId}`);
}