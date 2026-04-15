"use client";

import { 
  User, 
  Users, 
  Activity, 
  FileCheck2, 
  ShieldCheck,
  CheckCircle2,
  Zap
} from "lucide-react";
import { MotionDiv } from "@/components/framer-motion/motion-components";

// ==========================================
// DATA
// ==========================================
const engineSteps = [
  {
    id: "01",
    title: "Enter NextHive",
    desc: "Create your account. Verify it. Your identity is anchored. Your profile goes live.",
    icon: User,
    mockUI: (
      <div className="w-full max-w-[220px] space-y-3">
        <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3">
          <div className="flex size-10 items-center justify-center rounded-full border border-border bg-muted">
            <User className="size-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <div className="mb-2 h-2 w-1/2 rounded-full bg-border" />
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="size-3 text-green-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Anchored
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
  },

  {
    id: "02",
    title: "Join or Form a Hive",
    desc: "You operate inside a team structure with defined participation and shared output.",
    icon: Users,
    mockUI: (
      <div className="w-full max-w-[220px] rounded-xl border border-border/60 bg-card p-4">
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Active Hive
        </div>
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex size-7 items-center justify-center rounded-full border-2 border-card bg-muted"
              >
                <User className="size-3 text-muted-foreground" />
              </div>
            ))}
          </div>
          <div className="text-xs font-bold">Data Alpha</div>
        </div>
      </div>
    ),
  },

  {
    id: "03",
    title: "Execute Activities",
    desc: "You complete structured tasks with real datasets, repos, and requirements.",
    bullets: [
      "Defined datasets, repos, reports",
      "Clear deadlines & difficulty levels",
      "Solo or team execution"
    ],
    icon: Activity,
    mockUI: (
      <div className="w-full max-w-[240px] space-y-3 rounded-xl border border-border/60 bg-card p-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-orange">
            Activity
          </span>
          <Activity className="size-3 text-orange" />
        </div>
        <div>
          <div className="text-sm font-bold">Full EDA & QA</div>
          <div className="text-[11px] text-muted-foreground">
            Clean & profile dataset
          </div>
        </div>
      </div>
    ),
  },

  {
    id: "04",
    title: "Submit → Get Reviewed",
    desc: "Structured submission, peer review, and scoring.",
    bullets: [
      "Structured submission",
      "Peer + mentor review",
      "Scoring & feedback"
    ],
    closing: "No silent completion.",
    icon: FileCheck2,
    mockUI: (
      <div className="w-full max-w-[240px] rounded-xl border border-border/60 bg-card p-4">
        <div className="text-xs font-bold mb-3">Review Status</div>

        <div className="space-y-2 text-[11px]">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Peer</span>
            <span className="text-green-500 font-bold">Approved</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mentor</span>
            <span className="text-green-500 font-bold">Approved</span>
          </div>
        </div>
      </div>
    ),
  },

  {
    id: "05",
    title: "Earn Verified Proof",
    desc: "Approved work becomes portfolio assets and updates your reputation.",
    bullets: [
      "Portfolio asset minted",
      "Contribution validated",
      "Reputation updated"
    ],
    closing: "Everything compounds.",
    icon: ShieldCheck,
    mockUI: (
      <div className="w-full max-w-[240px] rounded-xl border border-border/60 bg-card p-4">
        <div className="text-[10px] font-bold uppercase text-muted-foreground mb-2">
          Ledger Update
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold">Portfolio Minted</div>
            <div className="text-[10px] text-muted-foreground">Immutable</div>
          </div>

          <div className="flex items-center gap-1 rounded-md bg-orange/10 px-2 py-1 text-orange">
            <Zap className="size-3" />
            <span className="text-xs font-black">+REP</span>
          </div>
        </div>
      </div>
    ),
  }
];

// ==========================================
// COMPONENT
// ==========================================
export default function HowItWorksSection() {
  return (
    <section className="bg-background py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">

          {/* LEFT HEADER */}
          <div className="lg:w-1/3">
            <div className="lg:sticky lg:top-24">
              <MotionDiv
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="mb-5 inline-flex rounded-full border border-border px-4 py-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    How it works
                  </span>
                </div>

                <h2 className="text-3xl sm:text-5xl font-black leading-[1.05]">
                  The Work <br />
                  <span className="text-orange">Engine</span>
                </h2>
              </MotionDiv>
            </div>
          </div>

          {/* RIGHT STEPS */}
          <div className="lg:w-2/3 flex flex-col gap-6">

            {engineSteps.map((step, i) => (
              <MotionDiv
                key={step.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="
                  relative flex flex-col gap-6
                  rounded-2xl border border-border/50
                  bg-card p-5 sm:p-7
                  lg:flex-row lg:items-center
                "
              >

                {/* MOBILE-FRIENDLY NUMBER (reduced noise) */}
                <div className="absolute right-4 top-4 text-5xl font-black text-foreground/5 lg:text-[7rem] lg:-bottom-10 lg:right-10">
                  {step.id}
                </div>

                {/* TEXT */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <step.icon className="size-5 text-foreground" />
                    <span className="text-sm font-bold">{step.title}</span>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>

                  {step.bullets && (
                    <ul className="space-y-2">
                      {step.bullets.map((b, idx) => (
                        <li key={idx} className="flex gap-2 text-sm">
                          <CheckCircle2 className="size-4 text-orange shrink-0 mt-0.5" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}

                  {step.closing && (
                    <p className="text-xs font-bold uppercase tracking-widest pt-2 border-t border-border/40">
                      {step.closing}
                    </p>
                  )}
                </div>

                {/* MOCK UI — MOBILE STACK FIX */}
                <div className="w-full lg:w-[260px] flex justify-center lg:justify-end">
                  <div className="scale-95 sm:scale-100">
                    {step.mockUI}
                  </div>
                </div>

              </MotionDiv>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}