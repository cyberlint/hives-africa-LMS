"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

import { HowItWorksItem } from "./how-it-works.data";

interface Props {
  item: HowItWorksItem;
}

const HowItWorksPanel = ({ item }: Props) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={item.id}
        initial={{
          opacity: 0,
          y: 18,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: -18,
        }}
        transition={{
          duration: 0.28,
        }}
        className="
          rounded-3xl
          border
          border-border/50
          bg-card/40
          p-7 lg:p-8
          backdrop-blur-xl
        "
      >
        {/* Heading */}

        <h3 className="text-3xl lg:text-4xl font-bold tracking-tight">
          {item.heading}
        </h3>

        {/* Context */}

        <p className="mt-3 max-w-2xl text-base lg:text-lg leading-8 text-muted-foreground">
          {item.description}
        </p>

        {/* Screenshot */}

        <div
  className="relative mt-6 h-[260px] lg:h-[320px] overflow-hidden rounded-2xl border border-border/40 bg-muted">
  <Image
    src={item.visual}
    alt={item.heading}
    fill
    className="object-cover object-top"
  />
</div> 

                {/* Product labels */}

        <div className="mt-6 flex flex-wrap gap-3">

          {item.features.map((feature) => (
            <span
              key={feature}
              className="
                rounded-full
                bg-muted
                px-3
                py-1.5
                text-sm
                text-muted-foreground
              "
            >
              {feature}
            </span>
          ))}

        </div>

      </motion.div>

    </AnimatePresence>
  );
};

export default HowItWorksPanel;