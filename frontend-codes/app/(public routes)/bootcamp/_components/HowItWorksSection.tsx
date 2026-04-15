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
// DATA & MOCK UIs
// ==========================================
const engineSteps = [
  {
    id: "01",
    title: "Enter NextHive",
    desc: "Create your account. Verify it. Your identity is anchored. Your profile goes live.",
    icon: User,
    mockUI: (
      <div className="w-full max-w-[220px] space-y-3">
        <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3 shadow-sm">
          <div className="flex size-10 items-center justify-center rounded-full border border-border bg-muted">
            <User className="size-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <div className="mb-2 h-2 w-1/2 rounded-full bg-border" />
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="size-3 text-green-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">Anchored</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "02",
    title: "Join or Form a Hive",
    desc: "You don't float through the program. You operate inside a team structure with defined participation and shared output.",
    icon: Users,
    mockUI: (
      <div className="w-full max-w-[220px] space-y-4 rounded-xl border border-border/60 bg-card p-4 shadow-sm">
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Active Hive</div>
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex size-8 items-center justify-center rounded-full border-2 border-card bg-muted">
                <User className="size-3 text-muted-foreground" />
              </div>
            ))}
          </div>
          <div className="text-xs font-bold text-foreground">Data Alpha</div>
        </div>
      </div>
    ),
  },
  {
    id: "03",
    title: "Execute Activities",
    desc: "You don't “complete lessons.” You complete Activities — real tasks, projects, and challenges with:",
    bullets: [
      "Defined requirements (datasets, repos, reports)",
      "Deadlines and difficulty levels",
      "Solo or team-based execution"
    ],
    icon: Activity,
    mockUI: (
      <div className="w-full max-w-[240px] space-y-3 rounded-xl border border-border/60 bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-bold uppercase tracking-widest text-orange">Activity Executing</div>
          <Activity className="size-3 text-orange" />
        </div>
        <div className="space-y-1">
          {/* Integrated directly from the bootcamp roadmap PDF */}
          <div className="text-sm font-bold text-foreground">Full EDA & QA [cite: 336]</div>
          <div className="text-[11px] leading-tight text-muted-foreground">Profile 1,000-row dirty dataset [cite: 127, 129]</div>
        </div>
        <div className="flex gap-2 pt-1">
          <span className="rounded bg-muted px-2 py-1 text-[9px] font-bold uppercase text-foreground">Dataset Provided [cite: 122]</span>
        </div>
      </div>
    ),
  },
  {
    id: "04",
    title: "Submit Work → Get Reviewed",
    desc: "Every output goes through:",
    bullets: [
      "Structured submission",
      "Peer + mentor review",
      "Scoring and feedback"
    ],
    closing: "No silent completion. No hidden work.",
    icon: FileCheck2,
    mockUI: (
      <div className="w-full max-w-[240px] space-y-3 rounded-xl border border-border/60 bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-border/50 pb-2">
          <FileCheck2 className="size-4 text-foreground" />
          <span className="text-xs font-bold text-foreground">Review Consensus</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">Peer Validation</span>
            <span className="flex items-center gap-1 font-bold text-green-500"><CheckCircle2 className="size-3"/> Approved</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">Mentor QA</span>
            <span className="flex items-center gap-1 font-bold text-green-500"><CheckCircle2 className="size-3"/> Approved</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "05",
    title: "Earn Verified Proof",
    desc: "Once approved:",
    bullets: [
      "Your work becomes a portfolio asset",
      "Your contributions are split and validated (even in teams)",
      "Your reputation is updated"
    ],
    closing: "Nothing is lost. Everything compounds.",
    icon: ShieldCheck,
    mockUI: (
      <div className="w-full max-w-[240px] space-y-3 rounded-xl border border-border/60 bg-card p-4 shadow-sm">
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Ledger Update</div>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-bold text-foreground">Portfolio Minted</div>
            <div className="text-[10px] text-muted-foreground">Immutable Record</div>
          </div>
          <div className="flex items-center gap-1 rounded-md bg-orange/10 px-2 py-1 text-orange">
            <Zap className="size-3 fill-current" />
            <span className="text-xs font-black">+75 REP</span>
          </div>
        </div>
      </div>
    ),
  }
];

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function HowItWorksSection() {
  return (
    <section className="bg-background py-16 md:py-24 lg:py-32">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Responsive Flex Layout: Stacks on mobile, splits 1/3 and 2/3 on desktop */}
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          
          {/* LEFT: Sticky Header */}
          <div className="lg:w-1/3 shrink-0">
            <div className="sticky top-24 lg:pr-8">
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-4 py-1.5 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">How This Works</span>
                </div>
                <h2 className="text-4xl font-black leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl text-balance">
                  {"The work"} <br className="hidden lg:block" />
                  <span className="text-orange">engine.</span>
                </h2>
              </MotionDiv>
            </div>
          </div>

          {/* RIGHT: Step Cards */}
          <div className="flex lg:w-2/3 flex-col gap-6">
            {engineSteps.map((step, index) => (
              <MotionDiv
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group flex flex-col sm:flex-row gap-6 sm:gap-8 rounded-[2rem] border border-border/50 bg-card p-6 sm:p-8 shadow-sm transition-all duration-300 hover:border-orange/30 hover:shadow-md overflow-hidden relative"
              >
                {/* Background Watermark Number */}
                <div className="absolute -right-4 -bottom-6 text-[8rem] font-black text-foreground/[0.02] pointer-events-none select-none transition-transform duration-500 group-hover:-translate-y-2 group-hover:-translate-x-2">
                  {step.id}
                </div>

                {/* Text Content */}
                <div className="flex-1 space-y-4 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-[1rem] border border-border/50 bg-background shadow-sm transition-colors group-hover:border-orange/20 group-hover:text-orange">
                      <step.icon className="size-5" />
                    </div>
                    <span className="text-2xl font-black text-border/60 transition-colors group-hover:text-orange/30">
                      {step.id}
                    </span>
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                    {step.title}
                  </h3>
                  
                  <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                    {step.desc}
                  </p>

                  {/* Bullet Points */}
                  {step.bullets && (
                    <ul className="space-y-2.5 pt-2">
                      {step.bullets.map((bullet, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-orange" />
                          <span className="text-sm font-medium text-foreground">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Closing Text */}
                  {step.closing && (
                    <div className="pt-4 border-t border-border/50">
                      <p className="text-xs font-bold uppercase tracking-widest text-foreground">
                        {step.closing}
                      </p>
                    </div>
                  )}
                </div>

                {/* Mock UI Element - Responsive container */}
                <div className="w-full sm:w-[260px] md:w-[300px] shrink-0 flex items-center justify-center rounded-2xl bg-muted/20 border border-border/40 p-6 relative z-10">
                  {step.mockUI}
                </div>
              </MotionDiv>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}