"use client";

import { MotionSection } from "@/components/framer-motion/motion-components";
import { FileSpreadsheet, DatabaseZap, LineChart, Rocket, CheckCircle2 } from "lucide-react";

export default function CurriculumSection() {
  return (
    <MotionSection
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative bg-background py-16 md:py-24"
    >
      {/* Grid background (softened for mobile readability) */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* HEADER: Focus on the Reader's Future */}
        <div className="mb-12 space-y-4 text-center md:mb-16 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/30 px-3 py-1.5 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">
              The Curriculum
            </span>
          </div>

          <h2 className="text-3xl font-black tracking-tight text-foreground md:text-5xl leading-[1.1]">
            Your 4-Week Blueprint <br className="hidden sm:block" />
            <span className="text-orange">To Break In.</span>
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {"The tech ecosystem doesn't care about your certificates. It cares about what you can execute. 4 weeks. 4 tangible assets. No dead weight."}
          </p>
        </div>

        {/* GRID: The "Asset" Assembly Line */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          {[
            {
              w: "Week 1",
              t: "The Quick Win (Your First Project)",
              d: "Stop watching tutorials. We jump straight into structured thinking and Excel-based modeling. You will deploy your first functional data asset within 7 days.",
              icon: FileSpreadsheet,
              deliverable: "Project 1 added to portfolio",
            },
            {
              w: "Week 2",
              t: "The Cleanup (Messy to Market-Ready)",
              d: "Learn exactly what companies pay analysts for. You will use Power Query to transform raw, ugly datasets into clean, usable business intelligence.",
              icon: DatabaseZap,
              deliverable: "Data Transformation Pipeline built",
            },
            {
              w: "Week 3",
              t: "The 'Wow' Factor (Visual Intelligence)",
              d: "This is what makes recruiters pause. You will build decision-grade, interactive Power BI dashboards powered by robust DAX data modeling.",
              icon: LineChart,
              deliverable: "Interactive Power BI Dashboard shipped",
            },
            {
              w: "Week 4",
              t: "The Capstone Deployment",
              d: "End-to-end execution. You handle a complete business problem. Your work is reviewed, approved, and permanently anchored to your public profile.",
              icon: Rocket,
              deliverable: "Hire-ready portfolio fully live",
              highlight: true, // Special styling for the final week
            },
          ].map((wk, i) => (
            <div
              key={i}
              className={`
                group relative overflow-hidden
                rounded-2xl border bg-card
                p-6 sm:p-8 shadow-sm
                transition-all duration-300
                hover:shadow-lg active:scale-[0.99] flex flex-col justify-between
                ${wk.highlight ? "border-orange/40 bg-orange/[0.02] hover:border-orange/60" : "border-border/60 hover:border-orange/30"}
              `}
            >
              {/* Subtle timeline marker */}
              <div className={`absolute left-0 top-8 h-12 w-1 rounded-r-full transition-colors ${wk.highlight ? "bg-orange" : "bg-orange/10 group-hover:bg-orange/30"}`} />

              <div className="pl-3 sm:pl-4 space-y-4">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-orange transition-colors">
                      {wk.w}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground leading-snug mt-1">
                      {wk.t}
                    </h3>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${wk.highlight ? "bg-orange/10 border-orange/20 text-orange" : "bg-muted border-border/50 text-muted-foreground group-hover:text-orange group-hover:border-orange/20"} transition-colors shrink-0`}>
                    <wk.icon className="size-5" />
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {wk.d}
                </p>

                {/* The Instant Win / Deliverable */}
                <div className="pt-4 border-t border-border/50 mt-auto">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                    <CheckCircle2 className="size-4 text-green-500 shrink-0" />
                    <span>{wk.deliverable}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Subtle Footer Hint (Reassurance) */}
        <div className="mt-12 text-center">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground bg-muted/40 px-4 py-2 rounded-full border border-border/50">
            <span className="size-2 rounded-full bg-green-500 animate-pulse" />
            No prior experience required to start
          </p>
        </div>
      </div>
    </MotionSection>
  );
}