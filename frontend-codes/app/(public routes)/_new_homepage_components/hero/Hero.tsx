"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import HeroButton from "@/components/HeroCTAButton";

const heroWords = [
    "Proven Capability",
    "Verifiable Evidence",
    "Recognized Trust",
    "Lasting Impact",
];

const ease = [0.22, 1, 0.36, 1] as const;

const textMaskReveal = {
    hidden: { y: "110%" },
    visible: (delay: number) => ({
        y: 0,
        transition: { duration: 0.85, ease, delay },
    }),
};

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (delay: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease, delay },
    }),
};

const Hero2 = () => {
    const [currentWord, setCurrentWord] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWord((prev) => (prev + 1) % heroWords.length);
        }, 2500);

        return () => clearInterval(interval);
    }, []);
    return (
        <div className="relative min-h-screen overflow-hidden bg-black">
            {/* Gradient background with grain effect */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, ease }}
                className="absolute -right-60 -top-10 z-0 flex flex-col items-end blur-xl"
            >
                <div className="h-[10rem] w-[60rem] rounded-full bg-gradient-to-b from-orange-500/35 to-orange-300/20 blur-[6rem]" />
                <div className="h-[10rem] w-[90rem] rounded-full bg-gradient-to-b from-amber-400/40 via-yellow-300/35 to-yellow-100/20 blur-[6rem]" />
                <div className="h-[10rem] w-[60rem] rounded-full bg-gradient-to-b from-orange-400/25 to-amber-300/15 blur-[6rem]" />
            </motion.div>
            <div className="pointer-events-none absolute inset-0 z-0 bg-noise opacity-[0.04]"></div>

            {/* Content container */}
            <div className="relative z-10">
                {/* Badge */}
                <motion.div
                    custom={0.15}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="mx-auto mt-12 flex max-w-fit items-center justify-center space-x-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm"
                >
                    <span className="text-sm font-medium text-white">
                        Learn • Build • Collaborate • Grow
                    </span>
                    <ArrowRight className="h-4 w-4 text-white" />
                </motion.div>

                {/* Hero section */}
                <div className="container mx-auto mt-12 px-4 text-center">
                    <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-[1.02] tracking-[-0.03em] text-white sm:text-5xl lg:text-7xl">
                        <span className="block overflow-hidden pb-1">
                            <motion.span
                                className="block"
                                custom={0.28}
                                variants={textMaskReveal}
                                initial="hidden"
                                animate="visible"
                            >
                                Transform Human Potential Into...
                            </motion.span>
                        </span>
                        <span className="block overflow-hidden h-[1.2em]">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={heroWords[currentWord]}
                                    initial={{
                                        y: 80,
                                        opacity: 0,
                                    }}
                                    animate={{
                                        y: 0,
                                        opacity: 1,
                                    }}
                                    exit={{
                                        y: -80,
                                        opacity: 0,
                                    }}
                                    transition={{
                                        duration: 0.55,
                                        ease,
                                    }}
                                    className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-amber-300 bg-clip-text text-transparent"
                                >
                                    {heroWords[currentWord]}
                                </motion.span>
                            </AnimatePresence>
                        </span>
                    </h1>

                    <motion.p
                        custom={0.55}
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        className="mx-auto mt-6 max-w-2xl text-lg text-gray-300"
                    >
                        From learning to real-world impact, NextHive helps individuals and organizations transform potential into trusted capability.
                    </motion.p>
                    <motion.div
                        custom={0.68}
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
                    >
                        {/* Primary CTA */}
                        <HeroButton />

                        {/* Secondary CTA */}
                        <button
                            className="
    inline-flex
    h-14
    items-center
    justify-center
    rounded-full

    border
    border-white/15

    bg-white/5
    px-6

    text-sm
    font-semibold

    text-white/70
    backdrop-blur-sm

    transition-all
    duration-300

    hover:border-white/25
    hover:bg-white/10
    hover:-translate-y-0.5

    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-orange
    focus-visible:ring-offset-2
    focus-visible:ring-offset-background
  "
                        >
                            Watch Demo
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.94, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 28,
                            mass: 0.8,
                            delay: 0.5,
                        }}
                        className="relative mx-auto my-20 w-full max-w-6xl"
                    >
                        <div className="absolute inset-0 rounded shadow-lg bg-white blur-[10rem] bg-grainy opacity-20" />

                        <img
                            src="https://kikxai.netlify.app/_next/image?url=%2Fassets%2Fhero-image.png&w=1920&q=75"
                            alt="Hero Image"
                            className="relative h-auto w-full rounded shadow-md grayscale"
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export { Hero2 };
export default Hero2;

export const __demoId = "87b5d90f296f"
