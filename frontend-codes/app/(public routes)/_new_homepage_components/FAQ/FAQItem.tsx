"use client";

import { AnimatePresence, motion } from "motion/react";
import { Plus, Minus } from "lucide-react";

interface Props {
  question: string;
  answer: string;
  open: boolean;
  onClick: () => void;
}

export default function FAQItem({
  question,
  answer,
  open,
  onClick,
}: Props) {
  return (
    <div className="border-b border-border/50">

      <button
        onClick={onClick}
        className="
          flex
          w-full
          items-center
          justify-between
          gap-8
          py-4
          text-left
          transition-colors
          hover:text-yellow-500
        "
      >
        <h3 className="text-base font-semibold leading-7">
          {question}
        </h3>

        <div className="flex-shrink-0">

          {open ? (
            <Minus className="h-4 w-4 transition-transform duration-200" />
          ) : (
            <Plus className="h-4 w-4 transition-transform duration-200" />
          )}

        </div>
      </button>

      <AnimatePresence initial={false}>

        {open && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              duration: .3,
            }}
            className="overflow-hidden"
          >
            <p className="pb-5 pr-10 text-sm leading-7 text-muted-foreground">
              {answer}
            </p>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}