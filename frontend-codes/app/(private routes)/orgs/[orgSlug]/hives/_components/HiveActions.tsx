"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import {
  archiveHiveAction,
  deleteHiveAction,
} from "../organization-hive-actions";

export function HiveActions({
  orgSlug,
  hiveId,
  hiveSlug,
}: {
  orgSlug: string;
  hiveId: string;
  hiveSlug: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleCopyLink() {
    const url = `${window.location.origin}/orgs/${orgSlug}/hives/${hiveSlug}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied");
  }

  function handleArchive() {
    startTransition(async () => {
      try {
        await archiveHiveAction(orgSlug, hiveId);
        toast.success("Hive archived");
        router.refresh();
      } catch (e: any) {
        toast.error(e.message || "Failed to archive hive");
      }
    });
  }

  function handleDelete() {
    if (!confirm("Are you sure you want to delete this hive? This cannot be undone.")) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteHiveAction(orgSlug, hiveId);
        toast.success("Hive deleted");
        router.refresh();
      } catch (e: any) {
        toast.error(e.message || "Failed to delete hive");
      }
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isPending}>
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={handleCopyLink}>
          Copy link
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => toast.info("Edit coming soon")}>
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleArchive}>
          Archive
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleDelete}
          className="text-red-500 focus:text-red-500"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}