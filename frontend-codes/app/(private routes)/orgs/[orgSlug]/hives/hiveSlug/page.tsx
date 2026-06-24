import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

import { HiveHeader } from "../_components/HiveHeader";
import { HiveTabs } from "../_components/HiveTabs";

export default async function HiveOverviewPage({
    params,
}: {
    params: { orgSlug: string; hiveSlug: string };
}) {
    
    // TO-DO: STILL NOT LOGGING. NEED TO DEBUG
    const { orgSlug, hiveSlug } = params;
    console.log("📦 PARAMS:", params);
    console.log("🏢 orgSlug:", orgSlug);
    console.log("🐝 hiveSlug:", hiveSlug);

    const organization = await prisma.organization.findUnique({
        where: { slug: orgSlug },
    });

    if (!organization) {
        notFound();
    }

const hive = await prisma.hive.findFirst({
  where: {
    slug: hiveSlug,
    organizationId: organization.id,
  },
  include: {
    members: {
      include: {
        user: true, // important for UI (names, avatars, etc.)
      },
    },
  },
});
    if (!hive) {
        notFound();
    }
    console.log("orgSlug:", orgSlug);
console.log("hiveSlug:", hiveSlug);
console.log("organization:", organization?.id);
    return (
        <section className="space-y-6">
            {/* HEADER */}
            <HiveHeader
                orgSlug={organization.slug}
                hiveSlug={hive.slug}
                hiveName={hive.name}
                hiveDescription={hive.description}
                memberCount={hive.members?.length}
            />

            {/* TABS */}
            <HiveTabs
                orgSlug={organization.slug}
                hiveSlug={hive.slug}
            />

            {/* OVERVIEW CONTENT */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border p-4">
                    <p className="text-sm text-muted-foreground">
                        Members
                    </p>
                    <p className="text-2xl font-semibold">
                        {hive.members?.length ?? 0}
                    </p>
                </div>

                <div className="rounded-xl border p-4">
                    <p className="text-sm text-muted-foreground">
                        Status
                    </p>
                    <p className="text-2xl font-semibold">
                        Active
                    </p>
                </div>

                <div className="rounded-xl border p-4">
                    <p className="text-sm text-muted-foreground">
                        Created
                    </p>
                    <p className="text-2xl font-semibold">
                        {new Date(hive.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* PLACEHOLDER FOR FUTURE SECTIONS */}
            <div className="rounded-xl border p-6 text-sm text-muted-foreground">
                More hive insights (activity feed, performance, courses, etc.) will live here.
            </div>
        </section>
    );
}