"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X } from "lucide-react";
import { castVote } from "../../actions.governance";
import { toast } from "sonner";

export default function WorkspaceProposalCard({
  proposal,
  currentUserId,
  userEquity,
}: {
  proposal: any;
  currentUserId: string;
  userEquity: number;
}) {
  const [isPending, startTransition] = useTransition();

  const userVote = proposal.votes?.find(
    (v: any) => v.userId === currentUserId
  );

  const handleVote = (choice: "FOR" | "AGAINST") => {
    startTransition(async () => {
      const res = await castVote({
        proposalId: proposal.id,
        userId: currentUserId,
        choice,
        expectedStatus: "ACTIVE",
      });

      if (res.success) {
        toast.success(`Vote cast • ${userEquity}% equity applied`);
      } else {
        toast.error(res.error || "Failed to cast vote.");
      }
    });
  };

  return (
    <div className="group px-4 py-3 rounded-lg hover:bg-muted/40 transition">

      {/* TOP ROW */}
      <div className="flex items-start justify-between gap-3">

        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wider text-indigo-500 font-semibold">
            {proposal.type.replace(/_/g, " ")}
          </p>

          <h3 className="text-sm font-medium leading-snug line-clamp-1">
            {proposal.title}
          </h3>

          {/* subtle context */}
          {proposal.description && (
            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
              {proposal.description}
            </p>
          )}
        </div>

        {/* lightweight status dot instead of “card feel” */}
        <div className="mt-1 size-2 rounded-full bg-green-500 shrink-0 opacity-60 group-hover:opacity-100" />
      </div>

      {/* ACTION ROW (compact, not “boxed buttons”) */}
      <div className="flex gap-2 mt-3 opacity-90 group-hover:opacity-100">

        <Button
          disabled={isPending}
          onClick={() => handleVote("FOR")}
          size="sm"
          className={`
            h-8 px-3 text-xs font-medium flex-1
            transition-all
            ${
              userVote?.choice === "FOR"
                ? "bg-green-600 text-white"
                : "bg-green-500/10 text-green-600 hover:bg-green-600 hover:text-white"
            }
          `}
        >
          {isPending ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <>
              <Check className="size-3 mr-1" /> For
            </>
          )}
        </Button>

        <Button
          disabled={isPending}
          onClick={() => handleVote("AGAINST")}
          size="sm"
          className={`
            h-8 px-3 text-xs font-medium flex-1
            transition-all
            ${
              userVote?.choice === "AGAINST"
                ? "bg-red-600 text-white"
                : "bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white"
            }
          `}
        >
          {isPending ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <>
              <X className="size-3 mr-1" /> Against
            </>
          )}
        </Button>

      </div>
    </div>
  );
}