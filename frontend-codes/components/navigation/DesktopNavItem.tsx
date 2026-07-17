"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { NavigationItem } from "./types";

interface DesktopNavItemProps {
  item: NavigationItem;
  isActive?: boolean;
}

const DesktopNavItem = ({
  item,
  isActive = false,
}: DesktopNavItemProps) => {
  // Regular navigation link (e.g. Pricing)
  if (item.type === "link") {
    return (
      
        <Link
          href={item.href ?? "#"}
          className="
            relative flex items-center py-2
            text-sm font-semibold
            text-muted-foreground
            transition-colors duration-200
            hover:text-foreground
          "
        >
          <b>{item.title}</b>
        </Link>
    );
  }

  // Mega menu trigger
  return (
      <button
        type="button"
        className="
          group
          flex items-center gap-1.5
          py-2
          text-sm font-semibold
          text-muted-foreground
          transition-colors duration-200
          hover:text-foreground
          outline-none
        "
        aria-expanded={isActive}
        aria-haspopup="true"
      >
        <span><b>{item.title}</b></span>

        <ChevronDown
          size={16}
          strokeWidth={2.2}
          className={`
            transition-transform duration-200
            ${isActive ? "rotate-180" : ""}
          `}
        />
      </button>
  )
};

export default DesktopNavItem;