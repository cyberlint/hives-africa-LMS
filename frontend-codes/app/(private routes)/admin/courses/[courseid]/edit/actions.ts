"use server";

import { requireAdmin } from "@/lib/require-admin";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType, lessonSchema, LessonSchemaType, moduleSchema, ModuleSchemaType } from "@/lib/zodSchemas";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

const aj = arcjet
    .withRule(
        detectBot({
            mode: "LIVE",
            allow: [],    //List of bots allowed to interact with your route handler. E.g OpenAI
        })
    )
    .withRule(
        fixedWindow({
            mode: "LIVE",   //// Allows up to 10 file uploads in a 1 minute window. Adjust as needed.
            window: "1m",
            max: 10,
        })
    );

export async function editCourse(data: CourseSchemaType, courseid: string): Promise<ApiResponse> {
    const user = await requireAdmin();

    try {
        const req = await request();
        const decision = await aj.protect(req, {
            fingerprint: user.user.id,
        });

        const result = courseSchema.safeParse(data);

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return {
                    status: "error",
                    message: "You have been blocked due to rate limiting",
                };
            } else {
                return {
                    status: "error",
                    message: "You are a bot. If this is a mistake, please contact support",
                };
            }
        }

        if (!result.success) {
            return {
                status: "error",
                message: "Invalid data",
            };
        }

        await prisma.course.update({
            where: {
                id: courseid,
                userId: user.user.id,
            },
            data: {
                ...result.data,
            }
        });
        return {
            status: "success",
            message: "Course updated successfully",
        }

    } catch {
        return {
            status: "error",
            message: "Failed to update course"
        }
    }
}


// Server action to Reorder lessons
export async function reorderLessons(
    moduleId: string,
    lessons: {
        id: string;
        position: number
    }[],
    courseid: string
): Promise<ApiResponse> {

    await requireAdmin();
    try {
        if (!moduleId || lessons.length === 0) {
            return {
                status: "error",
                message: "No lessons provided for reordering.",
            };
        }

        const updates = lessons.map((lesson) =>
            prisma.lesson.update({
                where: {
                    id: lesson.id,
                    moduleId: moduleId,
                },
                data: {
                    position: lesson.position,
                },

            })
        );

        await prisma.$transaction(updates);

        revalidatePath(`/admin/courses/${courseid}/edit`);
        return {
            status: "success",
            message: "Lessons reordered successfully",
        }
    }
    catch {
        return {
            status: "error",
            message: "Failed to reorder lessons"
        }
    }
}



// Server action to Reorder modules
export async function reorderModules(
    courseid: string,
    modules: { id: string; position: number }[]
): Promise<ApiResponse> {
    await requireAdmin();
    try {
        if (!modules || modules.length === 0) {
            return {
                status: "error",
                message: "No modules provided for reordering.",
            };
        }

        const updates = modules.map((module) =>
            prisma.module.update({
                where: {
                    id: module.id,
                    courseId: courseid,
                },
                data: {
                    position: module.position,
                },
            })
        );

        await prisma.$transaction(updates);

        revalidatePath(`/admin/courses/${courseid}/edit`);
        return {
            status: "success",
            message: "Modules reordered successfully",
        };

    } catch {
        return {
            status: "error",
            message: "Failed to reorder modules"
        };
    }
}


export async function createModule(values: ModuleSchemaType): Promise<ApiResponse> {
    await requireAdmin();

    try {
        const result = moduleSchema.safeParse(values);

        if (!result.success) {
            return {
                status: "error",
                message: "Invalid module data",
            };
        }

        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // FIX: Get max module position FROM MODULES, not lessons
            const maxPos = await tx.module.findFirst({
                where: { courseId: result.data.courseId },
                select: { position: true },
                orderBy: { position: "desc" },
            });

            await tx.module.create({
                data: {
                    title: result.data.name,
                    courseId: result.data.courseId,
                    position: (maxPos?.position ?? 0) + 1,
                },
            });
        });

        revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

        return {
            status: "success",
            message: "Module created successfully",
        };

    } catch (err) {
        console.error(err);
        return {
            status: "error",
            message: "Failed to create module",
        };
    }
}



export async function createLesson(values: LessonSchemaType): Promise<ApiResponse> {
    await requireAdmin();
    try {
        const result = lessonSchema.safeParse(values);
        if (!result.success) {
            return {
                status: "error",
                message: "Invalid lesson data",
            };
        }

        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const maxPos = await tx.lesson.findFirst({
                where: {
                    moduleId: result.data.moduleId,
                },
                select: {
                    position: true,
                },
                orderBy: {
                    position: "desc",
                },
            });

            await tx.lesson.create({
                data: {
                    title: result.data.name,
                    description: result.data.description,
                    thumbnailKey: result.data.thumbnailKey,
                    videoKey: result.data.videoKey,
                    moduleId: result.data.moduleId,
                    position: (maxPos?.position ?? 0) + 1,
                },
            });
        });

        revalidatePath(`/admin/courses/${result.data.courseId}/edit`);
        return {
            status: "success",
            message: "Lesson created successfully",
        }
    }
    catch {
        return {
            status: "error",
            message: "Failed to create lesson",
        }
    }
}


export async function updateLesson(values: LessonSchemaType, lessonId: string): Promise<ApiResponse> {
    await requireAdmin();
    try {
        const result = lessonSchema.safeParse(values);
        if (!result.success) {
            return {
                status: "error",
                message: "Invalid lesson data",
            };
        }

        await prisma.lesson.update({
            where: {
                id: lessonId,
                moduleId: result.data.moduleId,
            },
            data: {
                title: result.data.name,
                description: result.data.description,
                thumbnailKey: result.data.thumbnailKey,
                videoKey: result.data.videoKey,
                // @ts-ignore: String generic vs Enum match
                type: result.data.type,
                content: result.data.content,
                duration: result.data.duration,
                documentKey: result.data.documentKey,
                quizConfig: result.data.quizConfig,
            },
        });

        revalidatePath(`/admin/courses/${result.data.courseId}/edit`);
        return {
            status: "success",
            message: "Lesson updated successfully",
        }
    }
    catch (error) {
        console.error(error);
        return {
            status: "error",
            message: "Failed to update lesson",
        }
    }
}



// Server action to delete a lesson
export async function deleteLesson(
    { courseId,
        moduleId,
        lessonId,
    }: {
        courseId: string;
        moduleId: string;
        lessonId: string;
    }

): Promise<ApiResponse> {
    await requireAdmin();
    try {
        const moduleWithLesson = await prisma.module.findUnique({
            where: {
                id: moduleId,
            },
            select: {
                lessons: {
                    orderBy: {
                        position: "asc",
                    },
                    select: {
                        id: true,
                        position: true
                    },
                },
            },
        });
        if (!moduleWithLesson) {
            return {
                status: "error",
                message: "Module not found",
            };
        }

        const lessons = moduleWithLesson.lessons
        const lessonToDelete = lessons.find((lesson) => lesson.id === lessonId);
        if (!lessonToDelete) {
            return {
                status: "error",
                message: "Lesson not found in the specified module",
            };
        }

        const remainingLessons = lessons.filter((lesson: { id: string; position: number }) => lesson.id !== lessonId);
        const updates = remainingLessons.map((lesson: { id: string; position: number }, index: number) => {
            return prisma.lesson.update({
                where: { id: lesson.id },
                data: { position: index + 1 },
            });
        });
        await prisma.$transaction([
            ...updates,
            prisma.lesson.delete({
                where: {
                    id: lessonId,
                    moduleId: moduleId,
                },
            }),
        ]);

        revalidatePath(`/admin/courses/${courseId}/edit`);

        return {
            status: "success",
            message: "Lesson deleted successfully",
        }
    } catch {
        return {
            status: "error",
            message: "Failed to delete lesson",
        };
    }
}


// Server action to delete a module
export async function deleteModule(
    {
        courseId,
        moduleId,
    }: {
        courseId: string;
        moduleId: string;
    }
): Promise<ApiResponse> {
    await requireAdmin();

    try {
        const courseWithModules = await prisma.course.findUnique({
            where: {
                id: courseId,
            },
            select: {
                module: {
                    orderBy: { position: "asc" },
                    select: {
                        id: true,
                        position: true,
                    },
                },
            },
        });

        if (!courseWithModules) {
            return {
                status: "error",
                message: "Course not found",
            };
        }

        const modules = courseWithModules.module;

        const moduleToDelete = modules.find(
            (moduleItem) => moduleItem.id === moduleId
        );

        if (!moduleToDelete) {
            return {
                status: "error",
                message: "Module not found in the specified course",
            };
        }

        const remainingModules = modules.filter(
            (moduleItem) => moduleItem.id !== moduleId
        );

        const updates = remainingModules.map((moduleItem: { id: string; position: number }, index: number) =>
            prisma.module.update({
                where: { id: moduleItem.id },
                data: { position: index + 1 },
            })
        );

        // Delete module + reorder positions
        await prisma.$transaction([
            ...updates,
            prisma.module.delete({
                where: {
                    id: moduleId,
                    courseId: courseId,
                },
            }),
        ]);

        revalidatePath(`/admin/courses/${courseId}/edit`);

        return {
            status: "success",
            message: "Module deleted successfully",
        };

    } catch (error) {
        console.error(error);

        return {
            status: "error",
            message: "Failed to delete module",
        };
    }
}
