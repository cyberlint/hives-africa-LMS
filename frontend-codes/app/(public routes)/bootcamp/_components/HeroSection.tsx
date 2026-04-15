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
    // Timed to simulate the system actions
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
    <div className="w-full max-w-[420px] mx-auto rounded-[2rem] bg-card p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border/50">
      
      {/* Widget Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex size-11 items-center justify-center rounded-full border border-border/80 bg-transparent">
            <User className="size-5 text-muted-foreground/70" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">New Builder</p>
            <p className="mt-0.5 flex items-center gap-1 text-[11px] font-black uppercase tracking-widest text-orange">
              <Zap className="size-3 fill-current" /> {rep} REP
            </p>
          </div>
        </div>

        {/* Live Indicator */}
        <div className="size-2 rounded-full bg-green-500 mt-2" />
      </div>

      {/* Widget Logs */}
      <div className="space-y-3 min-h-[180px] flex flex-col justify-end">
        {logs.length === 0 && (
          <p className="font-mono text-xs text-muted-foreground animate-pulse px-2 text-center">
            Waiting for activity...
          </p>
        )}

        {logs.map((log) => (
          <MotionDiv
            key={log.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 rounded-full border border-border/60 bg-card px-4 py-3 text-xs font-medium shadow-sm"
          >
            {log.type === "success" && <CheckCircle2 className="size-4 text-green-500" />}
            {log.type === "info" && <Users className="size-4 text-[#76c1fb]" />}
            {log.type === "action" && <Database className="size-4 text-orange" />}
            
            <span className={log.type === "action" ? "font-bold text-foreground" : "text-muted-foreground"}>
              {log.text}
            </span>
          </MotionDiv>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// MAIN COMPONENT: Hero Section
// ==========================================
export default function HeroSection() {
  return (
    <section className="relative w-full bg-background pt-10 pb-16 lg:pt-16 lg:pb-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">
          
          {/* LEFT CONTENT */}
          <div className="z-10 text-center lg:text-left">
            
            {/* Badge */}
            <MotionDiv
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-orange/30 bg-transparent px-4 py-1.5"
            >
              <span className="size-2 rounded-full bg-orange" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-orange sm:text-xs">
                Cohort 001 is now forming
              </span>
            </MotionDiv>

            {/* Headline */}
            <MotionH1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6 text-[2.5rem] font-black leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-[4.5rem]"
            >
              The Certificate is Dead. <br />
              <span className="text-orange">
                Build Proof.
              </span>
            </MotionH1>

            {/* Description */}
            <MotionDiv
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mb-10 max-w-[500px] space-y-4 text-balance lg:mx-0"
            >
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                {"A 4-week data analytics sprint where your work doesn't sit in folders — it becomes a verified, public portfolio as you build."}
              </p>
            </MotionDiv>

            {/* CTA */}
            <MotionDiv
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex justify-center lg:justify-start"
            >
              <Link
                href="/register"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange px-8 py-4 text-sm font-bold text-white transition-transform hover:scale-[1.02] sm:w-auto sm:text-base"
              >
                Register Now
                <ArrowRight className="size-5" />
              </Link>
            </MotionDiv>
          </div>

          {/* RIGHT PREVIEW */}
          <MotionDiv
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex w-full items-center justify-center lg:justify-end"
          >
            <LiveHeroPreview />
          </MotionDiv>

        </div>
      </div>
    </section>
  );
}