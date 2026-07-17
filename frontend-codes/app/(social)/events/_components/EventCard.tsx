"use client";

import React from "react";
import { Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { EventType } from "../get-events";
import { useConstructUrl } from "@/hooks/use-construct-url";

interface EventCardProps {
  data: EventType;
}

export function EventCard({ data }: EventCardProps) {
  const hasImage = Boolean(data.imageKey);
  const imageUrl = useConstructUrl(data.imageKey ?? "");

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-card shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
      {/* Image */}
      <div className="relative h-40 overflow-hidden bg-muted">
  {hasImage ? (
    <>
      <Image
        src={imageUrl}
        alt={data.title}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
    </>
  ) : (
    <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400 p-5 text-white">
      <div className="text-[15px] font-semibold uppercase tracking-[0.2em] opacity-90">
        NEXTHIVE EVENTS
      </div>

      <div>
        <span className="inline-flex rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-medium backdrop-blur">
          {data.eventCategory}
        </span>

        <h3 className="mt-3 line-clamp-3 text-lg font-bold leading-tight">
          {data.title}
        </h3>
      </div>
    </div>
  )}

  <span className="absolute top-3 right-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium backdrop-blur">
    {data.isOnline ? "Virtual" : "In-Person"}
  </span>
</div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-6 w-6 text-[color:var(--color-orange)]" />
            <span>
              {new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }).format(data.startdate)}
              {data.enddate && (
                <>
                  {" "}
                  -{" "}
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(data.enddate)}
                </>
              )}
            </span>
          </span>

          {hasImage && (
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
              {data.eventCategory}
              </span>
            )}
        </div>

        <h3 className="text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-[color:var(--color-orange)]">
          {data.title}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">
  {data.shortdescription}
</p>

        <div className="mt-auto pt-3">
          <Link
            href={`/events/${data.id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--color-orange)]"
          >
            View details →
          </Link>
        </div>
      </div>
    </article>
  );
}