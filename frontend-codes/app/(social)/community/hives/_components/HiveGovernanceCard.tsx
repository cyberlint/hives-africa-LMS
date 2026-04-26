"use client";

import { useTransition, useState } from "react";
import { MotionDiv } from "@/components/framer-motion/motion-components";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Scale,
  Timer,
  ShieldAlert,
  Check,
  X,
  UserX,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { castVote } from "../../actions.governance";
import { toast } from "sonner";
import { ProposalStatusType, ProposalStatusEnum } from "@/lib/zodSchemas";

export default function HiveGovernanceCard({
  proposal,
  currentUserId,
  userEquity,
  forceOpen = false,
}: {
  proposal: any;
  currentUserId: string;
  userEquity: number;
  forceOpen?: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const isExpired = new Date() > new Date(proposal.expiresAt);
  const isActive = proposal.status === "ACTIVE" && !isExpired;

  const [isOpen, setIsOpen] = useState(forceOpen || isActive);

  const userVote = proposal.votes.find(
    (v: any) => v.userId === currentUserId
  );

  /* ================= EQUITY ================= */

  const equityFor =
    proposal.votes
      .filter((v: any) => v.choice === "FOR")
      .reduce((acc: number, v: any) => acc + v.voteWeight, 0) * 100;

  const equityAgainst =
    proposal.votes
      .filter((v: any) => v.choice === "AGAINST")
      .reduce((acc: number, v: any) => acc + v.voteWeight, 0) * 100;

  const total = equityFor + equityAgainst;
  const pctFor = total ? (equityFor / total) * 100 : 0;
  const pctAgainst = total ? (equityAgainst / total) * 100 : 0;

  /* ================= HELPERS ================= */

  const getTypeIcon = () => {
    if (
      proposal.type === "IMPEACHMENT" ||
      proposal.type === "MEMBER_EXPULSION"
    )
      return <UserX className="size-4" />;
    if (proposal.type === "POLICY_CHANGE")
      return <Scale className="size-4" />;
    return <ShieldAlert className="size-4" />;
  };

  const handleVote = (choice: "FOR" | "AGAINST") => {
    startTransition(async () => {
      const res = await castVote({
        proposalId: proposal.id,
        userId: currentUserId,
        choice,
      });

      if (res.success) {
        toast.success(`Vote recorded (${userEquity * 100}% weight)`);
      } else {
        toast.error(res.error || "Failed to vote.");
      }
    });
  };

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full rounded-xl border p-4 sm:p-5 space-y-4 transition ${
        isActive
          ? "bg-orange/5 border-orange/20 shadow-sm"
          : "bg-card"
      }`}
    >
      {/* HEADER */}
      <div
        className="flex items-start justify-between gap-3 cursor-pointer"
        onClick={() => !isActive && setIsOpen((prev) => !prev)}
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 text-muted-foreground">
            {getTypeIcon()}
          </div>

          <div className="min-w-0">
            <p className="text-sm sm:text-base font-semibold leading-tight">
              {proposal.title}
            </p>

            {isActive && (
              <p className="text-[11px] text-orange font-medium mt-0.5">
                Voting in progress
              </p>
            )}

            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge variant="outline" className="text-[10px]">
                {proposal.type.replace(/_/g, " ")}
              </Badge>

              <Badge
                className={`text-[10px] ${
                  proposal.status === "PASSED" ||
                  proposal.status === "EXECUTED"
                    ? "bg-green-500/10 text-green-600"
                    : proposal.status === "FAILED"
                    ? "bg-red-500/10 text-red-600"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isExpired && proposal.status === "ACTIVE"
                  ? "RESOLVING"
                  : proposal.status}
              </Badge>
            </div>
          </div>
        </div>

        {!isActive && (
          <div className="text-muted-foreground">
            {isOpen ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </div>
        )}
      </div>

      {/* CONTENT */}
      {isOpen && (
        <div className="space-y-4">

          <p className="text-sm text-muted-foreground leading-relaxed">
            {proposal.description}
          </p>

          {/* PROGRESS */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-green-600">
                For ({equityFor.toFixed(1)}%)
              </span>
              <span className="text-red-600">
                Against ({equityAgainst.toFixed(1)}%)
              </span>
            </div>

            <div className="h-2 w-full rounded-full bg-muted overflow-hidden flex">
              <div
                className="bg-green-500"
                style={{ width: `${pctFor}%` }}
              />
              <div
                className="bg-red-500"
                style={{ width: `${pctAgainst}%` }}
              />
            </div>

            <p className="text-[11px] text-center text-muted-foreground">
              {total.toFixed(1)}% participation
            </p>
          </div>

          {/* FOOTER */}
          {isActive ? (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Timer className="size-4" />
                {formatDistanceToNow(new Date(proposal.expiresAt))} left
              </div>

              <div className="flex gap-2 w-full sm:w-auto sm:ml-auto">
                <Button
                  size="sm"
                  disabled={isPending}
                  onClick={() => handleVote("FOR")}
                  className={`flex-1 sm:flex-none ${
                    userVote?.choice === "FOR"
                      ? "bg-green-600 text-white"
                      : "bg-green-500/10 text-green-600 hover:bg-green-600 hover:text-white"
                  }`}
                >
                  {isPending ? (
                    <Loader2 className="animate-spin size-4" />
                  ) : (
                    <>
                      <Check className="size-4 mr-1" /> For
                    </>
                  )}
                </Button>

                <Button
                  size="sm"
                  disabled={isPending}
                  onClick={() => handleVote("AGAINST")}
                  className={`flex-1 sm:flex-none ${
                    userVote?.choice === "AGAINST"
                      ? "bg-red-600 text-white"
                      : "bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white"
                  }`}
                >
                  {isPending ? (
                    <Loader2 className="animate-spin size-4" />
                  ) : (
                    <>
                      <X className="size-4 mr-1" /> Against
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-xs text-muted-foreground">
              <span>
                {proposal.isAnonymous
                  ? "Anonymous"
                  : proposal.creatorName}
              </span>
              <span>
                {new Date(proposal.expiresAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      )}
    </MotionDiv>
  );
}