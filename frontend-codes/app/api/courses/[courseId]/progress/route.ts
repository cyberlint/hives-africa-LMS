import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

// Update lesson progress
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();
    const { lessonId, completed, currentTime } = body;

    if (!lessonId) {
      return NextResponse.json(
        { error: 'Lesson ID is required' },
        { status: 400 }
      );
    }

    // Verify user has access to this course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { price: true },
    });

    const isFree = course?.price === 0;
    const hasAccess = (enrollment && enrollment.paymentStatus === 'Completed') || isFree;

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'You must enroll in this course first' },
        { status: 403 }
      );
    }

    // Update or create lesson progress
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        completed: completed ?? undefined,
        completedAt: completed ? new Date() : undefined,
        currentTime: currentTime ?? undefined,
        updatedAt: new Date(),
      },
      create: {
        userId,
        lessonId,
        completed: completed || false,
        completedAt: completed ? new Date() : undefined,
        currentTime: currentTime || 0,
      },
    });

    // Update enrollment progress
    if (enrollment) {
      const allLessons = await prisma.lesson.findMany({
        where: {
          Module: {
            courseId,
          },
        },
        select: { id: true },
      });

      const completedLessons = await prisma.lessonProgress.count({
        where: {
          userId,
          lessonId: {
            in: allLessons.map((l) => l.id),
          },
          completed: true,
        },
      });

      const progressPercentage = (completedLessons / allLessons.length) * 100;

      await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: {
          progress: progressPercentage,
          completedAt: progressPercentage === 100 ? new Date() : null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}

// Get lesson progress
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get all lessons for this course
    const lessons = await prisma.lesson.findMany({
      where: {
        Module: {
          courseId,
        },
      },
      select: { id: true },
    });

    // Get progress for all lessons
    const progress = await prisma.lessonProgress.findMany({
      where: {
        userId,
        lessonId: {
          in: lessons.map((l) => l.id),
        },
      },
    });

    return NextResponse.json({
      progress: progress.reduce((acc, p) => {
        acc[p.lessonId] = {
          completed: p.completed,
          completedAt: p.completedAt?.toISOString(),
          currentTime: p.currentTime,
        };
        return acc;
      }, {} as Record<string, any>),
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}
