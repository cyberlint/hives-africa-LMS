"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MotionDiv, MotionH1 } from "@/components/framer-motion/motion-components";

export default function ConversionHeroSection() {
  return (
    <section className="relative w-full bg-background pt-14 pb-16 md:pt-20 md:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center lg:text-left">

        {/* HEADLINE */}
        <MotionH1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight"
        >
          Stop Learning. <br />
          <span className="text-orange">
            Start Building What Employers Can See.
          </span>
        </MotionH1>

        {/* SUBTEXT */}
        <MotionDiv
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-auto lg:mx-0 mt-6 max-w-xl"
        >
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            A 4-week data sprint where you don’t just learn — you leave with a
            <span className="text-foreground font-semibold"> real portfolio, verified projects, and proof of work.</span>
          </p>
        </MotionDiv>

        {/* VALUE HITS */}
        <MotionDiv
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-8 flex flex-col gap-2 text-sm font-medium text-muted-foreground"
        >
          <p>• Build real projects (not tutorials)</p>
          <p>• Get reviewed + approved</p>
          <p>• Walk away with a public portfolio website</p>
        </MotionDiv>

        {/* CTA */}
        <MotionDiv
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10 flex flex-col items-center lg:items-start gap-3"
        >
          <Link
            href="/register"
            className="group inline-flex items-center gap-2 rounded-full bg-orange px-8 py-4 text-sm font-bold text-white shadow-lg shadow-orange/20 transition-all hover:scale-[1.02]"
          >
            Join Cohort 001
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </Link>

          <p className="text-xs text-muted-foreground">
            Start building in 24 hours • No experience required
          </p>

          <p className="text-xs font-medium text-muted-foreground max-w-sm text-center lg:text-left">
            Finish the program. If you don’t have a portfolio you’re proud to show —
            <span className="text-foreground font-semibold"> we refund you.</span>
          </p>
        </MotionDiv>

      </div>
    </section>
  );
}