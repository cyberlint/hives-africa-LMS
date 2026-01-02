import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { Paystack } from '@/lib/paystack';

/**
 * GET /api/purchases/[paymentId]/download
 * Downloads a receipt as a PDF file (fallback to text) for a specific purchase
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ paymentId: string }> }
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
    const { paymentId } = await params;

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

    // Try to get actual Paystack receipt URL first
    try {
      const paystackReceipt = await Paystack.verifyTransaction(payment.reference);
      if (paystackReceipt.status && paystackReceipt.data && paystackReceipt.data.receipt_url) {
        return NextResponse.redirect(paystackReceipt.data.receipt_url);
      }
    } catch (error) {
      console.error("Failed to get Paystack redirect:", error);
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
    };

    // Generate simple text-based receipt
    const receiptContent = generateReceiptContent(receiptData);

    return new NextResponse(receiptContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="receipt-${payment.reference}.txt"`,
      },
    });
  } catch (error) {
    console.error('Error downloading receipt:', error);
    return NextResponse.json(
      { error: 'Failed to download receipt' },
      { status: 500 }
    );
  }
}

/**
 * Generates receipt content as string
 */
function generateReceiptContent(receipt: any): string {
  const divider = '='.repeat(50);
  const lines = [
    divider,
    'PURCHASE RECEIPT',
    divider,
    '',
    `Receipt #: ${receipt.reference}`,
    `Date: ${receipt.purchaseDate}`,
    `Status: ${receipt.status.toUpperCase()}`,
    '',
    divider,
    'COURSE DETAILS',
    divider,
    `Title: ${receipt.courseTitle}`,
    `Instructor: ${receipt.instructor}`,
    `Category: ${receipt.category}`,
    '',
    divider,
    'PAYMENT SUMMARY',
    divider,
    `Original Price: ${receipt.currency} ${receipt.originalPrice.toFixed(2)}`,
    ...(receipt.discount > 0
      ? [
        `Discount (${receipt.discount}%): -${receipt.currency} ${receipt.discountAmount.toFixed(2)}`,
      ]
      : []),
    `Total Paid: ${receipt.currency} ${receipt.amount.toFixed(2)}`,
    '',
    divider,
    `Generated on: ${new Date().toLocaleString()}`,
    divider,
  ];

  return lines.join('\n');
}
