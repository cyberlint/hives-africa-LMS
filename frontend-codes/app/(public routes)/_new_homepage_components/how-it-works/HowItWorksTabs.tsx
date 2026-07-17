"use client";

import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";

import { HowItWorksItem } from "./how-it-works.data";


interface Props {
  items: HowItWorksItem[];
  activeTab: string;
  onChange: (id: string) => void;
}

const HowItWorksTabs = ({
  items,
  activeTab,
  onChange,
}: Props) => {
  return (
    <div className="flex flex-col">

      {items.map((item) => {
        const active = item.id === activeTab;

        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className="
              group
              relative
              flex
              items-center
              justify-between
              border-b
              border-border/50
              py-3.5
              text-left
            "
          >
            {/* Sliding orange indicator */}

            {active && (
              <motion.div
                layoutId="active-tab"
                className="
                  absolute
                  left-0
                  top-4
                  bottom-4
                  w-[3px]
                  rounded-full
                  bg-yellow-500
                "
                transition={{
                  type: "spring",
                  stiffness: 450,
                  damping: 35,
                }}
              />
            )}

            <span
              className={`
                pl-5
                text-lg
                font-semibold
                transition-all
                duration-300

                ${
                  active
                    ? "text-yellow-500"
                    : "text-foreground group-hover:text-yellow-400"
                }
              `}
            >
              {item.title}
            </span>

            <ChevronRight
              size={18}
              className={`
                transition-all
                duration-300

                ${
                  active
                    ? "translate-x-0 text-yellow-500"
                    : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                }
              `}
            />

          </button>
        );
      })}
    </div>
  );
};

export default HowItWorksTabs;