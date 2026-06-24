import type { OrgRole } from "@prisma/client";

export class OrganizationRoleError extends Error {
    constructor(message = "Insufficient permissions") {
        super(message);
        this.name = "OrganizationRoleError";
    }
}

export function assertOrganizationRole(
    currentRole: OrgRole,
    allowedRoles: OrgRole[] = ["OWNER", "ADMIN"]
) {
    if (!allowedRoles.includes(currentRole)) {
        throw new OrganizationRoleError();
    }
}