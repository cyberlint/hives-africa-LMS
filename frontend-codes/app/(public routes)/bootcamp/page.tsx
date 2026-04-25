"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    ShieldCheck,
    Zap,
    Users,
    GitCommit,
    Trophy,
    ChevronDown,
    ArrowRight,
    CheckCircle2,
    Lock,
    Activity,
    Database,
    LayoutDashboard,
    Code,
    BarChart,
    Terminal,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
    MotionDiv,
    MotionSection,
} from "@/components/framer-motion/motion-components";
import HeroSection from "./_components/HeroSection";
import WalkawaySection from "./_components/WalkawaySection";
import HowItWorksSection from "./_components/HowItWorksSection";

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

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================

export default function CohortLandingPage() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    return (
        <main className="-mb-16 bg-background">
            {/* 1. HERO SECTION */}
            <HeroSection />

            {/* 2. WHAT YOU WALK AWAY WITH */}
            <WalkawaySection />

            {/* 3. THE WORK ENGINE (Dual Card Layout) */}
            <HowItWorksSection />

            {/* 4. PORTFOLIO AUTO-GENERATION */}
            <MotionSection
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="border-y border-border bg-muted/30 py-14 md:py-24"
            >
                <div className="mx-auto grid max-w-7xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">

                    {/* TEXT */}
                    <div className="space-y-6 md:space-y-8">
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-black leading-[1.1] tracking-tight text-foreground">
                            Your Portfolio,
                            <br />
                            Already Working.
                        </h2>

                        <div className="space-y-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
                            <p>
                                Your portfolio is not something you build after. It is generated
                                automatically from approved submissions and verified contributions.
                            </p>

                            <ul className="space-y-3 pt-2">
                                {[
                                    "What you worked on",
                                    "How you approached it",
                                    "What you actually contributed",
                                ].map((li, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-orange" />
                                        <span className="font-medium text-foreground">{li}</span>
                                    </li>
                                ))}
                            </ul>

                            <p className="border-t border-border/50 pt-4 text-[11px] sm:text-xs font-black uppercase tracking-widest text-foreground">
                                One link. Clear signal.
                            </p>
                        </div>
                    </div>

                    {/* DEMO */}
                    <div className="relative">
                        {/* subtle mobile separation glow */}
                        <div className="absolute -inset-4 bg-orange/5 blur-2xl rounded-3xl md:hidden pointer-events-none" />

                        <div className="relative scale-[0.98] sm:scale-100 origin-top">
                            <PortfolioAutoDemo />
                        </div>
                    </div>

                </div>
            </MotionSection>

            {/* 5. 4-WEEK BLUEPRINT */}
            <MotionSection
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative bg-background py-14 md:py-24"
            >
                {/* Grid background (softened for mobile readability) */}
                <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:24px_24px]" />

                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

                    {/* HEADER */}
                    <div className="mb-10 space-y-3 text-center md:mb-16">
                        <h2 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">
                            The 4-Week Blueprint
                        </h2>

                        <p className="text-[10px] font-black uppercase tracking-widest text-orange md:text-xs">
                            Execution-focused. No dead weight.
                        </p>
                    </div>

                    {/* GRID */}
                    <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                        {[
                            {
                                w: "Week 1",
                                t: "Foundation",
                                d: "Analytics lifecycle. Structured thinking. Excel-based modeling.",
                            },
                            {
                                w: "Week 2",
                                t: "Data Handling",
                                d: "EDA, cleaning, transformation using Power Query.",
                            },
                            {
                                w: "Week 3",
                                t: "Intelligence Layer",
                                d: "Data modeling + DAX. Build decision-grade dashboards.",
                            },
                            {
                                w: "Week 4",
                                t: "Capstone Deployment",
                                d: "End-to-end execution. Reviewed. Approved. Published to your portfolio.",
                            },
                        ].map((wk, i) => (
                            <div
                                key={i}
                                className="
            group relative overflow-hidden
            rounded-2xl border border-border/50 bg-card
            p-5 sm:p-7
            shadow-sm
            transition-all duration-300

            hover:border-orange/30 hover:shadow-lg
            active:scale-[0.99]
          "
                            >
                                {/* subtle timeline marker */}
                                <div className="absolute left-0 top-6 h-10 w-1 rounded-r-full bg-orange/10 group-hover:bg-orange/20" />

                                <div className="pl-3 sm:pl-4 space-y-2">
                                    {/* Week label */}
                                    <div className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-orange transition-colors">
                                        {wk.w}
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg sm:text-xl font-bold text-foreground leading-snug">
                                        {wk.t}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        {wk.d}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* subtle footer hint */}
                    <div className="mt-10 text-center">
                        <p className="text-xs font-medium text-muted-foreground">
                            Each week builds directly into your verified portfolio
                        </p>
                    </div>
                </div>
            </MotionSection>

            {/* 6. FAQ */}
            <MotionSection
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="border-t border-border bg-muted/30 py-14 md:py-24"
            >
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

                    {/* HEADER */}
                    <h2 className="mb-10 md:mb-12 text-center text-3xl font-black tracking-tight text-foreground md:text-4xl">
                        Critical Details
                    </h2>

                    {/* FAQ LIST */}
                    <div className="space-y-3 sm:space-y-4">

                        {[
                            {
                                q: "Do I need prior experience?",
                                a: "No. The system is structured to take you from foundation to execution. What matters is consistency.",
                                sys: "Activity Engine",
                            },
                            {
                                q: "What makes this different from other bootcamps?",
                                a: "Your work is verified, reviewed, permanently recorded, and publicly visible. Not stored locally or forgotten.",
                                sys: "Submission & Review Framework",
                            },
                            {
                                q: 'What exactly is "Reputation"?',
                                a: "It is your operational currency inside NextHive. You earn it by contributing. You use it to start Hives, open bounties, and signal credibility.",
                                sys: "Reputation Ledger",
                            },
                            {
                                q: "Will I actually have a portfolio at the end?",
                                a: "Yes. Automatically generated from your approved work. No extra effort required.",
                                sys: "Portfolio Automation",
                            },
                        ].map((faq, i) => (
                            <div
                                key={i}
                                className={`
            group overflow-hidden rounded-2xl border border-border/50 bg-card
            shadow-sm transition-all duration-300
            active:scale-[0.995]
            hover:border-foreground/30
          `}
                            >

                                {/* TRIGGER */}
                                <button
                                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                    className="
              flex w-full items-start justify-between gap-4
              px-5 py-5 sm:px-6 sm:py-5
              text-left
            "
                                >
                                    <span className="text-sm sm:text-base font-bold text-foreground leading-snug">
                                        {faq.q}
                                    </span>

                                    <ChevronDown
                                        className={cn(
                                            "mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform duration-300",
                                            activeFaq === i ? "rotate-180 text-orange" : ""
                                        )}
                                    />
                                </button>

                                {/* CONTENT */}
                                <div
                                    className={cn(
                                        "grid transition-all duration-300 ease-in-out",
                                        activeFaq === i
                                            ? "grid-rows-[1fr] opacity-100"
                                            : "grid-rows-[0fr] opacity-0"
                                    )}
                                >
                                    <div className="overflow-hidden">
                                        <div className="space-y-4 border-t border-border/20 px-5 sm:px-6 pb-5 pt-4 text-sm leading-relaxed text-muted-foreground">

                                            <p className="text-sm sm:text-[15px]">
                                                {faq.a}
                                            </p>

                                            <div className="flex w-fit items-center gap-2 rounded-full bg-orange/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-orange">
                                                <Lock className="size-3" />
                                                Backend Concept: {faq.sys}
                                            </div>

                                        </div>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>

                </div>
            </MotionSection>

            {/* 7. FINAL CTA */}
            <MotionSection
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden bg-background py-20 md:py-32 text-center"
            >
                {/* Background glow (softened for mobile readability) */}
                <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[280px] sm:size-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange/10 blur-[100px] md:blur-[120px]" />

                <div className="relative z-10 mx-auto max-w-2xl space-y-6 sm:space-y-8 px-4">

                    {/* HEADLINE */}
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.05]">
                        The system is live.
                    </h2>

                    {/* SUPPORTING COPY */}
                    <div className="flex flex-col items-center gap-2 text-sm sm:text-base md:text-lg font-medium text-muted-foreground">
                        <p className="text-center">
                            Create your account. Verify your identity.
                        </p>
                        <p className="text-center">
                            Claim your 50 Rep. Start forming your Hive.
                        </p>
                    </div>

                    {/* CTA */}
                    <div className="pt-4 sm:pt-6">
                        <Link
                            href="/register"
                            className="
          group relative inline-flex w-full sm:w-auto
          items-center justify-center gap-2
          rounded-full bg-orange
          px-8 sm:px-10 py-4 sm:py-5
          text-sm sm:text-base font-bold text-white
          shadow-lg shadow-orange/20
          transition-all duration-300
          hover:scale-[1.02] hover:shadow-orange/40
          active:scale-[0.98]
        "
                        >
                            Enter the Arena
                            <ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                    </div>

                    {/* subtle trust microline (adds conversion lift on mobile) */}en
                    <p className="pt-2 text-[11px] text-muted-foreground/70">
                        No certificates. Just verified output.
                    </p>

                </div>
            </MotionSection>
        </main>
    );
}