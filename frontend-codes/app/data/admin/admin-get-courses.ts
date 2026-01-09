import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";


export async function adminGetCourses() {
    const { user } = await requireAdmin();
    const userId = user.id;


    const data = await prisma.course.findMany({
        orderBy: {
            createdAt: "desc",
        },
        where: {
            userId: userId,
        },
        select: {
            id: true,
            title: true,
            shortdescription: true,
            duration: true,
            level: true,
            status: true,
            price: true,
            fileKey: true,
            slug: true,
        },
    });
    return data;
}

export type AdminCourseType = Awaited<ReturnType<typeof adminGetCourses>>[number]
