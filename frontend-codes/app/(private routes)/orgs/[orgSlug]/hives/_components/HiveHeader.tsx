"use client";

import Link from "next/link";
import {
  IconArrowLeft,
  IconSettings,
  IconUsers,
  IconChartBar,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

type HiveHeaderProps = {
  orgSlug: string;
  hiveSlug: string;
  hiveName: string;
  hiveDescription?: string | null;
  memberCount?: number;
};

export function HiveHeader({
  orgSlug,
  hiveSlug,
  hiveName,
  hiveDescription,
  memberCount,
}: HiveHeaderProps) {
  return (
    <div className="space-y-4 border-b pb-6">
      {/* Top row */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left */}
        <div className="space-y-2 min-w-0">
          <Link
            href={`/orgs/${orgSlug}/hives`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
          >
            <IconArrowLeft size={16} />
            Back to Hives
          </Link>

          <div>
            <h1 className="text-2xl font-bold tracking-tight break-words">
              {hiveName}
            </h1>

            {hiveDescription && (
              <p className="mt-1 text-sm text-muted-foreground max-w-3xl">
                {hiveDescription}
              </p>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" asChild>
            <Link
              href={`/orgs/${orgSlug}/hives/${hiveSlug}/members`}
            >
              <IconUsers size={16} />
              Members
            </Link>
          </Button>

          <Button variant="outline" asChild>
            <Link
              href={`/orgs/${orgSlug}/hives/${hiveSlug}/analytics`}
            >
              <IconChartBar size={16} />
              Analytics
            </Link>
          </Button>

          <Button asChild>
            <Link
              href={`/orgs/${orgSlug}/hives/${hiveSlug}/settings`}
            >
              <IconSettings size={16} />
              Settings
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="rounded-lg border px-3 py-2 text-sm">
          <span className="text-muted-foreground">
            Members
          </span>
          <div className="font-semibold">
            {memberCount ?? 0}
          </div>
        </div>

        <div className="rounded-lg border px-3 py-2 text-sm">
          <span className="text-muted-foreground">
            Status
          </span>
          <div className="font-semibold">
            Active
          </div>
        </div>
      </div>
    </div>
  );
}