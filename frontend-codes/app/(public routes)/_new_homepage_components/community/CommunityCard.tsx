"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CommunityCard as Card } from "./community-proof.data";

interface Props {
  community: Card;
}

export default function CommunityCard({
  community,
}: Props) {
  return (
    <Link
      href={community.href}
      className="
        group
        overflow-hidden
        rounded-[32px]
        border
        border-border/50
        bg-background
        transition-all
        duration-500
        hover:-translate-y-2
        hover:border-yellow-500/40
        hover:shadow-2xl
      "
    >
      <div className="relative aspect-[3/2] overflow-hidden">

        <Image
          src={community.image}
          alt={community.hive}
          fill
          className="
            object-cover
            transition-transform
            duration-700
            group-hover:scale-105
          "
        />

      </div>

      <div className="space-y-6 p-7">

        <div>

          <p className="text-sm text-muted-foreground">

            {community.from}

          </p>

          <div className="my-2 h-8 w-px bg-yellow-500" />

          <h3 className="text-2xl font-bold">

            {community.to}

          </h3>

        </div>

        <div>

          <p className="font-semibold">

            {community.hive}

          </p>

          <div className="mt-4 flex flex-wrap gap-2">

            {community.focus.map((item) => (
              <span
                key={item}
                className="
                  rounded-full
                  bg-yellow-500/10
                  px-3
                  py-1
                  text-xs
                  text-yellow-600
                "
              >
                {item}
              </span>
            ))}

          </div>

        </div>

        <div className="flex items-center justify-between">

          <div className="flex -space-x-3">

            {community.avatars.map((avatar) => (
              <Image
                key={avatar}
                src={avatar}
                alt=""
                width={34}
                height={34}
                className="
                  rounded-full
                  border-2
                  border-background
                "
              />
            ))}

            <div
              className="
                flex
                h-[34px]
                w-[34px]
                items-center
                justify-center
                rounded-full
                border-2
                border-background
                bg-muted
                text-xs
                font-semibold
              "
            >
              +{community.members}
            </div>

          </div>

          <ArrowRight
            className="
              text-yellow-500
              transition-transform
              duration-300
              group-hover:translate-x-1
            "
          />

        </div>

      </div>
    </Link>
  );
}