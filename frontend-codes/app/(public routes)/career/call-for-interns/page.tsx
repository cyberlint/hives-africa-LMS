import Link from "next/link";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function InternshipProgramPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-[var(--color-darkBlue-500)] text-white">
        <div className="mx-auto max-w-6xl px-6 py-28">
          <div className="max-w-3xl">
            <span className="inline-block rounded-full bg-[var(--color-yellow)] px-4 py-1 text-sm font-semibold text-black">
              2026 Internship Cohort
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              NextHive Internship Program
            </h1>

            <p className="mt-6 text-lg text-white/80 leading-relaxed">
              A fully remote internship experience for ambitious individuals
              looking to gain real-world exposure in the education technology
              sector while contributing to the future of technology education in Africa.
            </p>

            <div className="mt-10">
              <Link
                href="https://www.appsheet.com/start/90a80d70-1d6f-4acc-b2f1-2ba5aa2a963b"
                className="rounded-md bg-[var(--color-yellow)] px-6 py-3 font-semibold text-black transition hover:opacity-90"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="border-l-4 border-[var(--color-yellow)] pl-6">
          <h2 className="text-3xl font-bold text-[var(--color-darkBlue-300)]">
            1. About The Program
          </h2>

          <p className="mt-6 text-muted-foreground leading-relaxed">
            The NextHive Internship Program is a{" "}
            <strong>3-6 months fully remote engagement</strong> designed to
            give early-career professionals and students meaningful exposure to
            the fast-growing education technology sector.
          </p>

          <p className="mt-4 text-muted-foreground leading-relaxed">
            At NextHive, we are building a new model for technology education in
            Africa — one that prioritizes practical learning, execution, and
            real-world outcomes over passive consumption.
          </p>

          <p className="mt-4 text-muted-foreground leading-relaxed">
            Interns will work directly with active teams across operations,
            design, learning experience, growth, and technology while gaining
            hands-on experience inside a fast-moving startup environment.
          </p>
        </div>
      </section>

      {/* ================= WHY JOIN ================= */}
      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-3xl font-bold text-[var(--color-darkBlue-300)]">
            2. What You Gain
          </h2>

          <p className="mt-4 text-muted-foreground">
            This program is designed to accelerate growth through practical
            exposure and meaningful contribution.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[
              "Real corporate experience inside a mission-driven EdTech startup.",
              "Hands-on participation in projects shaping technology education in Africa.",
              "Career growth opportunities through structured internal learning experiences.",
              "Exposure to workplace skills such as leadership, ownership, communication, and collaboration.",
              "Opportunity to work with driven teams in a high-execution environment.",
              "Professional experience aligned with your strengths, interests, and long-term goals.",
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

      {/* ================= TRACKS ================= */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-3xl font-bold text-[var(--color-darkBlue-300)]">
          3. Internship Tracks
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border bg-background p-8 shadow-sm">
            <h3 className="text-lg font-semibold">
              Learning Experience Design
            </h3>

            <p className="mt-4 text-muted-foreground leading-relaxed">
              Support the development of engaging and practical learning
              experiences for technology education programs.
            </p>
          </div>

          <div className="rounded-xl border bg-background p-8 shadow-sm">
            <h3 className="text-lg font-semibold">
              Design & Creative
            </h3>

            <p className="mt-4 text-muted-foreground leading-relaxed">
              Work on visual storytelling, branding assets, product visuals,
              and campaign creatives across our ecosystem.
            </p>
          </div>

          <div className="rounded-xl border bg-background p-8 shadow-sm">
            <h3 className="text-lg font-semibold">
              Marketing & Business Development
            </h3>

            <p className="mt-4 text-muted-foreground leading-relaxed">
              Contribute to growth campaigns, partnerships, audience engagement,
              and market expansion initiatives.
            </p>
          </div>

          <div className="rounded-xl border bg-background p-8 shadow-sm">
            <h3 className="text-lg font-semibold">
              Operations & Execution
            </h3>

            <p className="mt-4 text-muted-foreground leading-relaxed">
              Assist with internal coordination, systems management, community
              support, and organizational execution.
            </p>
          </div>
        </div>
      </section>

      {/* ================= ELIGIBILITY ================= */}
      <section className="bg-muted/30 py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold text-[var(--color-darkBlue-300)]">
            4. Who Can Apply
          </h2>

          <div className="mt-10 space-y-6">
            {[
              "Students, recent graduates, and early-career professionals.",
              "Individuals seeking meaningful industry exposure and experience.",
              "Self-driven people with strong attention to excellence and growth.",
              "Candidates willing to learn, receive mentorship, and accept constructive feedback.",
              "People genuinely interested in technology, innovation, and education.",
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

      {/* ================= APPLICATION ================= */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="text-3xl font-bold text-[var(--color-darkBlue-300)]">
          5. Application Requirements
        </h2>

        <div className="mt-12 space-y-10 border-l border-muted pl-8">
          {[
            {
              title: "Updated CV or Resume",
              text: "Your CV should clearly highlight your most relevant experience, skills, projects, certifications, and/or training.",
            },
            {
              title: "Motivation Letter",
              text: "Tell us why you are applying, what excites you about NextHive, and what you hope to gain from the internship experience.",
            },
            {
              title: "Application Review",
              text: "Applications will be reviewed on a rolling basis. Shortlisted candidates may be invited for a short virtual interview.",
            },
          ].map((step, i) => (
            <div key={i} className="relative">
              <span className="absolute -left-[38px] flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-yellow)] text-sm font-bold text-black">
                {i + 1}
              </span>

              <h3 className="text-lg font-semibold">
                {step.title}
              </h3>

              <p className="mt-2 text-muted-foreground leading-relaxed">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="mx-auto max-w-4xl px-6 pb-20">
        <div className="rounded-2xl bg-[var(--color-darkBlue-500)] p-12 text-white shadow-lg">
          <h3 className="text-3xl font-bold">
            6. Start Your Journey
          </h3>

          <p className="mt-6 text-white/80 leading-relaxed">
            If you are looking for a place to learn fast, contribute meaningfully,
            and grow through real execution, we would love to hear from you.
          </p>

          <div className="mt-6">
            <p className="text-sm uppercase tracking-wide text-white/60">
              Application Deadline
            </p>

            <p className="text-2xl font-bold text-[var(--color-yellow)]">
              Rolling Applications
            </p>
          </div>

          <div className="mt-8">
            <Link
              href="https://www.appsheet.com/start/90a80d70-1d6f-4acc-b2f1-2ba5aa2a963b"
              className="inline-block rounded-md bg-[var(--color-yellow)] px-6 py-3 font-semibold text-black transition hover:opacity-90"
            >
              Submit Application
            </Link>
          </div>

          <p className="mt-6 text-sm text-white/70">
            Only shortlisted applicants will be contacted for the next stage of
            the process.
          </p>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="mx-auto max-w-4xl px-6 pb-24">
        <div className="rounded-2xl border bg-muted/20 p-10">
          <h2 className="mb-4 text-2xl font-bold text-[var(--color-darkBlue-300)]">
            Frequently Asked Questions
          </h2>

          <section className="mx-auto max-w-4xl py-10">
            <Accordion type="single" collapsible className="w-full">

              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left text-lg font-medium">
                  Is the internship remote?
                </AccordionTrigger>

                <AccordionContent>
                  Yes. The internship program is fully remote and open to qualified applicants across different locations.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left text-lg font-medium">
                  How long does the program last?
                </AccordionTrigger>

                <AccordionContent>
                  The internship runs between 3 to 6 months depending on the role, performance, and team requirements.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left text-lg font-medium">
                  Do I need prior experience to apply?
                </AccordionTrigger>

                <AccordionContent>
                  Yes. This internship is for those with some experience. You must have a foundational understanding of the field and demonstrate prior experience such as relevant trainings completed or projects worked on.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left text-lg font-medium">
                  Can students apply?
                </AccordionTrigger>

                <AccordionContent>
                  Yes. Students, recent graduates, and early-career professionals are encouraged to apply.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left text-lg font-medium">
                  Will interns work on real projects?
                </AccordionTrigger>

                <AccordionContent>
                  Yes. Interns will contribute directly to active initiatives and operational projects within NextHive.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left text-lg font-medium">
                  Is this a paid internship?
                </AccordionTrigger>

                <AccordionContent>
                  No. This is an unpaid internship designed for learning and experience. However, interns will gain valuable exposure, mentorship, and real-world experience in the EdTech sector.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger className="text-left text-lg font-medium">
                  How do I apply?
                </AccordionTrigger>

                <AccordionContent>
                  Complete the application form and submit the required documents through the application portal.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </div>
      </section>
    </div>
  );
}