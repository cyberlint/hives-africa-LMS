import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { Paystack } from '@/lib/paystack';

/**
 * GET /api/purchases/[paymentId]/receipt
 * Generates a receipt for a specific purchase with Paystack receipt URL
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { paymentId: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { paymentId } = params;

    // Fetch the payment with course details
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            price: true,
            category: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Verify the payment belongs to the authenticated user
    if (payment.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Try to fetch receipt URL from Paystack
    let receiptUrl = '';
    try {
      const paystackReceipt = await Paystack.verifyTransaction(payment.reference);
      if (paystackReceipt.status && paystackReceipt.data) {
        receiptUrl = `https://receipt.verifyonline.com/receipts/${payment.reference}`;
      }
    } catch (error) {
      console.error(`Failed to fetch Paystack receipt for ${payment.reference}:`, error);
    }

    // Generate receipt data
    const receiptData = {
      id: payment.id,
      reference: payment.reference,
      courseTitle: payment.course.title,
      instructor: payment.course.user.name,
      purchaseDate: payment.createdAt.toLocaleDateString(),
      originalPrice: payment.course.price,
      discount: Math.round(((payment.course.price - payment.amount) / payment.course.price) * 100) || 0,
      discountAmount: payment.course.price - payment.amount,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      category: payment.course.category,
      receiptUrl, // Paystack receipt PDF URL
    };

    return NextResponse.json({
      success: true,
      data: receiptData,
    });
  } catch (error) {
    console.error('Error fetching receipt:', error);
    return NextResponse.json(
      { error: 'Failed to fetch receipt' },
      { status: 500 }
    );
  }
}
