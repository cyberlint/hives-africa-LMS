"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type HiveTabsProps = {
  orgSlug: string;
  hiveSlug: string;
};

export function HiveTabs({
  orgSlug,
  hiveSlug,
}: HiveTabsProps) {
  const pathname = usePathname();

  const tabs = [
    {
      label: "Overview",
      href: `/orgs/${orgSlug}/hives/${hiveSlug}`,
    },
    {
      label: "Members",
      href: `/orgs/${orgSlug}/hives/${hiveSlug}/members`,
    },
    {
      label: "Activities",
      href: `/orgs/${orgSlug}/hives/${hiveSlug}/activities`,
    },
    {
      label: "Courses",
      href: `/orgs/${orgSlug}/hives/${hiveSlug}/courses`,
    },
    {
      label: "Analytics",
      href: `/orgs/${orgSlug}/hives/${hiveSlug}/analytics`,
    },
    {
      label: "Settings",
      href: `/orgs/${orgSlug}/hives/${hiveSlug}/settings`,
    },
  ];

  return (
    <div className="overflow-x-auto">
      <nav className="flex min-w-max items-center gap-2 border-b">
        {tabs.map((tab) => {
          const active =
            pathname === tab.href ||
            pathname.startsWith(`${tab.href}/`);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "border-b-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors",
                active
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}