import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: request.headers });
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const purchases = await prisma.payment.findMany({
            where: {
                userId: session.user.id,
                status: 'Completed',
            },
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        fileKey: true, // using fileKey as thumbnail based on other files
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const formattedPurchases = purchases.map((purchase) => ({
            id: purchase.id,
            courseTitle: purchase.course.title,
            courseId: purchase.course.id,
            courseSlug: purchase.course.slug,
            amount: purchase.amount,
            currency: purchase.currency,
            date: purchase.createdAt,
            status: purchase.status,
            receiptUrl: '#', // Placeholder for now
        }));

        return NextResponse.json({ purchases: formattedPurchases });
    } catch (error) {
        console.error('Error fetching purchases:', error);
        return NextResponse.json(
            { error: 'Failed to fetch purchases' },
            { status: 500 }
        );
    }
}
