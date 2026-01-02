import "server-only";
import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function adminGetCourse(id: string) {
    await requireAdmin();
    const data = await prisma.course.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            title: true,
            description: true,
            fileKey: true,
            // @ts-ignore
            price: true,
            // @ts-ignore
            originalPrice: true,
            // @ts-ignore
            registrationFee: true,
            duration: true,
            level: true,
            status: true,
            slug: true,
            shortdescription: true,
            category: true,
            module: {
                select: {
                    id: true,
                    title: true,
                    position: true,
                    lessons: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            thumbnailKey: true,
                            videoKey: true,
                            position: true,
                            type: true,
                            content: true,
                            duration: true,
                            documentKey: true,
                            quizConfig: true,
                        }
                    }
                }
            }
        },
    });

    if (!data) {
        return notFound();
    }

    return data as any;
}

export type AdminCourseSingularType = Awaited<ReturnType<typeof adminGetCourse>>;
