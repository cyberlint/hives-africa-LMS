"use server";

import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { CreateEventSchema, UpdateEventSchema, EventRegistrationSchema } from "@/lib/zodSchemas";

//------------ CREATE EVENT ----------------------------- */
export async function createEvent(
  data: unknown,
  userId: string
) {
  if (typeof data !== "object" || data === null) {
    throw new Error("Invalid input data");
  }

  const parsed = CreateEventSchema.parse(
    data as Record<string, any>
  );

  const { speakers, ...eventData } = parsed;

  const event = await prisma.event.create({
    data: {
      ...eventData,
      userId,

      speakers: {
        create:
          speakers?.map((speaker) => ({
            name: speaker.name,
            title: speaker.title,
            bio: speaker.bio,
            imageUrl: speaker.imageUrl,
          })) ?? [],
      },
    },

    include: {
      speakers: true,
    },
  });

  return event;
}

//------------ UPDATE EVENT ----------------------------- */
export async function updateEvent(
  eventId: string,
  data: unknown
) {
  const parsed = UpdateEventSchema.parse(
    data as Record<string, any>
  );

  const { speakers, ...eventData } = parsed;

  const event = await prisma.event.update({
    where: {
      id: eventId,
    },

    data: {
      ...eventData,

      speakers: {
        deleteMany: {},

        create:
          speakers?.map((speaker) => ({
            name: speaker.name,
            title: speaker.title,
            bio: speaker.bio,
            imageUrl: speaker.imageUrl,
          })) ?? [],
      },
    },

    include: {
      speakers: true,
    },
  });

  return event;
}

//------------ DELETE EVENT ----------------------------- */
export async function deleteEvent(eventId: string) {
  await prisma.event.delete({
    where: { id: eventId },
  })

  return { success: true }
}

//------------ GET SINGLE EVENT ----------------------------- */
export async function getEventById(eventId: string) {
  const event = await prisma.event.findUnique({
  where: { id: eventId },
  include: {
    speakers: true,
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

// -------------------REGISTER FOR EVENT-------------------------

export async function registerForEvent(
  data: unknown,
  eventId: string,
  userId?: string
) {
  const parsed = EventRegistrationSchema.parse(data);

  try {
    return await prisma.eventRegistration.create({
      data: {
        eventId,
        userId,

        name: parsed.name,
        email: parsed.email,
        phone: parsed.phone,
        referralSource: parsed.referralSource,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error(
        "You have already registered for this event."
      );
    }

    throw error;
  }
}