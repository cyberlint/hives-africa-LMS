import { getOrganizationDashboard } from "../actions"
import Link from "next/link"
import HiveLaunchButton from "../../(social)/community/hives/_components/HiveLaunchButton"

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

export default async function OrgDashboard({
  params,
}: {
  params: { orgSlug: string }
}) {
  const org = await getOrganizationDashboard(params.orgSlug)

  if (!org) return null

  const hasHives = (org.hives?.length ?? 0) > 0

  return (
    <section className="space-y-6">

      {/* ================= EMPTY STATE ================= */}
      {!hasHives && (
        <div className="border border-dashed rounded-2xl p-10 text-center space-y-4 bg-white">

          <h2 className="text-lg font-semibold">
            No hives yet
          </h2>

          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Create your first hive to start organizing cohorts, teams, and structured execution inside your organization.
          </p>

          <HiveLaunchButton orgSlug={org.slug} />

        </div>
      )}

      {/* ================= HEADER ================= */}
      {hasHives && (
        <div className="flex items-center justify-between gap-3">

          <div>
            <h2 className="text-lg font-semibold">Hives</h2>
            <p className="text-xs text-muted-foreground">
              Workspaces inside this organisation
            </p>
          </div>

          <HiveLaunchButton orgSlug={org.slug} />

        </div>
      )}

      {/* ================= LIST (WHATSAPP STYLE) ================= */}
      {hasHives && (
        <div className="border rounded-2xl overflow-hidden bg-background">

          {org.hives.map((hive, index) => (
            <Link
              key={hive.id}
              href={`/community/hives/${hive.slug}`}
              className={`
                flex items-center gap-3 px-4 py-3
                hover:bg-muted/40 transition
                ${index !== org.hives.length - 1 ? "border-b" : ""}
              `}
            >

              {/* AVATAR */}
              <div className="size-10 rounded-full bg-orange/10 text-orange flex items-center justify-center text-sm font-bold shrink-0">
                {getInitials(hive.name)}
              </div>

              {/* CONTENT */}
              <div className="flex-1 min-w-0">

                {/* TOP ROW */}
                <div className="flex items-center justify-between gap-2">

                  <p className="text-sm font-medium truncate">
                    {hive.name}
                  </p>

                  <span className="text-[11px] text-muted-foreground shrink-0">
                    {new Date(hive.createdAt).toLocaleDateString()}
                  </span>

                </div>

                {/* SECOND ROW */}
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {hive.description || "No description"}
                </p>

              </div>

            </Link>
          ))}

        </div>
      )}

    </section>
  )
}