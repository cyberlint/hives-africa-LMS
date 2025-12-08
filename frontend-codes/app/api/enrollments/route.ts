import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

// Get user's enrollments
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId,
        paymentStatus: 'Completed',
      },
      include: {
        Course: {
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
          },
        },
      },
      orderBy: {
        enrolledAt: 'desc',
      },
    });

    const enrolledCourses = enrollments.map((enrollment) => {
      const totalLessons = enrollment.Course.module.reduce(
        (sum, module) => sum + module.lessons.length,
        0
      );

      return {
        enrollmentId: enrollment.id,
        courseId: enrollment.Course.id,
        title: enrollment.Course.title,
        description: enrollment.Course.shortdescription,
        instructor: enrollment.Course.user.name,
        instructorId: enrollment.Course.user.id,
        image: enrollment.Course.fileKey,
        progress: enrollment.progress,
        totalLessons,
        duration: enrollment.Course.duration,
        level: enrollment.Course.level,
        category: enrollment.Course.category,
        enrolledAt: enrollment.enrolledAt.toISOString(),
        completedAt: enrollment.completedAt?.toISOString(),
      };
    });

    return NextResponse.json({ enrollments: enrolledCourses });
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enrollments' },
      { status: 500 }
    );
  }
}

// Create enrollment (for free courses)
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    // Check if course exists and is free
    const course = await prisma.course.findUnique({
      where: { id: courseId, status: 'Published' },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    if (course.price > 0) {
      return NextResponse.json(
        { error: 'This course requires payment. Please use the payment flow.' },
        { status: 400 }
      );
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'Already enrolled in this course' },
        { status: 400 }
      );
    }

    // Create enrollment for free course
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        paymentStatus: 'Completed',
        paymentAmount: 0,
        paidAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      enrollment: {
        id: enrollment.id,
        courseId: enrollment.courseId,
        enrolledAt: enrollment.enrolledAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error creating enrollment:', error);
    return NextResponse.json(
      { error: 'Failed to create enrollment' },
      { status: 500 }
    );
  }
}
