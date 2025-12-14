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

    // Format the response and fetch receipt URLs from Paystack
    const formattedPurchases = await Promise.all(
      payments.map(async (payment) => {
        let receiptUrl = '';
        try {
          // Fetch receipt URL from Paystack
          const paystackReceipt = await Paystack.verifyTransaction(payment.reference);
          if (paystackReceipt.status && paystackReceipt.data) {
            receiptUrl = `https://receipt.verifyonline.com/receipts/${payment.reference}`;
          }
        } catch (error) {
          console.error(`Failed to fetch Paystack receipt for ${payment.reference}:`, error);
          // Fallback to our own receipt endpoint
          receiptUrl = `/api/purchases/${payment.id}/receipt`;
        }

        return {
          id: payment.id,
          courseTitle: payment.course.title,
          instructor: payment.course.user.name,
          instructorAvatar: payment.course.user.image || '/ai.png',
          courseThumbnail: payment.course.fileKey || '/ai.png',
          purchaseDate: payment.createdAt.toISOString().split('T')[0],
          amount: payment.amount,
          originalPrice: payment.course.price,
          discount: Math.round(((payment.course.price - payment.amount) / payment.course.price) * 100) || 0,
          paymentMethod: payment.paymentMethod || 'Card Payment',
          status: 'completed',
          receiptUrl,
          category: payment.course.category,
          paymentReference: payment.reference,
          courseId: payment.course.id,
        };
      })
    );

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
