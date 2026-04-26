import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/domains/auth/require-auth";
import { constructUrl } from "@/lib/construct-url";

export default async function OrganizationsIndexPage() {
  const user = await requireAuth();

  const memberships = await prisma.organizationMember.findMany({
    where: { userId: user.id },
    include: {
      organization: {
        include: {
          _count: {
            select: { members: true, hives: true },
          },
        },
      },
    },
    orderBy: { joinedAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 space-y-10">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row justify-between gap-4 border-b pb-6">

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Organizations
          </h1>

          <p className="text-gray-500 mt-1 max-w-xl">
            Your execution layer for cohorts, teams, and real-world learning systems.
          </p>
        </div>

        <Link
          href="/orgs/create"
          className="bg-orange text-primary-foreground px-5 py-3 rounded-xl font-semibold hover:opacity-90 transition-all shadow-sm w-full md:w-auto flex items-center justify-center"
        >
          + New Organization
        </Link>
      </div>

        {/* ================= EMPTY STATE ================= */}
        {memberships.length === 0 ? (
          <div className="text-center py-20 bg-white border rounded-2xl">

            <div className="mx-auto w-14 h-14 bg-orange/10 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-7 h-7 text-orange"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 21V5a2 2 0 012-2h14a2 2 0 012 2v16M3 21h18M9 7h6M9 11h6M9 15h4"
                />
              </svg>
            </div>

            <h2 className="text-xl font-semibold mb-2">
              Create your first organization
            </h2>

            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Organizations help you run structured learning, teams, and execution systems.
            </p>

            <Link
              href="/orgs/create"
              className="bg-orange text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all inline-block"
            >
              Create Organization
            </Link>
          </div>
        ) : (
          /* ================= GRID ================= */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {memberships.map(({ organization, role }) => {
              const logoSrc = organization.logoUrl
                ? constructUrl(organization.logoUrl)
                : null;

              return (
                <Link
                  key={organization.id}
                  href={`/orgs/${organization.slug}`}
                  className="
                  group bg-white border rounded-2xl p-5
                  hover:shadow-md hover:border-gray-300
                  transition-all flex flex-col gap-4
                "
                >

                  {/* HEADER */}
                  <div className="flex items-center gap-4">

                    {logoSrc ? (
                      <img
                        src={logoSrc}
                        alt={organization.name}
                        className="w-12 h-12 rounded-lg object-cover border"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 border flex items-center justify-center font-bold text-gray-400 uppercase">
                        {organization.name.slice(0, 2)}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold truncate text-orange group-hover:text-orange transition-colors">
                        {organization.name}
                      </h3>

                      <span className="inline-block mt-1 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                        {role}
                      </span>
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {organization.description || "No description provided."}
                  </p>

                  {/* FOOTER */}
                  <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t">

                    <div className="flex items-center gap-1">
                      <span className="font-medium text-gray-700">
                        {organization._count.members}
                      </span>
                      <span>members</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="font-medium text-gray-700">
                        {organization._count.hives}
                      </span>
                      <span>hives</span>
                    </div>

                  </div>

                </Link>
              );
            })}

          </div>
        )}
      </div>
      );
}