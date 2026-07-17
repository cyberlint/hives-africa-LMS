"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";

import { NavigationItem } from "./types";
import { megaMenuConfig } from "./mega-menu.config";

interface MobileNavItemProps {
  item: NavigationItem;
  onNavigate?: () => void;
}

const MobileNavItem = ({
  item,
  onNavigate,
}: MobileNavItemProps) => {
  const [open, setOpen] = useState(false);

  // Normal link
  if (item.type === "link") {
    return (
      <li>
        <Link
          href={item.href ?? "#"}
          onClick={onNavigate}
          className="
            flex items-center justify-between
            w-full
            py-4
            text-base
            font-semibold
            border-b border-border/50
            hover:text-orange
          "
        >
          {item.title}
        </Link>
      </li>
    );
  }

  const section = megaMenuConfig[item.key];
  const items = section.categories[0].items;

  return (
    <li className="border-b border-border/50">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="
          flex
          w-full
          items-center
          justify-between
          py-4
          text-base
          font-semibold
        "
      >
        <span>{item.title}</span>

        {open ? (
          <ChevronDown size={18} />
        ) : (
          <ChevronRight size={18} />
        )}
      </button>

      {open && (
        <div className="pb-3 pl-5">
          <ul className="space-y-1">
            {items.map((menuItem) => {
              const Icon = menuItem.icon;

              return (
                <li key={menuItem.id}>
                  <Link
                    href={menuItem.href}
                    onClick={onNavigate}
                    className="
                      flex
                      items-start
                      gap-3
                      rounded-lg
                      px-3
                      py-3
                      hover:bg-muted
                    "
                  >
                    <Icon size={18} className="mt-0.5 shrink-0" />

                    <div>
                      <p className="font-medium">
                        {menuItem.title}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {menuItem.description}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </li>
  );
};

export default MobileNavItem;