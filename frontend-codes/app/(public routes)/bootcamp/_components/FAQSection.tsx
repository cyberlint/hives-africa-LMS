"use client";

import {MotionSection} from "@/components/framer-motion/motion-components";
import {ChevronDown, Lock} from "lucide-react";
import {cn} from "@/lib/utils";
import {useState} from "react";

export default function FAQSection() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    return (
        <section className="bg-muted/20 py-16 md:py-24 border-y border-border">
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
                        Frequently Asked Questions
                    </h2>

                    {/* FAQ LIST */}
                    <div className="space-y-3 sm:space-y-4">

                        {[
                            {
                                q: "Do I need prior experience?",
                                a: "No. The system is structured to take you from foundation to execution. What matters is consistency.",
                            },
                            {
                                q: "What makes this different from other bootcamps?",
                                a: "Your work is verified, reviewed, permanently recorded, and publicly visible. Not stored locally or forgotten.",
                            },
                            {
                                q: "Will I really get my money back if I don't get value?",
                                a: "Yes. We call it the 'No Stories' guarantee. If you complete the 4-week sprint, submit your projects, and you don't feel significantly closer to landing a data role—or if you aren't proud of the portfolio you built—just tell us. We will issue a 100% refund immediately and apologize for wasting your time. Your risk is zero.",
                            },
                            {
                                q: "Do you really build and host my portfolio website for free?",
                                a: "Yes. The hardest part of getting hired is proving what you can do. As you complete projects in the bootcamp, our system automatically turns your approved submissions into a clean, professional web portfolio. You focus entirely on building your skills, and we handle the coding and the hosting fees. When you finish, you get a single, impressive link to send directly to employers.",
                            },
                            {
                                q: "Where will my portfolio be hosted?",
                                a: " Your live, verified portfolio will be hosted on our platform at: hives.africa/[your-name]. (See a live example of a verified portfolio here: [insert link])"
                            },
                            {
                                q: "What exactly is a 'Hive' and why do I need one?",
                                a: "A Hive is your execution team. Learning alone is the number one reason people abandon online courses. In this bootcamp, you will join a Hive—a small, dedicated group of peers. You will execute projects together, hold each other accountable, and ensure nobody gets left behind. Beyond the bootcamp, Hives act as decentralized mini-startups within the NextHive ecosystem. Every member has a voice, and you can vote on decisions, enter hackathons as a unit, and build real products together. You aren't just joining a platform; you are finding your team.",
                            },
                            {
                                q: "What if I don't have a Hive by the time the bootcamp starts?",
                                a: "No worries. We have a Hive matchmaking process during onboarding to help you find the right team. You will fill out a profile, and we will connect you with peers who have similar goals and complementary skills. You can also switch Hives within the first week if you feel like it's not the right fit. We are committed to making sure everyone finds their team.",
                            },
                            {
                                q: 'What exactly is "Reputation"?',
                                a: "It is your operational currency inside NextHive. You earn it by contributing. You use it to start Hives, open bounties, and signal credibility.",
                            },
                            {
                                q: "What if I have more questions?",
                                a: "Feel free to reach out to us directly at hello@hives.africa. We are here to help and would love to hear from you!",
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

                                        </div>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>

                </div>
            </MotionSection>
            </section>
    )
}