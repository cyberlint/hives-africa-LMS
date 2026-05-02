"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  TerminalSquare,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Download,
  Database,
  FileText,
  Hexagon,
  Lock,
} from "lucide-react";
import { MotionDiv } from "@/components/framer-motion/motion-components";
import confetti from "canvas-confetti";

// ==========================================
// DATA
// ==========================================
const onboardingSteps = [
  {
    id: "hive",
    title: "Enter Your NextHive Squad",
    desc: "No Slack. No Discord. Join your dedicated Hive directly on our platform to meet your accountability partners and vote on squad rules.",
    icon: Hexagon,
    actionText: "Join Hive Alpha",
    actionLink: "/hives/cohort-001",
  },
  {
    id: "calendar",
    title: "Sync Execution Calendar",
    desc: "Lock in the live execution sessions and sprint deadlines. If it's not on your calendar, you will fall behind.",
    icon: CalendarCheck,
    actionText: "Download Invite (.ics)",
    actionLink: "/api/calendar-invite",
  },
  {
    id: "workspace",
    title: "Configure Your Environment",
    desc: "Install Power BI Desktop and set up your PostgreSQL environment before Day 1.",
    icon: TerminalSquare,
    actionText: "View Setup Guide",
    actionLink: "/resources/setup",
  },
];

const resources = [
  {
    title: "The 'Day 0' Warmup Dataset",
    desc: "A messy CSV to test your local environment.",
    icon: Database,
    size: "2.4 MB",
    locked: false,
  },
  {
    title: "SQL & DAX Execution Cheatsheet",
    desc: "The only syntax you need to survive Week 1 and 2.",
    icon: FileText,
    size: "1.1 MB",
    locked: false,
  },
  {
    title: "Week 1 Client Brief",
    desc: "The actual business problem you will be solving.",
    icon: Lock,
    size: "Unlocks May 15",
    locked: true,
  },
];

export default function CommandCenter() {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const progress = (completedSteps.length / onboardingSteps.length) * 100;

  useEffect(() => {
    if (completedSteps.length === onboardingSteps.length) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FDB606", "#10B981", "#FFFFFF"],
      });
    }
  }, [completedSteps]);

  const toggleStep = (id: string) => {
    setCompletedSteps((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <section className="min-h-screen bg-background pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 border-b border-border/50 pb-8"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            
            <div className="max-w-2xl space-y-4">
              <h1 className="text-4xl font-black tracking-tight text-foreground md:text-5xl">
                Cohort 001 <br className="hidden sm:block" />
                <span className="text-orange">Command Center.</span>
              </h1>

              <p className="text-base text-muted-foreground">
                Sprint begins{" "}
                <strong className="text-foreground">Monday, May 15th</strong>.
                Prepare your assets now.
              </p>
            </div>

            <Link
              href="/dashboard"
              className={`hidden md:inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-bold transition-all ${
                progress === 100
                  ? "bg-orange text-white shadow-lg shadow-orange/20 hover:scale-105"
                  : "bg-muted text-muted-foreground pointer-events-none"
              }`}
            >
              Enter Dashboard
              <ArrowRight className="size-5" />
            </Link>
          </div>
        </MotionDiv>

        {/* GRID */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          
          {/* LEFT */}
          <div className="space-y-6 lg:col-span-2">
            
            {/* PROGRESS */}
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-border/60 bg-card p-6"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
                  <Zap className="size-4 text-orange" />
                  Pre-Flight Checklist
                </h3>
                <span className="text-sm font-bold text-orange">
                  {Math.round(progress)}%
                </span>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-orange transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </MotionDiv>

            {/* ITEMS */}
            <div className="space-y-4">
              {onboardingSteps.map((step, i) => {
                const done = completedSteps.includes(step.id);

                return (
                  <MotionDiv
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`rounded-2xl border p-6 transition ${
                      done
                        ? "border-green-500/20 bg-green-500/5"
                        : "border-border/60 bg-card hover:border-orange/30"
                    }`}
                  >
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                      
                      {/* LEFT */}
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex size-12 items-center justify-center rounded-xl border ${
                            done
                              ? "border-green-500/30 bg-green-500/20 text-green-600"
                              : "border-border bg-muted"
                          }`}
                        >
                          {done ? (
                            <CheckCircle2 className="size-6" />
                          ) : (
                            <step.icon className="size-6" />
                          )}
                        </div>

                        <div>
                          <h4 className="text-lg font-bold">
                            {step.title}
                          </h4>
                          <p className="mt-1 max-w-md text-sm text-muted-foreground">
                            {step.desc}
                          </p>
                        </div>
                      </div>

                      {/* ACTION */}
                      <div className="flex flex-col items-end gap-2">
                        <a
                          href={step.actionLink}
                          onClick={() => !done && toggleStep(step.id)}
                          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                            done
                              ? "bg-muted text-muted-foreground"
                              : "bg-orange text-white shadow-md shadow-orange/20 hover:scale-105"
                          }`}
                        >
                          {step.actionText}
                        </a>

                        <button
                          onClick={() => toggleStep(step.id)}
                          className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
                        >
                          {done ? "Mark incomplete" : "Mark done"}
                        </button>
                      </div>
                    </div>
                  </MotionDiv>
                );
              })}
            </div>
          </div>

          {/* RIGHT */}
          <MotionDiv
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 rounded-2xl border border-border/60 bg-card p-6">
              
              <h3 className="mb-6 text-sm font-bold uppercase tracking-widest">
                Mission Assets
              </h3>

              <div className="space-y-4">
                {resources.map((res, i) => (
                  <div
                    key={i}
                    className={`flex gap-4 rounded-xl border p-4 ${
                      res.locked
                        ? "opacity-70 bg-muted/30"
                        : "bg-background hover:border-orange/30"
                    }`}
                  >
                    <div
                      className={`rounded-lg p-2 ${
                        res.locked
                          ? "bg-muted text-muted-foreground"
                          : "bg-orange/10 text-orange"
                      }`}
                    >
                      <res.icon className="size-5" />
                    </div>

                    <div className="flex-1">
                      <h4 className="text-sm font-bold">{res.title}</h4>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {res.desc}
                      </p>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">
                          {res.size}
                        </span>

                        {!res.locked && (
                          <Download className="size-4 text-orange hover:opacity-80" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/dashboard"
                className={`mt-8 flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-bold md:hidden ${
                  progress === 100
                    ? "bg-orange text-white shadow-lg shadow-orange/20"
                    : "bg-muted text-muted-foreground pointer-events-none"
                }`}
              >
                Enter Dashboard
                <ArrowRight className="size-5" />
              </Link>
            </div>
          </MotionDiv>
        </div>
      </div>
    </section>
  );
}