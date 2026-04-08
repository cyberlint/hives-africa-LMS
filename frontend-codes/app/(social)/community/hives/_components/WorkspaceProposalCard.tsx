"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X } from "lucide-react";
import { castVote } from "../../actions.governance";
import { toast } from "sonner";

export default function WorkspaceProposalCard({ 
  proposal, 
  currentUserId, 
  userEquity 
}: { 
  proposal: any; 
  currentUserId: string;
  userEquity: number;
}) {
  const [isPending, startTransition] = useTransition();

  // Check if user already voted to highlight their active choice
  const userVote = proposal.votes?.find((v: any) => v.userId === currentUserId);

  const handleVote = (choice: "FOR" | "AGAINST") => {
    startTransition(async () => {
      const res = await castVote({
        proposalId: proposal.id,
        userId: currentUserId,
        choice
      });

      if (res.success) {
        toast.success(`Vote cast! ${userEquity}% equity applied.`);
      } else {
        toast.error(res.error || "Failed to cast vote.");
      }
    });
  };

  return (
    <div className="p-3 rounded-xl bg-muted/30 border border-border/50 space-y-3 transition-colors hover:bg-muted/50">
      <div>
        <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest mb-1">
          {proposal.type.replace(/_/g, " ")}
        </p>
        <p className="text-sm font-medium line-clamp-2 leading-snug">
          {proposal.title}
        </p>
      </div>

      <div className="flex gap-2">
        <Button 
          disabled={isPending}
          onClick={() => handleVote("FOR")}
          size="sm" 
          variant="outline" 
          className={`flex-1 h-8 text-xs font-bold tracking-wider transition-all border-none ${
            userVote?.choice === "FOR" 
              ? "bg-green-500 text-white shadow-sm ring-1 ring-green-500 ring-offset-1 ring-offset-background" 
              : "bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white"
          }`}
        >
          {isPending ? <Loader2 className="size-3 animate-spin" /> : <><Check className="size-3 mr-1" /> FOR</>}
        </Button>

        <Button 
          disabled={isPending}
          onClick={() => handleVote("AGAINST")}
          size="sm" 
          variant="outline" 
          className={`flex-1 h-8 text-xs font-bold tracking-wider transition-all border-none ${
            userVote?.choice === "AGAINST" 
              ? "bg-red-500 text-white shadow-sm ring-1 ring-red-500 ring-offset-1 ring-offset-background" 
              : "bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white"
          }`}
        >
          {isPending ? <Loader2 className="size-3 animate-spin" /> : <><X className="size-3 mr-1" /> AGAINST</>}
        </Button>
      </div>
    </div>
  );
}