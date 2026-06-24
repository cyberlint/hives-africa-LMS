"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

export function HiveFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  const sort = params.get("sort") || "newest";
  const visibility = params.get("visibility") || "all";

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());

    if (value === "all") {
      next.delete(key);
    } else {
      next.set(key, value);
    }

    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <div className="relative">
      {/* TRIGGER BUTTON */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-md border 
                   bg-background text-foreground 
                   hover:bg-muted transition"
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span className="text-sm">Filters</span>
      </button>

      {/* POPOVER */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-lg border 
                     bg-background text-foreground 
                     shadow-lg z-50 p-3 space-y-4"
        >
          {/* SORT */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Sort by
            </p>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => update("sort", "newest")}
                className={`text-left px-2 py-1 rounded text-sm hover:bg-muted ${
                  sort === "newest" ? "bg-muted font-medium" : ""
                }`}
              >
                Newest
              </button>

              <button
                onClick={() => update("sort", "oldest")}
                className={`text-left px-2 py-1 rounded text-sm hover:bg-muted ${
                  sort === "oldest" ? "bg-muted font-medium" : ""
                }`}
              >
                Oldest
              </button>
            </div>
          </div>

          {/* VISIBILITY */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Visibility
            </p>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => update("visibility", "all")}
                className={`text-left px-2 py-1 rounded text-sm hover:bg-muted ${
                  visibility === "all" ? "bg-muted font-medium" : ""
                }`}
              >
                All
              </button>

              <button
                onClick={() => update("visibility", "public")}
                className={`text-left px-2 py-1 rounded text-sm hover:bg-muted ${
                  visibility === "public" ? "bg-muted font-medium" : ""
                }`}
              >
                Public
              </button>

              <button
                onClick={() => update("visibility", "private")}
                className={`text-left px-2 py-1 rounded text-sm hover:bg-muted ${
                  visibility === "private" ? "bg-muted font-medium" : ""
                }`}
              >
                Private
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}