"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Zap, User, CheckCircle2, Users, Database } from "lucide-react";
import { MotionDiv, MotionH1 } from "@/components/framer-motion/motion-components";

// ==========================================
// MICRO-COMPONENT: Live System Preview
// ==========================================
const LiveHeroPreview = () => {
  const [rep, setRep] = useState(0);
  const [logs, setLogs] = useState<{ id: number; text: string; type: string }[]>([]);

  useEffect(() => {
    const sequence = [
      { t: 800, text: "Joined Hive: Data Alpha", type: "info", rep: 50 },
      { t: 2500, text: "Submission: SQL EDA Approved", type: "success", rep: 75 },
      { t: 4500, text: "Portfolio Item Generated", type: "action", rep: 85 },
      { t: 6500, text: "Peer Review Completed", type: "success", rep: 85 },
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
    <div className="w-full max-w-[420px] mx-auto rounded-3xl bg-card p-4 sm:p-6 shadow-sm border border-border/50">
      
      {/* Header */}
      <div className="flex items-start justify-between mb-5 gap-4">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="flex size-10 sm:size-11 items-center justify-center rounded-full border border-border/80">
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
        <div className="mt-2 size-2 rounded-full bg-green-500 shrink-0" />
      </div>

      {/* Logs */}
      <div className="space-y-2 min-h-[160px] sm:min-h-[180px] flex flex-col justify-end">
        {logs.length === 0 && (
          <p className="font-mono text-xs text-muted-foreground animate-pulse text-center">
            Waiting for activity...
          </p>
        )}

        {logs.map((log) => (
          <MotionDiv
            key={log.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card px-3 sm:px-4 py-2.5 text-xs shadow-sm"
          >
            {log.type === "success" && <CheckCircle2 className="size-4 text-green-500 shrink-0" />}
            {log.type === "info" && <Users className="size-4 text-blue-400 shrink-0" />}
            {log.type === "action" && <Database className="size-4 text-orange shrink-0" />}

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
    <section className="relative w-full bg-background pt-12 sm:pt-14 lg:pt-16 pb-14 sm:pb-20 lg:pb-24">
      
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-8 items-center">
          
          {/* LEFT */}
          <div className="text-center lg:text-left">

            {/* Badge */}
            <MotionDiv
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-6 sm:mb-8 inline-flex items-center gap-2 rounded-full border border-orange/30 px-3 sm:px-4 py-1.5"
            >
              <span className="size-2 rounded-full bg-orange" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-orange">
                Cohort 001 is forming
              </span>
            </MotionDiv>

            {/* Headline */}
            <MotionH1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mb-5 sm:mb-6 text-[2.2rem] sm:text-5xl md:text-6xl lg:text-[4.5rem] font-black leading-[1.05] tracking-tight"
            >
              The Certificate is Dead. <br />
              <span className="text-orange">
                Build Proof.
              </span>
            </MotionH1>

            {/* Description */}
            <MotionDiv
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto lg:mx-0 max-w-[520px] mb-8 sm:mb-10"
            >
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                A 4-week data analytics sprint where your work doesn’t sit in folders — it becomes a verified, public portfolio as you build.
              </p>
            </MotionDiv>

            {/* CTA */}
            <MotionDiv
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex justify-center lg:justify-start"
            >
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-orange px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-white transition-transform hover:scale-[1.02]"
              >
                Register Now
                <ArrowRight className="size-5" />
              </Link>
            </MotionDiv>

          </div>

          {/* RIGHT */}
          <div className="flex justify-center lg:justify-end mt-6 lg:mt-0">
            <LiveHeroPreview />
          </div>

        </div>
      </div>
    </section>
  );
}