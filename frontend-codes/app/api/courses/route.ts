import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    const userId = session?.user?.id;

    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    const search = searchParams.get('search');

    // Build where clause
    const where: any = {
      status: 'Published',
    };

    if (category && category !== 'all') {
      where.category = category;
    }

    if (level && level !== 'all') {
      where.level = level;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortdescription: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Fetch courses
    const courses = await prisma.course.findMany({
      where,
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
        enrollments: userId
          ? {
              where: { userId },
              select: {
                id: true,
                progress: true,
                paymentStatus: true,
              },
            }
          : false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform data
    const transformedCourses = courses.map((course) => {
      const enrollment = Array.isArray(course.enrollments) ? course.enrollments[0] : null;
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
        rating: 4.5, // TODO: Calculate from reviews
        students: 0, // TODO: Count enrollments
        price: course.price,
        category: course.category,
        level: course.level,
        language: 'English', // TODO: Add to schema
        slug: course.slug,
        status: course.status,
        isEnrolled: !!enrollment && enrollment.paymentStatus === 'Completed',
        enrollmentId: enrollment?.id,
        progress: enrollment?.progress || 0,
        createdAt: course.createdAt.toISOString(),
        updatedAt: course.updatedAt.toISOString(),
      };
    });

    return NextResponse.json({ courses: transformedCourses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}
