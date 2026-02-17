"use server";

import { prisma } from "@/lib/db";
import { CreateEventSchema, UpdateEventSchema } from "@/lib/zodSchemas";

//------------ CREATE EVENT ----------------------------- */
export async function createEvent(data: unknown, userId: string) {
  if (typeof data !== "object" || data === null) {
    throw new Error("Invalid input data");
  }

  // Only validate the event fields (without userId)
  const parsed = CreateEventSchema.parse(data as Record<string, any>);

  // Prisma needs userId, pass it directly
  const event = await prisma.event.create({
    data: {
      ...parsed,
      userId, // now this is correct
    },
  });

  return event;
}

//------------ UPDATE EVENT ----------------------------- */
export async function updateEvent(eventId: string, data: unknown) {
  if (typeof data !== "object" || data === null) {
    throw new Error("Invalid input data");
  }

  const parsed = UpdateEventSchema.parse(data as Record<string, any>);

  const event = await prisma.event.update({
    where: { id: eventId },
    data: parsed,
  });

  return event;
}

//------------ DELETE EVENT ----------------------------- */
export async function deleteEvent(eventId: string) {
  const event = await prisma.event.delete({
    where: { id: eventId },
  });

  return event;
}

//------------ GET SINGLE EVENT ----------------------------- */
export async function getEventById(eventId: string) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      id: true,
      title: true,
      shortdescription: true,
      description: true,
      startdate: true,
      enddate: true,
      venue: true,
      isOnline: true,
      eventCategory: true,
      imageKey: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!event) throw new Error("Event not found");

  return event;
}