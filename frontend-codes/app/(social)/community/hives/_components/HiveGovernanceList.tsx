"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import HiveGovernanceCard from "./HiveGovernanceCard";
import z from "zod";

export default function HiveGovernanceList({
  proposals,
  currentUserId,
  userEquity,
}: {
  proposals: any[];
  currentUserId: string;
  userEquity: number;
}) {
  const [showArchived, setShowArchived] = useState(false);

  const active = proposals.filter((p) => {
    const expired = new Date() > new Date(p.expiresAt);
    return p.status === "ACTIVE" && !expired;
  });

  const archived = proposals.filter((p) => {
    const expired = new Date() > new Date(p.expiresAt);
    return p.status !== "ACTIVE" || expired;
  });

  return (
    <div className="space-y-8">

      {/* ================= ACTIVE ================= */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Active Proposals</h2>
          <p className="text-sm text-muted-foreground">
            Ongoing decisions that require your vote.
          </p>
        </div>

        {active.length === 0 ? (
          <div className="text-sm text-muted-foreground border rounded-xl p-6 text-center">
            No active proposals
          </div>
        ) : (
          active.map((proposal) => (
            <HiveGovernanceCard
              key={proposal.id}
              proposal={proposal}
              currentUserId={currentUserId}
              userEquity={userEquity}
              forceOpen
            />
          ))
        )}
      </section>

      {/* ================= ARCHIVED ================= */}
      <section className="space-y-4">

        {/* HEADER TOGGLE */}
        <button
          onClick={() => setShowArchived((prev) => !prev)}
          className="w-full flex items-center justify-between border rounded-xl px-4 py-3 hover:bg-muted/50 transition"
        >
          <div className="text-left">
            <h2 className="text-sm font-semibold">
              Archived Proposals
            </h2>
            <p className="text-xs text-muted-foreground">
              Past decisions and outcomes
            </p>
          </div>

          {showArchived ? (
            <ChevronUp className="size-4" />
          ) : (
            <ChevronDown className="size-4" />
          )}
        </button>

        {showArchived && (
          <div className="space-y-3">
            {archived.map((proposal) => (
              <HiveGovernanceCard
                key={proposal.id}
                proposal={proposal}
                currentUserId={currentUserId}
                userEquity={userEquity}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}