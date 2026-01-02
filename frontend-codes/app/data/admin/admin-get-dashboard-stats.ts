import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/db";

export async function adminGetDashboardStats() {
    const { user } = await requireAdmin();
    const userId = user.id;

    const [totalSales, totalLearners, totalCourses, totalModules] = await Promise.all([
        // Total sales
        prisma.payment.aggregate({
            where: {
                status: "Completed",
                course: {
                userId: userId,
                },
            },
            _sum: {
                amount: true,
            },
            }).then((res) => res._sum.amount || 0),

        // Total learners
        prisma.user.count({
            where: {
                enrollments: {
                    some: {
                        Course: {
                            userId: userId,
                        },
                    },
                },
            },
        }),

        // Total courses
        prisma.course.count({
            where: {
                userId: userId,
            },
        }),

        // Total Modules
        prisma.module.count({
            where: {
                Course: {
                    userId: userId,
                },
            },
        }),
    ]);

    return {
        totalSales,
        totalLearners,
        totalCourses,
        totalModules,
    };
}