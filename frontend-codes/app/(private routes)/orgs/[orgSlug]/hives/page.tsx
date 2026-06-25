import Link from "next/link";
import HiveLaunchButton from "@/app/(social)/community/hives/_components/HiveLaunchButton";
import { HiveSearch } from "./_components/HiveSearch";
import { HiveFilters } from "./_components/HiveFilters";
import { prisma } from "@/lib/db";
import { HiveActions } from "./_components/HiveActions";

export default async function OrgHivesPage({
    params,
    searchParams,
}: {
    params: Promise<{ orgSlug: string }>;
    searchParams?: Promise<{
        q?: string;
        sort?: "newest" | "oldest";
        visibility?: "all" | "public" | "private";
    }>;
}) {
    const { orgSlug } = await params;
    const searchParamsResolved = await searchParams;
    const query = searchParamsResolved?.q?.trim() || "";
    const sort = searchParamsResolved?.sort || "newest";
    const visibility = searchParamsResolved?.visibility || "all";
    const organization = await prisma.organization.findUnique({
        where: { slug: orgSlug },
    });

    if (!organization) {
        throw new Error("Organization not found");
    }

    const hives = await prisma.hive.findMany({
        where: {
            organizationId: organization.id,
            isArchived: false,

            ...(query && {
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                ],
            }),

            ...(visibility !== "all" && {
                isPrivate: visibility === "private",
            }),
        },

        orderBy: {
            createdAt: sort === "newest" ? "desc" : "asc",
        },
    });

    if (!organization) {
        throw new Error("Organization not found");
    }

    return (
  <section className="space-y-6">
    {/* ================= HEADER ================= */}
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Hives</h1>
        <p className="text-sm text-muted-foreground">
          Manage all hives inside {organization.name}
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto md:items-center">
        <HiveSearch />
        <HiveFilters />
        <HiveLaunchButton orgSlug={organization.slug} />
      </div>
    </div>

    {/* ================= EMPTY STATE ================= */}
    {hives.length === 0 && (
      <div className="border rounded-xl p-10 text-center text-muted-foreground bg-muted/20">
        No hives yet. Create your first hive to start organizing work.
      </div>
    )}

    {/* ================= GRID ================= */}
    <div className="grid gap-3">
      {hives.map((hive) => (
        <div
          key={hive.id}
          className="
            relative group rounded-xl border bg-background
            hover:bg-muted/30 transition
          "
        >
          {/* ACTIONS */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition">
            <HiveActions
              orgSlug={organization.slug}
              hiveId={hive.id}
              hiveSlug={hive.slug}
            />
          </div>

          {/* LINK CARD */}
          <Link
            href={`/orgs/${organization.slug}/hives/${hive.slug}`}
            className="block p-4 pr-12"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="font-medium text-sm">
                  {hive.name}
                </div>

                <div className="text-xs text-muted-foreground line-clamp-2">
                  {hive.description || "No description"}
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  </section>
);
}