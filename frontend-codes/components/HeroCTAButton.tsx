"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroButtonProps {
    text?: string;
    className?: string;
}

export default function HeroButton({
    text = "Get Started",
    className,
}: HeroButtonProps) {
    return (
        <div className="inline-flex">
            <button
                className={cn(
                    `
          group
          inline-flex
          h-14
          items-center
          gap-3
          rounded-full
          bg-orange
          px-3
          pl-6
          pr-3

          font-semibold
          text-white

          shadow-lg
          shadow-orange/20

          transition-all
          duration-300
          hover:-translate-y-0.5
          hover:bg-orange/90
          hover:shadow-xl
          hover:shadow-orange/30

          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-orange
          focus-visible:ring-offset-2
          focus-visible:ring-offset-background
          `,
                    className
                )}
            >
                {/* Text */}
                <span className="whitespace-nowrap">
                    {text}
                </span>

                {/* Animated Arrow */}
                <div
                    className="
            relative
            flex
            h-9
            w-9
            items-center
            justify-center
            overflow-hidden
            rounded-full

            bg-white/20
            backdrop-blur-sm

            transition-all
            duration-300

            group-hover:bg-white
            group-hover:scale-105
          "
                >
                    <div
                        className="
              absolute
              left-0
              flex
              h-9
              w-[72px]
              -translate-x-1/2
              items-center
              justify-center

              transition-transform
              duration-300
              ease-out

              group-hover:translate-x-0
            "
                    >
                        {/* Hover Arrow */}
                        <ArrowRight
                            size={18}
                            className="
                h-5
                w-5
                text-orange
                opacity-0
                transition-opacity
                duration-300
                group-hover:opacity-100
              "
                        />

                        {/* Default Arrow */}
                        <ArrowRight
                            size={18}
                            className="
                h-5
                w-5
                text-white
                opacity-100
                transition-opacity
                duration-300
                group-hover:opacity-0
              "
                        />
                    </div>
                </div>
            </button>
        </div>
    );
}