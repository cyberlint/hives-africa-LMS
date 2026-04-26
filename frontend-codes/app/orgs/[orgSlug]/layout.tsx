import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrganizationDashboard } from "../actions";
import { constructUrl } from "@/lib/construct-url";

export default async function OrganizationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  // Change: params is now a Promise
  params: Promise<{ orgSlug: string }>;
}) {
  // Change: You must await params before accessing properties
  const { orgSlug } = await params;
  
  const org = await getOrganizationDashboard(orgSlug);

  if (!org) notFound();

  const logoSrc = org.logoUrl ? constructUrl(org.logoUrl) : null;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* HEADER */}
      <header className="flex items-center justify-between border-b pb-4">
        {/* LEFT: ORG IDENTITY */}
        <div className="flex items-center gap-3 min-w-0">
          {logoSrc && (
            <img
              src={logoSrc}
              className="w-10 h-10 rounded-lg border object-cover"
              alt={org.name}
            />
          )}

          <div className="min-w-0">
            <h1 className="text-lg font-bold truncate">{org.name}</h1>
            <p className="text-xs text-gray-500">
              {org._count.members} members
            </p>
          </div>
        </div>

        {/* RIGHT: SYSTEM MENU */}
        <div className="relative group">
          <button className="text-sm px-3 py-2 rounded-md border hover:bg-gray-50">
            Menu ▾
          </button>

          <div className="
            absolute right-0 mt-2 w-48
            bg-white border rounded-lg shadow-lg
            opacity-0 invisible group-hover:opacity-100 group-hover:visible
            transition
            z-50
          ">
            <DropdownItem href={`/orgs/${org.slug}/members`}>
              Members
            </DropdownItem>

            <DropdownItem href={`/orgs/${org.slug}/billing`}>
              Billing
            </DropdownItem>

            <DropdownItem href={`/orgs/${org.slug}/settings`}>
              Settings
            </DropdownItem>

            <div className="border-t my-1" />

            <Link
              href="/orgs"
              className="block px-3 py-2 text-sm hover:bg-gray-50"
            >
              Switch Organization
            </Link>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main>{children}</main>
    </div>
  );
}

function DropdownItem({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 text-sm hover:bg-gray-50"
    >
      {children}
    </Link>
  );
}