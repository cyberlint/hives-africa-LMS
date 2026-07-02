import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { Paystack } from '@/lib/paystack';

/**
 * GET /api/purchases
 * Fetches all completed purchases for the authenticated user
 */
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

    // Fetch all payments (purchases) for the user
    const payments = await prisma.payment.findMany({
      where: {
        userId,
        status: 'Completed',
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            fileKey: true,
            price: true,
            category: true,
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format the response
    const formattedPurchases = payments.map((payment) => {
      const course = payment.course;
      const courseTitle = course?.title || 'Course';
      const instructorName = course?.user?.name || 'Instructor';
      const originalPrice = course?.price ?? 0;
      const discount = originalPrice > 0
        ? Math.round(((originalPrice - payment.amount) / originalPrice) * 100) || 0
        : 0;

      return {
        id: payment.id,
        courseTitle,
        instructor: instructorName,
        instructorAvatar: course?.user?.image || '/ai.png',
        courseThumbnail: course?.fileKey || '/ai.png',
        purchaseDate: payment.createdAt.toISOString().split('T')[0],
        amount: payment.amount,
        originalPrice,
        discount,
        paymentMethod: payment.paymentMethod || 'Card Payment',
        status: 'completed',
        receiptUrl: `/api/purchases/${payment.id}/receipt`,
        category: course?.category || 'General',
        paymentReference: payment.reference,
        courseId: course?.id || payment.itemId || null,
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedPurchases,
      total: formattedPurchases.length,
    });
  } catch (error) {
    console.error('Error fetching purchases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch purchases' },
      { status: 500 }
    );
  }
}
