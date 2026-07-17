"use client";

import { LucideIcon } from "lucide-react";

interface CapabilityNodeProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

const CapabilityNode = ({
  title,
  description,
  icon: Icon,
}: CapabilityNodeProps) => {
  return (
    <div className="w-28 sm:w-32 lg:w-44 text-center">

      <div
        className="
          mx-auto
          flex
          h-10
          w-10
          sm:h-12
          sm:w-12
          lg:h-14
          lg:w-14
          items-center
          justify-center
          rounded-full
          border
          border-yellow-500/20
          bg-background
          shadow-xl
        "
      >
        <Icon
          size={22}
          className="text-yellow-500"
        />
      </div>

      <h3 className="mt-3 font-bold text-base sm:text-lg lg:text-xl">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-muted-foreground text-[10px] sm:text-xs sm:leading-6">
        {description}
      </p>

    </div>
  );
};

export default CapabilityNode;