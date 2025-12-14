import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ lessonId: string }> }
) {
    try {
        const { lessonId } = await params;
        const session = await auth.api.getSession({ headers: request.headers });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const lesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
            select: {
                id: true,
                title: true,
                description: true,
                quizConfig: true,
                duration: true,
            }
        });

        if (!lesson || !lesson.quizConfig) {
            return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
        }

        // Sanitize questions (remove correctOptionId for security)
        const questions = (lesson.quizConfig as any[]).map((q: any) => ({
            id: q.id,
            question: q.question,
            options: q.options,
        }));

        return NextResponse.json({
            ...lesson,
            quizConfig: questions
        });

    } catch (error) {
        console.error("Quiz fetch error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
