import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/domains/auth/require-auth";
import { constructUrl } from "@/lib/construct-url";
import { IconCirclePlus, } from "@tabler/icons-react";
import { Users, Box } from "lucide-react";

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
    <div className="max-w-6xl mx-auto p-6 md:p-12 space-y-12">
      
      {/* HEADER: Clean, spacious, and purposeful */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950">
            Organizations
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Manage your cohorts, teams, and learning ecosystems.
          </p>
        </div>

        <Link
          href="/orgs/create"
          className="inline-flex items-center gap-2.5 bg-orange text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-sm"
        >
          <IconCirclePlus size={20} />
          Create Organization
        </Link>
      </div>

      {/* GRID: Refined Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {memberships.map(({ organization, role }) => {
          const logoSrc = organization.logoUrl ? constructUrl(organization.logoUrl) : null;

          return (
            <Link
              key={organization.id}
              href={`/orgs/${organization.slug}`}
              className="group flex flex-col gap-5 p-6 bg-white border border-slate-200 rounded-2xl hover:border-orange hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                {logoSrc ? (
                  <img src={logoSrc} alt={organization.name} className="w-12 h-12 rounded-xl object-cover border border-slate-100" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 uppercase border border-slate-200">
                    {organization.name.slice(0, 2)}
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-950 text-lg truncate group-hover:text-orange transition-colors">
                    {organization.name}
                  </h3>
                  <span className="inline-flex items-center mt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {role}
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                {organization.description || "No description provided for this organization."}
              </p>

              <div className="flex items-center gap-6 pt-4 border-t border-slate-100 text-slate-600">
                <div className="flex items-center gap-2 text-sm">
                  <Users size={16} className="text-slate-400" />
                  <span className="font-semibold text-slate-900">{organization._count.members}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Box size={16} className="text-slate-400" />
                  <span className="font-semibold text-slate-900">{organization._count.hives}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}