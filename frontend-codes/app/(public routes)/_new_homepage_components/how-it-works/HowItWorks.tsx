"use client";

import { useState, useEffect } from "react";

import { howItWorks } from "./how-it-works.data";
import HowItWorksTabs from "./HowItWorksTabs";
import HowItWorksPanel from "./HowItWorksPanel";

const HowItWorks = () => {
    const [activeTab, setActiveTab] = useState(howItWorks[0].id);
const [autoPlay, setAutoPlay] = useState(true);

useEffect(() => {
  if (!autoPlay) return;

  const interval = setInterval(() => {
    setActiveTab((current) => {
      const index = howItWorks.findIndex(item => item.id === current);
      return howItWorks[(index + 1) % howItWorks.length].id;
    });
  }, 5000);

  return () => clearInterval(interval);
}, [autoPlay]);

const handleTabChange = (id: string) => {
  setAutoPlay(false);
  setActiveTab(id);
};

  const activeItem =
    howItWorks.find((item) => item.id === activeTab) ??
    howItWorks[0];

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Heading */}

        <div className="mx-auto mb-5 max-w-3xl text-center">

          <h2 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">
            How Potential Becomes Impact
          </h2>

          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Learning builds capability. Building creates evidence.
            Evidence earns trust. Trusted people and teams create
            lasting impact.
          </p>

        </div>

       <div className="grid items-start gap-12 lg:grid-cols-[minmax(260px,300px)_minmax(0,1fr)]">
            <HowItWorksTabs
  items={howItWorks}
  activeTab={activeTab}
  onChange={handleTabChange}
/>

            <HowItWorksPanel item={activeItem} />

        </div>

      </div>
    </section>
  );
};

export default HowItWorks;