"use client";

import { capabilityJourney } from "./capability.data";

const CapabilityJourneyMobile = () => {
    return (
        <div className="space-y-6">

            {capabilityJourney.map((item, index) => {
                const Icon = item.icon;

                return (
                    <div key={item.id}>
                        <div className="flex gap-4">

                            {/* Left rail */}
                            <div className="flex flex-col items-center">
                                <div
                                    className="relative flex h-12 w-12 items-center justify-center rounded-full border border-orange-500/20 bg-background shadow-lg"                                >
                                <div className="absolute inset-0 rounded-full bg-orange-500/10 animate-pulse" />

                                    <Icon
                                        size={20}
                                        className="text-yellow-500"
                                    />
                                </div>

                                {index < capabilityJourney.length - 1 && (
                                    <div className="relative mt-2 h-16 w-px bg-border">

                                        <div
                                            className="
      absolute
      left-1/2
      h-2
      w-2
      -translate-x-1/2
      rounded-full
      bg-yellow-500
      shadow-[0_0_10px_rgba(249,115,22,0.8)]
      animate-capability-flow
    "
                                        />

                                    </div>
                                )}

                            </div>

                            {/* Content */}
                            <div className="pb-8">
                                <h3 className="text-lg font-semibold">
                                    {item.title}
                                </h3>

                                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                                    {item.description}
                                </p>

                            </div>

                        </div>

                    </div>
                );
            })}

        </div>
    );
};

export default CapabilityJourneyMobile;