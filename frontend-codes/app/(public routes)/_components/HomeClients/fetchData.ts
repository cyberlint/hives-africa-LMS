"use server";

import { prisma } from "@/lib/db";
import { CourseListItem } from "@/services/courses";

// Re-using the logic found in existing API routes but running purely server-side
async function transformCourses(courses: any[]): Promise<CourseListItem[]> {
    // Use map to return an array of promises
    const promises = courses.map(async (course) => {
        // In a real scenario you might need to fetch rating/reviews here if they aren't part of the initial query
        // For now we use the same transform logic as the API
        const totalLessons = course.module.reduce((sum: number, mod: any) => sum + mod.lessons.length, 0);
        const students = course._count?.enrollments || 0;

        return {
            id: course.id,
            title: course.title,
            slug: course.slug,
            thumbnail: course.fileKey,
            current_price: course.price,
            original_price: course.originalPrice, // Using the new field we added
            is_free: course.price === 0,
            instructor: {
                id: course.user.id,
                first_name: course.user.name.split(' ')[0] || course.user.name,
                last_name: course.user.name.split(' ').slice(1).join(' ') || '',
                full_name: course.user.name,
            },
            category: {
                id: course.category,
                name: course.category,
                slug: course.category.toLowerCase().replace(/\s+/g, '-'),
            },
            difficulty: course.level,
            average_rating: 4.8, // Mocked rating for now as per existing APIs logic
            total_reviews: 0,
            total_enrollments: students,
            short_description: course.shortdescription,
            created_at: course.createdAt.toISOString(),
        };
    });

    return Promise.all(promises);
}

export async function getFeaturedCourses(): Promise<CourseListItem[]> {
    try {
        const courses = await prisma.course.findMany({
            where: {
                status: 'Published',
            },
            take: 4,
            orderBy: {
                createdAt: 'asc', // "Featured" logic per existing API
            },
            include: {
                user: { select: { id: true, name: true, image: true } },
                module: { include: { lessons: true } },
                _count: { select: { enrollments: true } },
            },
        });
        return transformCourses(courses);
    } catch (error) {
        console.error("Failed to fetch featured courses", error);
        return [];
    }
}

export async function getBestSellingCourses(limit = 8): Promise<CourseListItem[]> {
    try {
        const courses = await prisma.course.findMany({
            where: {
                status: 'Published',
            },
            take: limit,
            orderBy: {
                enrollments: { _count: 'desc' }
            },
            include: {
                user: { select: { id: true, name: true, image: true } },
                module: { include: { lessons: true } },
                _count: { select: { enrollments: true } },
            },
        });
        return transformCourses(courses);
    } catch (error) {
        console.error("Failed to fetch best selling courses", error);
        return [];
    }
}

export async function getRecentlyAddedCourses(limit = 8): Promise<CourseListItem[]> {
    try {
        const courses = await prisma.course.findMany({
            where: {
                status: 'Published',
            },
            take: limit,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: { select: { id: true, name: true, image: true } },
                module: { include: { lessons: true } },
                _count: { select: { enrollments: true } },
            },
        });
        return transformCourses(courses);
    } catch (error) {
        console.error("Failed to fetch recently added courses", error);
        return [];
    }
}
