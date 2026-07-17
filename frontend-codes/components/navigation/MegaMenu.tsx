"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { megaMenuConfig } from "./mega-menu.config";

interface MegaMenuProps {
    section: (typeof megaMenuConfig)[keyof typeof megaMenuConfig];
}

export default function MegaMenu({ section }: MegaMenuProps) {
  const [activeCategory, setActiveCategory] = useState(
    section.categories[0]
  );

  useEffect(() => {
    setActiveCategory(section.categories[0]);
  }, [section]);

  return (
    <div
      className="
        absolute
        left-1/2
        top-full
        z-50
        mt-3
        w-[1100px]
        -translate-x-1/2
        overflow-hidden
        rounded-3xl
        border
        border-border
        bg-background
        shadow-2xl
      "
    >
      <div className="grid grid-cols-[240px_1fr] min-h-[500px]">

        {/* ================= LEFT COLUMN ================= */}

        <aside className="border-r border-border bg-muted/20">
          <div className="p-6">

            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              {section.title}
            </p>

            <h3 className="mt-2 text-xl font-bold">
              {section.title}
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              {section.description}
            </p>

          </div>

          <nav className="px-3 pb-4 space-y-1">

            {section.categories.map((category) => (

              <button
                key={category.id}
                onMouseEnter={() => setActiveCategory(category)}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "group flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-all duration-200",

                  activeCategory.id === category.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "hover:bg-muted"
                )}
              >
                <span className="font-medium">
                  {category.title}
                </span>

                <ChevronRight
                  className={cn(
                    "h-4 w-4 transition-transform",

                    activeCategory.id === category.id &&
                      "translate-x-1"
                  )}
                />
              </button>

            ))}

          </nav>
        </aside>

        {/* ================= CENTER COLUMN ================= */}

        <section className="flex flex-col p-8">

          <div className="mb-8">

            <h2 className="text-2xl font-bold">
              {activeCategory.title}
            </h2>

            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              {activeCategory.description}
            </p>

          </div>

          <div className="grid gap-2">

            {activeCategory.items.map((item) => {

              const Icon = item.icon;

              return (

                <Link
                  key={item.id}
                  href={item.href}
                  className="
                    group
                    flex
                    items-start
                    gap-4
                    rounded-2xl
                    p-4
                    transition-all
                    duration-200
                    hover:bg-muted
                  "
                >

                  <div
                    className="
                      mt-1
                      rounded-xl
                      bg-primary/10
                      p-2
                    "
                  >
                    <Icon className="h-5 w-5 text-primary" />
                  </div>

                  <div className="flex-1">

                    <div className="flex items-center gap-2">

                      <h4 className="font-semibold">
                        {item.title}
                      </h4>

                      <ChevronRight
                        className="
                          h-4
                          w-4
                          opacity-0
                          transition-all
                          group-hover:translate-x-1
                          group-hover:opacity-100
                        "
                      />

                    </div>

                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>

                  </div>

                </Link>

              );
            })}

          </div>

        </section>

      </div>
    </div>
  );
}