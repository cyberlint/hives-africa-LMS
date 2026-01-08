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
  const imageUrl = useConstructUrl(data.imageKey ?? "");

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-card shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
      {/* Image */}
      <div className="relative h-36 bg-muted/40">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={data.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}

        <span className="absolute top-3 right-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium backdrop-blur">
          {data.isOnline ? "Virtual" : "In-Person"}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 text-[color:var(--color-orange)]" />
            <span>
              {new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }).format(data.startdate)}
              {data.enddate && (
                <>
                  {" "}
                  –{" "}
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(data.enddate)}
                </>
              )}
            </span>
          </span>

          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
            {data.eventCategory}
          </span>
        </div>

        <h3 className="text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-[color:var(--color-orange)]">
          {data.title}
        </h3>

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