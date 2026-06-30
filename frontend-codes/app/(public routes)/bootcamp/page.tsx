"use client";

import {
    MotionSection,
} from "@/components/framer-motion/motion-components";
import HeroSection from "./_components/HeroSection";
import WalkawaySection from "./_components/WalkawaySection";
import HowItWorksSection from "./_components/HowItWorksSection";
import SpeakersSection from "./_components/SpeakersSection";
import AutomaticPortfolioSection from "./_components/PortfolioDoneForYou";
import CurriculumSection from "./_components/BluePrint";
import FAQSection from "./_components/FAQSection";
import CheckoutButton from "@/components/lms/checkout-button";

const checkoutConfig = {
    courseId: "bootcamp-001",
    itemType: "bootcamp",
    title: "Data Launchpad Sprint",
    price: 30000,
    successRedirect: "/bootcamp/onboarding",
    failureRedirect: "/payment/failure",
    metadata: { product: "Data Launchpad Sprint", next_route: "/bootcamp/onboarding" }
};

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================

export default function CohortLandingPage() {
    return (
        <main className="-mb-16 bg-background">
            {/* 1. HERO SECTION */}
            <HeroSection checkoutConfig={checkoutConfig} />

            {/* 2. WHAT YOU WALK AWAY WITH */}
            <WalkawaySection />

            {/* 3. THE WORK ENGINE (Dual Card Layout) */}
            <HowItWorksSection checkoutConfig={checkoutConfig} />

            {/* 4. PORTFOLIO AUTO-GENERATION */}
            <AutomaticPortfolioSection />

            {/* 5. 4-WEEK BLUEPRINT */}
            <CurriculumSection />

            {/* SpeakersSection */}
            <SpeakersSection />

            {/* 6. FAQ */}
            <FAQSection />

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
                        <CheckoutButton {...checkoutConfig} />
                    </div>

                    {/* subtle trust microline (adds conversion lift on mobile) */}
                    <p className="pt-2 text-[11px] text-muted-foreground/70">
                        No certificates. Just verified output.
                    </p>

                </div>
            </MotionSection>
        </main>
    );
}