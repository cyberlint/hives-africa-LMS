import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ lessonId: string }> }
) {
    try {
        const { lessonId } = await params;
        const session = await auth.api.getSession({ headers: request.headers });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { answers } = await request.json(); // Record<string, string> (questionId -> optionId)

        const lesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
            select: {
                id: true,
                quizConfig: true,
            }
        });

        if (!lesson || !lesson.quizConfig) {
            return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
        }

        const questions = lesson.quizConfig as any[];
        let correctCount = 0;
        const totalQuestions = questions.length;

        questions.forEach((q) => {
            if (answers[q.id] === q.correctOptionId) {
                correctCount++;
            }
        });

        const score = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
        const roundedScore = Math.round(score * 10) / 10;

        // Update Progress
        await prisma.lessonProgress.upsert({
            where: {
                userId_lessonId: {
                    userId: session.user.id,
                    lessonId: lessonId
                }
            },
            update: {
                completed: true,
                completedAt: new Date(),
                // @ts-ignore: score added to schema but client might not be generated yet
                score: roundedScore,
            },
            create: {
                userId: session.user.id,
                lessonId: lessonId,
                completed: true,
                completedAt: new Date(),
                // @ts-ignore
                score: roundedScore,
            }
        });

        return NextResponse.json({
            score: roundedScore,
            correctCount,
            totalQuestions,
            passed: true
        });

    } catch (error) {
        console.error("Quiz submit error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
