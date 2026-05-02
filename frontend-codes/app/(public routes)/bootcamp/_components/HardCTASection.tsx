"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MotionSection } from "@/components/framer-motion/motion-components";

export default function HardCTASection() {
  return (
    <MotionSection
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-background py-20 text-center"
    >
      <div className="mx-auto max-w-2xl px-4 space-y-6">

        {/* HEADLINE */}
        <h2 className="text-3xl sm:text-5xl font-black leading-[1.1]">
          If you’ve been saying “I’ll start later” —
          <span className="text-orange"> this is it.</span>
        </h2>

        {/* BODY */}
        <div className="text-sm sm:text-base text-muted-foreground space-y-2">
          <p>No more watching tutorials.</p>
          <p>No more saving courses you won’t finish.</p>
          <p className="text-foreground font-semibold">This is where you actually build.</p>
        </div>

        {/* CTA */}
        <div className="pt-4">
          <Link
            href="/register"
            className="group inline-flex items-center gap-2 rounded-full bg-orange px-8 py-4 text-sm font-bold text-white shadow-lg shadow-orange/20 transition-all hover:scale-[1.02]"
          >
            Secure Your Spot Now
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* URGENCY */}
        <p className="text-xs text-orange font-bold">
          Limited seats for Cohort 001 • Next intake will cost more
        </p>

        {/* FINAL CLOSE */}
        <p className="text-xs text-muted-foreground">
          You can keep waiting… or you can finally have something to show.
        </p>

      </div>
    </MotionSection>
  );
}