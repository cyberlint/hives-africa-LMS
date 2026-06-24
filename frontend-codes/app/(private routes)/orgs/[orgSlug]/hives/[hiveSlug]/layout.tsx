import { requireOrganizationRole } from "@/lib/organization/require-organization-role";
import { HiveHeader } from "../_components/HiveHeader";
import { HiveTabs } from "../_components/HiveTabs";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function HiveLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{
        orgSlug: string;
        hiveSlug: string;
    }>;
}) {
    const { orgSlug, hiveSlug } = await params;

    const context = await requireOrganizationRole(orgSlug);

    const hive = await prisma.hive.findFirst({
        where: {
            slug: hiveSlug,
            organizationId: context.organization.id,
        },
        include: {
            members: {
                include: {
                    user: true, // important for UI (names, avatars, etc.)
                },
            },
        },
    });

    if (!hive) notFound();

    return (
        <div className="space-y-6">
            {children}
        </div>
    );
}