import type { OrgRole } from "@prisma/client";

import { getOrganizationContext } from "./get-organization-context";
import { assertOrganizationRole } from "./assert-organization-role";

export async function requireOrganizationRole(
    organizationId: string,
    allowedRoles: OrgRole[] = ["OWNER", "ADMIN"]
) {
    const context = await getOrganizationContext(organizationId);

    assertOrganizationRole(
        context.membership.role,
        allowedRoles
    );

    return context;
}