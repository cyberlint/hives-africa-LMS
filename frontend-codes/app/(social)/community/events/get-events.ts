import "server-only";

import { prisma } from "@/lib/db";


export async function getEvents() {
    const data = await prisma.event.findMany({
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id:                true,
            title:             true,
            shortdescription:  true,
            description:       true,
            startdate:         true,
            enddate:           true,
            imageKey:          true,
            venue:             true,
            url:               true,
            eventCategory:     true,
            isOnline:          true,
            createdAt:         true,
            updatedAt:         true,
            userId:            true,
},
    });
    
    return data;
}

export type EventType = Awaited<ReturnType<typeof getEvents>>[number]
