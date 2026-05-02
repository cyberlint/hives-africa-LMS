"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Zap, User, CheckCircle2, ShieldCheck, Gift, Briefcase } from "lucide-react";
import { MotionDiv, MotionH1 } from "@/components/framer-motion/motion-components";

// ==========================================
// MICRO-COMPONENT: Live System Preview (Simulates Social Proof & Instant Win)
// ==========================================
const LiveHeroPreview = () => {
  const [rep, setRep] = useState(0);
  const [logs, setLogs] = useState<{ id: number; text: string; type: string }[]>([]);

  useEffect(() => {
    // Tweaked sequence to show immediate, tangible wins
    const sequence = [
      { t: 800, text: "Day 1: Portfolio Shell Created", type: "info", rep: 50 },
      { t: 2500, text: "Project 1: SQL EDA Approved", type: "success", rep: 75 },
      { t: 4500, text: "Live Link Generated & Shared", type: "action", rep: 85 },
      { t: 6500, text: "Recruiter Signal Boosted", type: "success", rep: 120 },
    ];

    const timeouts: ReturnType<typeof setTimeout>[] = [];

    sequence.forEach(({ t, text, type, rep: newRep }, index) => {
      timeouts.push(
        setTimeout(() => {
          setRep(newRep);
          setLogs((prev) => [...prev.slice(-3), { id: index, text, type }]);
        }, t)
      );
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full max-w-[420px] mx-auto rounded-3xl bg-card p-4 sm:p-6 shadow-xl border border-border/50 relative overflow-hidden">
      {/* Subtle glow effect behind the card */}
      <div className="absolute -z-10 inset-0 bg-gradient-to-tr from-orange/5 to-transparent opacity-50" />
      
      {/* Header */}
      <div className="flex items-start justify-between mb-5 gap-4">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="flex size-10 sm:size-11 items-center justify-center rounded-full border border-border/80 bg-background">
            <User className="size-5 text-muted-foreground/70" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-bold truncate">New Builder</p>
            <p className="mt-0.5 flex items-center gap-1 text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-orange">
              <Zap className="size-3 fill-current" />
              {rep} REP
            </p>
          </div>
        </div>

        {/* Live Dot */}
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-bold uppercase tracking-wider text-green-500">Live</span>
          <div className="size-2 rounded-full bg-green-500 shrink-0 animate-pulse" />
        </div>
      </div>

      {/* Logs */}
      <div className="space-y-2 min-h-[160px] sm:min-h-[180px] flex flex-col justify-end">
        {logs.length === 0 && (
          <p className="font-mono text-xs text-muted-foreground animate-pulse text-center">
            Deploying workspace...
          </p>
        )}

        {logs.map((log) => (
          <MotionDiv
            key={log.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 rounded-2xl border border-border/60 bg-background/80 backdrop-blur-sm px-3 sm:px-4 py-2.5 text-xs shadow-sm"
          >
            {log.type === "success" && <CheckCircle2 className="size-4 text-green-500 shrink-0 mt-0.5" />}
            {log.type === "info" && <Briefcase className="size-4 text-blue-400 shrink-0 mt-0.5" />}
            {log.type === "action" && <Zap className="size-4 text-orange shrink-0 mt-0.5" />}

            <span className={`leading-snug ${log.type === "action" ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
              {log.text}
            </span>
          </MotionDiv>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// MAIN COMPONENT: HERO
// ==========================================
export default function HeroSection() {
  return (
    <section className="relative w-full bg-background pt-12 sm:pt-14 lg:pt-20 pb-14 sm:pb-20 lg:pb-24 overflow-hidden">
      
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* LEFT: CONVERSION COPY */}
          <div className="text-center lg:text-left">

            {/* Urgency Badge */}
            <MotionDiv
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-6 sm:mb-8 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 sm:px-4 py-1.5"
            >
              <span className="size-2 rounded-full bg-orange" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-orange">
                Only 100 Seats for Cohort 001
              </span>
            </MotionDiv>

            {/* Headline */}
            <MotionH1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mb-5 sm:mb-6 text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] tracking-tight"
            >
              Stop Learning Data. <br />
              <span className="text-orange">
                Start Building Proof.
              </span>
            </MotionH1>

            {/* Economic Outcome Description */}
            <MotionDiv
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto lg:mx-0 max-w-xl mb-6"
            >
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                {"A 4-week intensive sprint where you don't just watch tutorials. You leave with the exact assets you need to land your first data role"}
              </p>
            </MotionDiv>

            {/* Value Stacking (The "Deal") */}
            <MotionDiv
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mb-8 flex flex-col gap-3 text-sm font-medium text-foreground mx-auto lg:mx-0 max-w-md text-left bg-muted/30 p-4 rounded-2xl border border-border/50"
            >
              <div className="flex items-start gap-2.5">
                <Gift className="size-4 text-orange shrink-0 mt-0.5" />
                <p><strong>Free:</strong> Personal Portfolio Website Hosting</p>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-green-500 shrink-0 mt-0.5" />
                <p>Build 3 real-world projects</p>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-green-500 shrink-0 mt-0.5" />
                <p>No prior experience needed</p>
              </div>
            </MotionDiv>

            {/* CTA & Risk Reversal */}
            <MotionDiv
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center lg:items-start gap-4"
            >
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-orange px-8 py-4 text-base font-bold text-white transition-all shadow-lg shadow-orange/20 hover:scale-[1.02] hover:shadow-orange/30"
              >
                Secure Your Spot Now
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </MotionDiv>

          </div>

          {/* RIGHT: VISUAL PROOF */}
          <div className="flex justify-center lg:justify-end mt-6 lg:mt-0 relative">
            <LiveHeroPreview />
          </div>

        </div>
      </div>
    </section>
  );
}