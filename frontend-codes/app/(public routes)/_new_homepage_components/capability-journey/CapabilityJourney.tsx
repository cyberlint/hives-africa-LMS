"use client";

import CapabilityJourneyMobile from "./CapabilityJourneyMobile";
import CapabilityOrbit from "./CapabilityOrbit";

const CapabilityJourney = () => {
  return (
    <section className="relative overflow-hidden py-16 lg:py-24">

      <div className="mx-auto flex max-w-7xl flex-col items-center gap-20 px-6 xl:flex-row lg:gap-16">

        {/* Left */}
        <div className="max-w-xl">

          <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
            Every opportunity begins with potential.
          </h2>

          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            NextHive helps people and organisations transform potential into
            capability, capability into evidence, evidence into trust, and trust
            into measurable impact.
          </p>

        </div>

        {/* Right */}
        {/* Desktop */}
        <div className="hidden xl:flex flex-1 justify-center">
          <CapabilityOrbit />
        </div>

        {/* Mobile */}
        <div className="xl:hidden mt-6 w-full">
          <CapabilityJourneyMobile />
        </div>

      </div>

    </section>
  );
};

export default CapabilityJourney;