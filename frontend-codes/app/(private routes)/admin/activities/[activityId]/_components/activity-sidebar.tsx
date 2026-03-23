"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface EditorSidebarProps {
  activityId: string;
}

export function EditorSidebar({ activityId }: EditorSidebarProps) {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "overview";

const tabs = [
  { id: "overview", label: "1. Overview" },
  { id: "requirements", label: "2. Requirements" },
  { id: "settings", label: "3. Settings & Access" },
  { id: "ksb", label: "4. KSB Mapping" },
];

  return (
    <aside className="space-y-1">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <Link
            key={tab.id}
            href={`/admin/activities/${activityId}?tab=${tab.id}`}
            className={cn(
              "block px-4 py-2 rounded-md text-sm font-medium transition",
              isActive 
                ? "bg-muted text-primary" 
                : "text-muted-foreground hover:bg-muted/50"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </aside>
  );
}