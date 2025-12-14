import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        // Strategy: Since we don't have a "featured" flag, we'll pick courses 
        // that have the highest combination of rating (if available) or are manually selected.
        // For now, we'll simulate "featured" by picking 4 random published courses
        // or courses with high price/popularity.

        // Let's get 4 published courses.
        // In a real app, you might have a `featured: boolean` field.
        const courses = await prisma.course.findMany({
            where: {
                status: 'Published',
            },
            take: 4,
            orderBy: {
                // Just picking the newest ones for now, or could use random logic if supported
                // Or if we had a rating system fully implemented.
                createdAt: 'asc',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
                module: {
                    include: {
                        lessons: true,
                    },
                },
                enrollments: true, // We need to count these
                _count: {
                    select: {
                        enrollments: true,
                    },
                },
            },
        });

        const transformedCourses = courses.map((course) => {
            const totalLessons = course.module.reduce((sum, mod) => sum + mod.lessons.length, 0);

            return {
                id: course.id,
                title: course.title,
                description: course.description,
                shortDescription: course.shortdescription,
                instructor: course.user.name,
                instructorId: course.user.id,
                instructorAvatar: course.user.image,
                thumbnail: course.fileKey,
                image: course.fileKey,
                duration: course.duration,
                totalLessons,
                rating: 4.8, // Mocked high rating for featured
                students: course._count?.enrollments || 0,
                price: course.price,
                category: course.category,
                level: course.level,
                language: 'English',
                slug: course.slug,
                status: course.status,
                isEnrolled: false, // Context-less fetch
                enrollmentId: null,
                progress: 0,
                createdAt: course.createdAt.toISOString(),
                updatedAt: course.updatedAt.toISOString(),
            };
        });

        return NextResponse.json({ courses: transformedCourses });
    } catch (error) {
        console.error('Error fetching featured courses:', error);
        return NextResponse.json(
            { error: 'Failed to fetch featured courses' },
            { status: 500 }
        );
    }
}
