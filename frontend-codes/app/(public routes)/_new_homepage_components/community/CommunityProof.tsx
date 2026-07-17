"use client";

import CommunityCard from "./CommunityCard";
import { communities } from "./community-proof.data";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CommunityProof() {
  return (
    <section className="py-28">

      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

  {/* Heading */}
  <div className="max-w-3xl">

    <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
      Where Strangers Become Teams
    </h2>

    <p className="mt-6 text-lg leading-8 text-muted-foreground">
      From startup founders and researchers to professional communities and
      learning cohorts, Hives help people discover one another and build
      meaningful work together.
    </p>

  </div>

  {/* CTA */}
  <Link
    href="/community/hives"
    className="
      group
      inline-flex
      w-full
      items-center
      justify-center
      gap-2
      rounded-full
      border
      border-yellow-500/20
      bg-yellow-500
      px-6
      py-3
      text-sm
      font-semibold
      text-black
      shadow-lg
      shadow-yellow-500/15
      transition-all
      duration-300
      hover:-translate-y-0.5
      hover:bg-yellow-400
      hover:shadow-yellow-500/30
      lg:w-auto
      lg:shrink-0
    "
  >
    Explore Hives

    <ArrowRight
      size={18}
      className="transition-transform duration-300 group-hover:translate-x-1"
    />
  </Link>

</div>

        <div className="grid gap-8 lg:grid-cols-3">

          {communities.map((community) => (
            <CommunityCard
              key={community.id}
              community={community}
            />
          ))}

        </div>

      </div>

    </section>
  );
}