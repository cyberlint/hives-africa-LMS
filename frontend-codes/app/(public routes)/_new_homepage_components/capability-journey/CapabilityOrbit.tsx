"use client";

import { motion } from "motion/react";
import CapabilityNode from "./CapabilityNode";
import { capabilityJourney } from "./capability.data";

const getRadius = () => {
    if (typeof window === "undefined") return 42;

    if (window.innerWidth < 640) return 34;

    if (window.innerWidth < 1024) return 38;

    return 42;
};

const radius = getRadius();

const orbitPoints = capabilityJourney.map((_, index) => {
    const point = calculatePosition(index, capabilityJourney.length);

    return {
        left: point.left,
        top: point.top,
    };
});

function calculatePosition(index: number, total: number) {
    const angle = (index / total) * (Math.PI * 2);

    return {
        left: `${50 + Math.cos(angle) * radius}%`,
        top: `${50 + Math.sin(angle) * radius}%`,
        angle,
    };
}

const CapabilityOrbit = () => {
    const energyPath = [...orbitPoints, orbitPoints[0]];
    return (
        <div className="relative flex aspect-square w-full max-w-[620px] items-center justify-center">

            {/* Outer Ring */}
            <div
                className="
    absolute
    h-full
    w-full
    rounded-full
    border
    border-yellow-400/10
  "
            />

            {/* Middle Ring */}
            <div className="absolute h-[78%] w-[78%] rounded-full border border-border/30" />

            {/* Inner Ring */}
            <div className="absolute h-[56%] w-[56%] rounded-full border border-border/20" />

            {/* Rotating Layer */}
            <div className="absolute inset-0 animate-capability-spin">

                {/* Energy Flow */}
                <motion.div className="absolute z-30 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400 shadow-[0_0_18px_rgba(251,146,60,0.9)]"
                    animate={{
                        left: energyPath.map((p) => p.left),
                        top: energyPath.map((p) => p.top),
                        scale: [1, 1.3, 1, 1.3, 1, 1],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
                {capabilityJourney.map((node, index) => {
                    const position = calculatePosition(
                        index,
                        capabilityJourney.length
                    );

                    return (
                        <div
                            key={node.id}
                            className="absolute"
                            style={{
                                left: position.left,
                                top: position.top,
                                transform: "translate(-50%, -50%)",
                            }}
                        >
                            {/* Counter rotation */}
                            <div className="animate-capability-spin-reverse">
                                <CapabilityNode
                                    title={node.title}
                                    description={node.description}
                                    icon={node.icon}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Center Hub */}
            <div className="relative z-20 flex h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40 items-center justify-center">

                <div className="absolute inset-0 rounded-full bg-yellow-500/10 blur-3xl" />

                <div
                    className="
      relative
      flex
      h-full
      w-full
      flex-col
      items-center
      justify-center
      rounded-full
      border
      border-yellow-400/30
      bg-background/90
      backdrop-blur-xl
      shadow-2xl
    "
                >
                    <span className="text-xl font-bold text-yellow-500">
                        NextHive
                    </span>

                    <span className="mt-2 text-center text-xs leading-5 text-muted-foreground">
                        Human
                        <br />
                        Capability
                        <br />
                        Engine
                    </span>
                </div>

            </div>

        </div>
    );
};

export default CapabilityOrbit;