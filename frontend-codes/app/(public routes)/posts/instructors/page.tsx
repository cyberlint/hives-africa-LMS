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
              Call for Partners and Architects of Africa's Data & AI Future.
            </p>

            <div className="mt-10">
              <Link
                href="https://forms.gle/QNN8Tx8nhrL71Jba9"
                className="rounded-md bg-[var(--color-yellow)] px-6 py-3 font-semibold text-black transition hover:opacity-90"
              >
                Submit Application
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
            {" 'authentically African'"} approach to innovation.
          </p>

          <p className="mt-4 text-muted-foreground leading-relaxed">
            We are moving away from traditional instruction to {" "}
            <strong>Active Building</strong>. We invite visionary experts,
            practitioners, and organizations to bid for the opportunity to
            develop high-impact programs designed for <strong>Doers</strong>.
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
              "Deeply Buried in Context: Case studies must reflect African economic realities and utilize local datasets (Logistics, Fintech, Agriculture, etc.).",
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
              title: "Expression of Interest",
              text: "Interested parties submit an Expression of Interest (EOI) outlining their vision, expertise, and preliminary approach to curriculum development.",
            },
            {
              title: "Proposal Submission",
              text: "Submit Course Outlines that align with our curriculum design standards, including learning objectives, module breakdowns, and sample content. Shortlisted applicants will be provided detailed curriculum design guidelines and templates.",
            },
            {
              title: "Proposal Evaluation",
              text: "Our Curriculum Review Committee scores bids based on alignment with our philosophies, potential impact, and feasibility. We prioritize proposals that demonstrate a clear understanding of African contexts and a commitment to hands-on learning.",
            },
            {
              title: "The Consortium Win",
              text: "We select the top bidders for a single program to collaborate. This merges the Technical Architect, Business Storyteller, and Instructional Designer into one powerhouse development cell.",
            },
            {
              title: "Contracting & Development",
              text: "Selected partners enter into a development contract with NextHive, outlining deliverables, timelines, and incentives. We provide support throughout the development process, including access to our curriculum design resources and mentorship from our educational experts.",
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
              Bridging the gap between technical tools and executive decision-making.
            </p>
          </div>

          <div className="rounded-xl border bg-background p-8 shadow-sm">
            <h3 className="text-lg font-semibold">
              LLMs & Generative AI for Builders
            </h3>
            <p className="mt-4 text-muted-foreground">
              Focusing on RAG systems, local LLMs, and agentic workflows for the African SME.
            </p>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="mx-auto max-w-4xl px-6 pb-20">
        <div className="rounded-2xl bg-[var(--color-darkBlue-500)] p-12 text-white shadow-lg">
          <h3 className="text-3xl font-bold">6. How to Submit</h3>

          <p className="mt-6 text-white/80 leading-relaxed">
            Submit an expression of interest by filling out <Link href="https://forms.gle/QNN8Tx8nhrL71Jba9" className="text-yellow-400 hover:underline">this form</Link>. Shortlisted candidates will be contacted for the full proposal submission.
          </p>

          <div className="mt-6">
            <p className="text-sm uppercase tracking-wide text-white/60">
              Submission Deadline
            </p>
            <p className="text-2xl font-bold text-[var(--color-yellow)]">
              28th Feb, 2026
            </p>
          </div>

          <div className="mt-8">
            <Link
              href="https://forms.gle/QNN8Tx8nhrL71Jba9"
              className="inline-block rounded-md bg-[var(--color-yellow)] px-6 py-3 font-semibold text-black transition hover:opacity-90"
            >
              Submit Application
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
          <h2 className="mb-4 text-2xl font-bold text-[var(--color-darkBlue-300)]">
            Frequently Asked Questions
          </h2>
          <section className="mx-auto max-w-4xl px-6 py-20 space-y-16">
            {/* FAQ */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left text-lg font-medium">
                  What's the timeline for proposal submission and review?
                </AccordionTrigger>
                <AccordionContent>
                  The deadline for submitting proposals is March 10th, 2026. Afterwards, the review process will take approximately 1-2 weeks, with shortlisted candidates notified by March 24th, 2026. 
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left text-lg font-medium">
                  Can multiple individuals collaborate on a proposal?
                </AccordionTrigger>
                <AccordionContent>
                  Yes, we encourage collaboration. However, the proposal must clearly define the roles and responsibilities of each member of the team.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left text-lg font-medium">
                  Can an individual or organisation bid for multiple proposals?
                </AccordionTrigger>
                <AccordionContent>
                  Yes. Individuals can bid for up to two proposals. Organisations can bid for up to four proposals. Such proposals will be evaluated independently based on their own merits, bidder's experience, and alignment with our program goals.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left text-lg font-medium">
                  What support does NextHive provide to selected partners during the development phase?
                </AccordionTrigger>
                <AccordionContent>
                  We provide partners with technical support and resources, ranging from course content design and editing to specialized training on our production technology stack. Furthermore, partners have access to our curriculum development resources for the duration of the development process.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left text-lg font-medium">
                  Are there specific formats or templates required for the proposal submission?
                </AccordionTrigger>
                <AccordionContent>
                  Yes. We require all proposals to follow our standard curriculum design template. While the template provides general guidance on organization and our core philosophy, it does not prescribe specific content, allowing partners to freely innovate and leverage their domain expertise.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left text-lg font-medium">
                  Who owns the intellectual property of the content developed through this program?
                </AccordionTrigger>
                <AccordionContent>
                  Partners retain ownership of their intellectual property. However, we require an exclusive license to use the content on our platform and for promotional purposes. Specific terms regarding IP rights and revenue sharing will be outlined in the development contract available to shortlisted partners.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-7">
                <AccordionTrigger className="text-left text-lg font-medium">
                  What does "Exclusive License" mean?
                </AccordionTrigger>
                <AccordionContent>
                  To maintain the prestige of our program, NextHive requires an exclusive license. This means that while you own the IP, the course materials delivered to us cannot be hosted or distributed on other platforms during the term of our agreement. This exclusivity allows us to invest in marketing and support for your course, ensuring it reaches the widest possible audience without competition from other platforms. Specific terms regarding the duration of exclusivity and any exceptions will be outlined in the development contract available to shortlisted partners.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-8">
                <AccordionTrigger className="text-left text-lg font-medium">
                  Can NextHive create derivative works from my content?
                </AccordionTrigger>
                <AccordionContent>
                  NextHive may use AI tools to generate derivative formats, such as transcriptions or summaries, to enhance the learner experience. However, these derivative works remain subject to the Creator's original IP rights and the overarching agreement.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-9">
                <AccordionTrigger className="text-left text-lg font-medium">
                  I have other questions not covered here. How can I get in touch with the NextHive team for clarification?
                </AccordionTrigger>
                <AccordionContent>
                  For any additional questions or clarifications, please reach out to us at <a href="mailto:hello@hives.africa" className="text-yellow-400 hover:underline">hello@hives.africa</a>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </div>
      </section>
    </div>
  );
}