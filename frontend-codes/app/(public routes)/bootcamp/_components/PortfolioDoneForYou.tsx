"use client";

import { 
  CheckCircle2, 
  Briefcase, Globe,
  Activity,
  Database,
  LayoutDashboard,
  Code,
  BarChart, 
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MotionDiv, MotionSection } from "@/components/framer-motion/motion-components";
import { useState, useEffect } from "react";

// ==========================================
// MICRO-COMPONENTS (System Demos)
// ==========================================

const PortfolioAutoDemo = () => {
    const [view, setView] = useState<"empty" | "after">("empty");

    return (
        <div className="overflow-hidden rounded-[2.5rem] border border-border/60 bg-card shadow-sm">
            <div className="flex gap-2 border-b border-border/60 bg-muted/30 p-3 sm:p-4">
                <button
                    onClick={() => setView("empty")}
                    className={cn(
                        "w-1/2 rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-300",
                        view === "empty"
                            ? "bg-foreground text-background shadow-md"
                            : "text-muted-foreground hover:bg-muted"
                    )}
                >
                    Day 1: Empty
                </button>

                <button
                    onClick={() => setView("after")}
                    className={cn(
                        "w-1/2 rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-300",
                        view === "after"
                            ? "bg-orange text-white shadow-lg shadow-orange/20"
                            : "text-muted-foreground hover:bg-muted"
                    )}
                >
                    Week 4: Built
                </button>
            </div>

            <div className="flex min-h-[350px] items-center justify-center bg-background p-6 sm:p-10">
                {view === "empty" ? (
                    <MotionDiv
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex w-full flex-col items-center justify-center space-y-4 text-center"
                    >
                        <div className="flex size-20 items-center justify-center rounded-full border border-dashed border-border/60 bg-muted">
                            <LayoutDashboard className="size-8 text-muted-foreground/50" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">
                            No verified projects found.
                        </p>
                        <div className="mt-4 w-full max-w-sm space-y-3 opacity-30">
                            <div className="h-16 rounded-2xl border border-dashed border-border bg-muted" />
                            <div className="h-16 rounded-2xl border border-dashed border-border bg-muted" />
                        </div>
                    </MotionDiv>
                ) : (
                    <MotionDiv
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full space-y-6"
                    >
                        <div className="flex items-end justify-between border-b border-border/50 pb-4">
                            <div>
                                <h3 className="text-xl font-bold text-foreground">Verified Portfolio</h3>
                                <div className="mt-1 flex items-center gap-1.5">
                                    <ShieldCheck className="size-3.5 text-green-500" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-green-500">
                                        Algorithmically Validated
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-3xl font-black text-orange">450</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    Reputation
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {[
                                { t: "Regional Sales Dashboard", tech: "Power BI • DAX", icon: BarChart },
                                { t: "Customer Churn EDA", tech: "Excel • Power Query", icon: Database },
                                { t: "Supply Chain Schema", tech: "Data Modeling", icon: Activity },
                                { t: "Cohort Analysis", tech: "SQL Simulation", icon: Code },
                            ].map((p, i) => (
                                <div
                                    key={i}
                                    className="group space-y-3 rounded-2xl border border-border bg-muted/20 p-4 transition-colors hover:border-orange/30"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="rounded-lg border border-border bg-background p-2 shadow-sm transition-colors group-hover:text-orange">
                                            <p.icon className="size-4" />
                                        </div>
                                        <CheckCircle2 className="size-4 text-green-500/90" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-bold text-foreground">{p.t}</p>
                                        <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                                            {p.tech}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </MotionDiv>
                )}
            </div>
        </div>
    );
};

export default function AutomaticPortfolioSection() {
  return (
    <MotionSection
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="border-y border-border bg-muted/20 py-16 md:py-24"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">

        {/* TEXT: High Economic Outcome & Zero Friction */}
        <div className="space-y-6 md:space-y-8">
          
          <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1.5 shadow-sm">
            <Globe className="size-4 text-green-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-green-600 dark:text-green-400">
              Zero Coding Required
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-[1.1] tracking-tight text-foreground">
            A Portfolio That Gets You Hired. <br />
            <span className="text-orange">Built While You Sleep.</span>
          </h2>

          <div className="space-y-5 text-sm sm:text-base leading-relaxed text-muted-foreground">
            <p>
              Most beginners spend weeks trying to build a website and format their projects. <strong className="text-foreground">We eliminated that friction.</strong> 
            </p>
            <p>
              Every time your work is approved in the sprint, our engine automatically updates your live, recruiter-ready portfolio.
            </p>

            <ul className="space-y-4 pt-4">
              {[
                { title: "Ready for Recruiters", desc: "One clean link to attach to your CV." },
                { title: "Verified Proof of Work", desc: "Shows employers exactly what you contributed." },
                { title: "Hosted For Free", desc: "No domains or hosting fees to worry about." },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-orange" />
                  <div>
                    <span className="font-bold text-foreground block">{item.title}</span>
                    <span className="text-sm text-muted-foreground">{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-border/50 pt-6 mt-6 flex items-center gap-2 text-foreground font-bold">
              <Briefcase className="size-5 text-orange" />
              This is your unfair advantage in the job market.
            </div>
          </div>
        </div>

        {/* DEMO VISUAL */}
        <div className="relative">
          <div className="absolute -inset-4 bg-orange/5 blur-2xl rounded-3xl md:hidden pointer-events-none" />
          <div className="relative scale-[0.98] sm:scale-100 origin-top shadow-2xl shadow-black/5 rounded-2xl">
            {/* Browser Window Mockup */}
            <div className="w-full rounded-t-2xl border-b border-border bg-muted/50 p-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="size-2.5 rounded-full bg-red-400" />
                <div className="size-2.5 rounded-full bg-yellow-400" />
                <div className="size-2.5 rounded-full bg-green-400" />
              </div>
              <div className="mx-auto flex h-6 w-2/3 items-center justify-center rounded-md bg-background text-[10px] text-muted-foreground font-mono">
                hives.africa/portfolio/your-name
              </div>
            </div>
            <PortfolioAutoDemo />
          </div>
        </div>

      </div>
    </MotionSection>
  );
}