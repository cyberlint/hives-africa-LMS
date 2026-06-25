"use server";

import { prisma } from "@/lib/db";

type GetEventsParams = {
  search?: string;
  category?: string;
  format?: "online" | "in-person" | "any";
};

export async function getEvents(params: GetEventsParams = {}) {
  const { search, category, format } = params;

  return prisma.event.findMany({
    where: {
      ...(search
        ? {
            title: {
              contains: search,
              mode: "insensitive",
            },
          }
        : {}),

      ...(category && category !== "all"
        ? {
            eventCategory: category as any,
          }
        : {}),

      ...(format && format !== "any"
        ? {
            isOnline: format === "online",
          }
        : {}),
    },
    
    include: {
      speakers: true,
    },

    orderBy: {
      startdate: "asc",
    },
  });
}