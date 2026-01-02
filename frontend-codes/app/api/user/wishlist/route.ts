
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET(req: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const wishlistItems = await prisma.wishlist.findMany({
            where: { userId: session.user.id },
            include: {
                course: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                image: true
                            }
                        }
                    }
                }
            }
        });

        const formattedCourses = wishlistItems.map(item => ({
            id: item.course.id,
            title: item.course.title,
            description: item.course.description,
            thumbnail: item.course.fileKey, // Assuming fileKey is used for thumbnail in this project context
            price: item.course.price,
            duration: item.course.duration * 60, // Convert to minutes if frontend expects minutes
            level: item.course.level,
            rating: 0, // Placeholder as rating is not in Course model yet
            instructor: {
                name: item.course.user.name,
                avatar: item.course.user.image
            },
            tags: [item.course.category]
        }));

        return NextResponse.json({ courses: formattedCourses });
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
