import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    const session = await auth.api.getSession({ headers: request.headers });
    const userId = session?.user?.id;

    // Fetch course with modules and lessons
    const course = await prisma.course.findUnique({
      where: { id: courseId, status: 'Published' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        module: {
          orderBy: { position: 'asc' },
          include: {
            lessons: {
              orderBy: { position: 'asc' },
              include: {
                attachments: true,
              },
            },
          },
        },
        enrollments: userId
          ? {
            where: { userId },
            select: {
              id: true,
              progress: true,
              paymentStatus: true,
              enrolledAt: true,
              completedAt: true,
            },
          }
          : false,
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Check if user is enrolled or course is free
    const enrollment = Array.isArray(course.enrollments) ? course.enrollments[0] : null;
    const isEnrolled = !!enrollment && enrollment.paymentStatus === 'Completed';
    const isFree = course.price === 0;
    const hasAccess = isEnrolled || isFree;

    // Get lesson progress if user is logged in
    let lessonProgress: Record<string, any> = {};
    if (userId && hasAccess) {
      const progress = await prisma.lessonProgress.findMany({
        where: {
          userId,
          lessonId: {
            in: course.module.flatMap((m) => m.lessons.map((l) => l.id)),
          },
        },
      });
      lessonProgress = progress.reduce((acc, p) => {
        acc[p.lessonId] = p;
        return acc;
      }, {} as Record<string, any>);
    }

    // Transform data to match frontend types
    const sections = course.module.map((module) => ({
      id: module.id,
      title: module.title,
      position: module.position,
      lectures: module.lessons.map((lesson) => {
        const progress = lessonProgress[lesson.id];
        return {
          id: lesson.id,
          title: lesson.title,
          type: lesson.type.toLowerCase() as 'video' | 'document' | 'quiz' | 'resource',
          content: hasAccess ? lesson.content : undefined,
          videoKey: hasAccess ? lesson.videoKey : undefined,
          thumbnailKey: lesson.thumbnailKey,
          duration: lesson.duration,
          completed: progress?.completed || false,
          description: lesson.description,
          position: lesson.position,
          currentTime: progress?.currentTime,
          attachments: hasAccess ? lesson.attachments : [],
          documentKey: hasAccess ? lesson.documentKey : undefined,
          quizConfig: hasAccess ? lesson.quizConfig : undefined,
        };
      }),
    }));

    const allLectures = sections.flatMap((s) => s.lectures);
    const completedLectures = allLectures.filter((l) => l.completed).length;

    const courseData = {
      id: course.id,
      title: course.title,
      description: course.description,
      shortDescription: course.shortdescription,
      instructor: course.user.name,
      instructorId: course.user.id,
      price: course.price,
      originalPrice: (course as any).originalPrice,
      registrationFee: (course as any).registrationFee,
      duration: course.duration,
      level: course.level,
      category: course.category,
      image: course.fileKey,
      slug: course.slug,
      status: course.status,
      sections,
      lectures: allLectures,
      completedLectures,
      totalLectures: allLectures.length,
      progress: enrollment?.progress || 0,
      isEnrolled,
      enrollmentId: enrollment?.id,
      createdAt: course.createdAt.toISOString(),
      updatedAt: course.updatedAt.toISOString(),
    };

    return NextResponse.json(courseData);
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}
