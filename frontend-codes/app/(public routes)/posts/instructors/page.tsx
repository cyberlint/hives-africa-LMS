import Image from "next/image";
import Link from "next/link";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function RFP2026Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-[var(--color-darkBlue-500)] text-white">
        <div className="mx-auto max-w-6xl px-6 py-28">
          <div className="max-w-3xl">
            <span className="inline-block rounded-full bg-[var(--color-yellow)] px-4 py-1 text-sm font-semibold text-black">
              2026 Curriculum Cycle
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Request for Proposals (RFP)
            </h1>

            <p className="mt-6 text-lg text-white/80">
              Call for Partners and Architects of Africa’s Data & AI Future.
            </p>

            <div className="mt-10">
              <Link
                href="mailto:hello@hives.africa"
                className="rounded-md bg-[var(--color-yellow)] px-6 py-3 font-semibold text-black transition hover:opacity-90"
              >
                Submit Proposal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= VISION ================= */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="border-l-4 border-[var(--color-yellow)] pl-6">
          <h2 className="text-3xl font-bold text-[var(--color-darkBlue-300)]">
            1. Vision & Purpose
          </h2>

          <p className="mt-6 text-muted-foreground leading-relaxed">
            At <strong>NextHive</strong>, we are building more than an online
            school; we are building a pan-African engine for the data and AI
            revolution. Our mission is to bridge the technology skill gap by
            empowering a generation of professionals with an
            "authentically African" approach to innovation.
          </p>

          <p className="mt-4 text-muted-foreground leading-relaxed">
            We are moving away from traditional instruction to{" "}
            <strong>Active Building</strong>. We invite visionary experts,
            practitioners, and organizations to bid for the opportunity to
            develop high-impact programs designed for Doers.
          </p>
        </div>
      </section>

      {/* ================= PHILOSOPHIES ================= */}
      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-3xl font-bold text-[var(--color-darkBlue-300)]">
            2. Our Philosophies
          </h2>

          <p className="mt-4 text-muted-foreground">
            Every proposal must strictly adhere to the four pillars of the
            NextHive learning experience:
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[
              "Hands-on First: Learners must spend 70% of their time building, not watching.",
              "Deeply Buried in Context: Case studies must reflect African economic realities and utilize local datasets (Logistics, Fintech, Agriculture).",
              "Impact over Impression: We value usable tools and ROI-driven outcomes over academic jargon.",
              "Time-Optimized: Content must be modular, capturing interest immediately and respecting the professional's schedule.",
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-xl border bg-background p-6 shadow-sm"
              >
                <p className="text-muted-foreground leading-relaxed">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PROCESS ================= */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="text-3xl font-bold text-[var(--color-darkBlue-300)]">
          3. The Bidding & Selection Process
        </h2>

        <div className="mt-12 space-y-10 border-l border-muted pl-8">
          {[
            {
              title: "Round 1: Public Bidding",
              text: "Submit Course Outlines following our hierarchy (Course → Modules → Lessons → Concepts).",
            },
            {
              title: "Round 2: Evaluation & Defense",
              text: "Our Curriculum Review Committee scores bids based on Revised Bloom’s Taxonomy alignment (moving from Understanding to Creating).",
            },
            {
              title: "The Consortium Win",
              text: "We select the top three bidders for a single program to collaborate. This merges the Technical Architect, Business Storyteller, and Instructional Designer into one powerhouse development cell.",
            },
          ].map((step, i) => (
            <div key={i} className="relative">
              <span className="absolute -left-[38px] flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-yellow)] text-sm font-bold text-black">
                {i + 1}
              </span>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SUBMISSION STANDARDS ================= */}
      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold text-[var(--color-darkBlue-300)]">
            4. Mandatory Submission Standards
          </h2>

          <div className="mt-10 space-y-6">
            {[
              "Logical Course Outline: From foundational building blocks to advanced application.",
              "Module Learning Objectives fostering higher-order thinking.",
              "Capstone Blueprint: Detailed description of the Original Work students will produce.",
              "Evidence of Learning: Proposed rubrics and assessment standards for all technical labs.",
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-lg border bg-background p-6"
              >
                <p className="text-muted-foreground leading-relaxed">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PRIORITY AREAS ================= */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-3xl font-bold text-[var(--color-darkBlue-300)]">
          5. Active Program Briefs
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border bg-background p-8 shadow-sm">
            <h3 className="text-lg font-semibold">
              Business Intelligence & Analytics for Professionals
            </h3>
            <p className="mt-4 text-muted-foreground">
              Bridging the gap between technical tools and executive
              decision-making.
            </p>
          </div>

          <div className="rounded-xl border bg-background p-8 shadow-sm">
            <h3 className="text-lg font-semibold">
              LLMs & Generative AI for Builders
            </h3>
            <p className="mt-4 text-muted-foreground">
              Focusing on RAG systems, local LLMs, and agentic workflows for the
              African SME.
            </p>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="mx-auto max-w-4xl px-6 pb-20">
        <div className="rounded-2xl bg-[var(--color-darkBlue-500)] p-12 text-white shadow-lg">
          <h3 className="text-3xl font-bold">6. How to Submit</h3>

          <p className="mt-6 text-white/80 leading-relaxed">
            Review the full Curriculum Design Guide Book and submit your
            proposal via email.
          </p>

          <div className="mt-6">
            <p className="text-sm uppercase tracking-wide text-white/60">
              Submission Deadline
            </p>
            <p className="text-2xl font-bold text-[var(--color-yellow)]">
              30th Feb, 2026
            </p>
          </div>

          <div className="mt-8">
            <Link
              href="mailto:hello@hives.africa"
              className="inline-block rounded-md bg-[var(--color-yellow)] px-6 py-3 font-semibold text-black transition hover:opacity-90"
            >
              Send Proposal to hello@hives.africa
            </Link>
          </div>

          <p className="mt-6 text-sm text-white/70">
            Incentives and revenue-sharing tiers are discussed in our Contractor
            Incentive Agreement, available upon request for shortlisted
            candidates.
          </p>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="mx-auto max-w-4xl px-6 pb-24">
        <div className="rounded-2xl border bg-muted/20 p-10">
          <h2 className="mb-8 text-2xl font-bold text-[var(--color-darkBlue-300)]">
            Frequently Asked Questions
          </h2>
          <section className="mx-auto max-w-4xl px-6 py-20 space-y-16">
        {/* FAQ */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-left text-lg font-medium">
              What is the expected timeline for proposal submission and review?
            </AccordionTrigger>
            <AccordionContent>
              We are accepting proposals until [Insert Date]. The review process
              will take approximately 4-6 weeks, with shortlisted candidates
              notified by [Insert Date].
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-left text-lg font-medium">
              Can multiple organizations collaborate on a single proposal?
            </AccordionTrigger>
            <AccordionContent>
              Yes, we encourage collaboration. However, the proposal must clearly
              define the roles and responsibilities of each organization.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-left text-lg font-medium">
              What support does NextHive provide to selected partners during the
              development phase?
            </AccordionTrigger>
            <AccordionContent>
              Selected partners will receive access to our curriculum development
              resources, mentorship from our educational experts, and potential
              funding support based on the scope of the project.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-left text-lg font-medium">
              Are there specific formats or templates required for the proposal
              submission?
            </AccordionTrigger>
            <AccordionContent>
              Yes, we provide a Proposal Template that outlines the required
              sections and formatting guidelines. This template can be requested
              by contacting us at
              <a href="mailto:hello@hives.africa" className="text-[var(--color-yellow)]"> hello@hives.africa</a>.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
        </div>
      </section>
    </div>
  );
}