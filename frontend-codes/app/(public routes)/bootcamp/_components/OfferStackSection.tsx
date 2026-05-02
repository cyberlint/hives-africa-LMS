"use client";

import { MotionDiv, MotionSection } from "@/components/framer-motion/motion-components";

const offers = [
  {
    title: "A Personal Portfolio Website",
    desc: "Automatically built as you complete projects — ready to send to employers.",
  },
  {
    title: "4 Verified Data Projects",
    desc: "Reviewed. Approved. Not practice work.",
  },
  {
    title: "Real Tools Experience",
    desc: "Excel • SQL • Power BI • Data Modeling",
  },
  {
    title: "Reputation Score (Proof of Work)",
    desc: "Shows what you actually contributed.",
  },
  {
    title: "Team-Based Execution (Your Hive)",
    desc: "So you don’t get stuck or disappear.",
  },
  {
    title: "Structured Review + Feedback",
    desc: "Your work gets checked. Not ignored.",
  },
];

export default function OfferStackSection() {
  return (
    <MotionSection
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-muted/20 py-16 md:py-24 border-y border-border"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">

        {/* HEADLINE */}
        <h2 className="text-3xl sm:text-5xl font-black leading-[1.1]">
          This Is Not a Course. <br />
          <span className="text-orange">It’s a System That Forces Output.</span>
        </h2>

        {/* SUBTEXT */}
        <p className="mt-6 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          When you join, you’re not just paying for “learning”.
        </p>

        {/* STACK */}
        <div className="mt-12 space-y-5 text-left max-w-2xl mx-auto">
          {offers.map((item, i) => (
            <MotionDiv
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="border border-border/50 rounded-xl p-4 bg-card"
            >
              <p className="font-bold text-foreground">
                🎁 {item.title}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {item.desc}
              </p>
            </MotionDiv>
          ))}
        </div>

        {/* REFRAME */}
        <p className="mt-12 text-sm font-medium text-muted-foreground max-w-xl mx-auto">
          Most people finish courses with nothing to show.  
          <span className="text-foreground font-semibold"> You finish this with assets you can use immediately.</span>
        </p>

        {/* GUARANTEE */}
        <p className="mt-6 text-xs text-muted-foreground">
          Complete the sprint. Submit your work. If you don’t see real progress —
          <span className="font-semibold text-foreground"> you get your money back.</span>
        </p>

      </div>
    </MotionSection>
  );
}