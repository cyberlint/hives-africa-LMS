"use client";

import {
  LayoutDashboard,
  Database,
  Trophy,
  GitCommit,
  Users,
  CheckCircle2,
  BarChart3,
  Zap,
  ShieldCheck,
  User,
} from "lucide-react";
import { MotionDiv, MotionSection } from "@/components/framer-motion/motion-components";

export default function WalkawaySection() {
  return (
    <MotionSection
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="relative border-y border-border/50 bg-muted/20 py-14 md:py-24 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10" />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="mb-10 md:mb-16 max-w-2xl space-y-5 text-center md:text-left">
          <MotionDiv
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 shadow-sm"
          >
            <ShieldCheck className="size-4 text-orange" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">
              Return on Investment
            </span>
          </MotionDiv>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black leading-[1.1] tracking-tight">
            Assets That <span className="text-orange">Compound.</span>
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto md:mx-0">
            Most programs end with a certificate. This one leaves you with algorithmic proof tied to action.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[minmax(260px,auto)]">

          {/* CARD 1 */}
          <div className="md:col-span-2 rounded-[2rem] border border-border/60 bg-card p-5 sm:p-7 md:p-8 overflow-hidden relative flex flex-col gap-6">
            <div className="absolute -right-24 -top-24 size-64 bg-orange/5 blur-3xl" />

            <div className="space-y-3 z-10">
              <div className="flex items-center gap-3">
                <div className="size-10 sm:size-12 rounded-xl border border-border bg-background flex items-center justify-center">
                  <LayoutDashboard className="size-5" />
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold">A Live Public Portfolio</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every submission is verified and published to your profile.
              </p>
            </div>

            {/* MOCK (mobile-safe now) */}
            <div className="w-full rounded-xl border border-border bg-muted/40 p-4 sm:p-5">
              <div className="flex gap-2 mb-3">
                <div className="size-2 bg-border rounded-full" />
                <div className="size-2 bg-border rounded-full" />
                <div className="size-2 bg-border rounded-full" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="size-9 sm:size-10 rounded-full border bg-background" />
                  <div className="space-y-2">
                    <div className="h-2 w-24 bg-background border rounded" />
                    <div className="h-1.5 w-14 bg-orange/20 rounded" />
                  </div>
                </div>

                <div className="h-16 sm:h-20 rounded-xl border bg-background flex items-center justify-center">
                  <Database className="opacity-30" />
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="rounded-[2rem] border border-border/60 bg-card p-5 sm:p-7 flex flex-col justify-between relative overflow-hidden min-h-[220px]">
            <div className="space-y-3">
              <BarChart3 className="size-6" />
              <h3 className="text-lg font-bold">Production Dashboard</h3>
              <p className="text-sm text-muted-foreground">
                Real Power BI execution.
              </p>
            </div>
            <BarChart3 className="absolute -bottom-6 -right-6 size-32 opacity-10" />
          </div>

          {/* CARD 3 */}
          <div className="rounded-[2rem] border border-border/60 bg-card p-5 sm:p-7 flex flex-col justify-between relative overflow-hidden min-h-[220px]">
            <Trophy className="size-6" />
            <div>
              <h3 className="text-lg font-bold">Your First 50 Rep</h3>
              <p className="text-sm text-muted-foreground">
                Earned, not given.
              </p>
            </div>
            <div className="absolute bottom-2 right-3 text-6xl opacity-10 font-black">
              50
            </div>
          </div>

          {/* CARD 4 */}
          <div className="rounded-[2rem] border border-border/60 bg-card p-5 sm:p-7 flex flex-col gap-3 min-h-[220px]">
            <GitCommit className="size-6" />
            <h3 className="text-lg font-bold">Verifiable Work</h3>
            <p className="text-sm text-muted-foreground">
              Every contribution tracked.
            </p>
          </div>

          {/* CARD 5 */}
          <div className="rounded-[2rem] border border-orange/20 bg-orange/5 p-5 sm:p-7 flex flex-col gap-3 relative overflow-hidden min-h-[220px]">
            <Users className="size-6 text-orange" />
            <h3 className="text-lg font-bold">Your Hive</h3>
            <p className="text-sm text-muted-foreground">
              Shared execution, not passive learning.
            </p>

            {/* avatars now safe */}
            <div className="flex gap-2 mt-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="size-8 rounded-full border bg-background flex items-center justify-center">
                  <User className="size-3 text-orange" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-10 md:mt-16 flex flex-col sm:flex-row gap-3 justify-center">
          <Badge text="Not certificates" />
          <Badge text="Not claims" />
          <Badge text="Proof tied to action" highlight />
        </div>
      </div>
    </MotionSection>
  );
}

function Badge({
  text,
  highlight,
}: {
  text: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        "flex items-center justify-center gap-2 rounded-full px-4 py-2 border text-xs font-bold uppercase tracking-widest",
        highlight
          ? "bg-orange/10 border-orange/30 text-orange"
          : "bg-card border-border text-foreground",
      ].join(" ")}
    >
      {highlight ? <Zap className="size-3" /> : <CheckCircle2 className="size-3" />}
      {text}
    </div>
  );
}