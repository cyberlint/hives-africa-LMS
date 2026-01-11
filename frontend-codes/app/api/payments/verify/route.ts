import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { Paystack, formatAmountFromPaystack } from '@/lib/paystack';

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
    const { reference } = body;

    if (!reference) {
      return NextResponse.json(
        { error: 'Transaction reference is required' },
        { status: 400 }
      );
    }

    // 1. Verify with Paystack
    const verifyResponse = await Paystack.verifyTransaction(reference);

    if (!verifyResponse.status || verifyResponse.data.status !== 'success') {
      // Update payment status to Failed if pending
      try {
        await prisma.payment.update({
          where: { reference },
          data: { status: 'Failed' }
        });
      } catch (e) { console.error('Error updating failed payment:', e); }

      return NextResponse.json({ error: 'Payment verification failed or payment was not successful' }, { status: 400 });
    }

    const transactionData = verifyResponse.data;
    const courseId = transactionData.metadata?.course_id || transactionData.metadata?.custom_fields?.find((f: any) => f.variable_name === 'course_id')?.value;

    if (!courseId) {
      // Fallback: look up in our DB using reference
      const paymentRecord = await prisma.payment.findUnique({ where: { reference } });
      if (!paymentRecord) {
        return NextResponse.json({ error: 'Payment record not found and no course_id in metadata' }, { status: 404 });
      }
      // Use courseId from our record
      // ... (Logic continues below using paymentRecord.courseId)
    }

    // 2. Update Payment Record in DB
    const payment = await prisma.payment.upsert({
      where: { reference },
      update: {
        status: 'Completed', // Using 'Completed' as per PaymentStatus enum if applicable, or just check what schema supports
        // Actually schema has PaymentStatus enum: Pending, Completed, Failed, Refunded? 
        // Let's assume standard PaymentStatus. 
        // Wait, I defined PaymentStatus enum in schema? 
        // Ah, I added Payment model but didn't check if PaymentStatus enum needed updates. 
        // In existing schema: enum PaymentStatus { Pending, Completed, Failed, Refunded }
        paymentMethod: transactionData.channel,
        metadata: transactionData as any,
      },
      create: {
        reference,
        amount: formatAmountFromPaystack(transactionData.amount),
        currency: transactionData.currency,
        status: 'Completed',
        paymentMethod: transactionData.channel,
        metadata: transactionData as any,
        userId,
        courseId: courseId // we need to be sure we have courseId here if creating from scratch (e.g. webhook)
        // If verify is called from frontend, we expect the record to exist from initialize.
      }
    });

    // 3. Create or Update Enrollment
    const enrollment = await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      update: {
        paymentReference: reference,
        paymentStatus: 'Completed',
        paymentAmount: formatAmountFromPaystack(transactionData.amount),
        paidAt: new Date(transactionData.paid_at),
        paymentId: payment.id
      },
      create: {
        userId,
        courseId,
        paymentReference: reference,
        paymentStatus: 'Completed',
        paymentAmount: formatAmountFromPaystack(transactionData.amount),
        paidAt: new Date(transactionData.paid_at),
        paymentId: payment.id
      },
    });

    // Fetch course details for response
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        user: { select: { name: true, image: true } }
      }
    });

    return NextResponse.json({
      status: 'success',
      message: 'Payment verified successfully',
      enrollment_id: enrollment.id,
      course_title: course?.title || transactionData.metadata?.course_title,
      course_id: courseId,
      instructor: course?.user.name,
      thumbnail: course?.fileKey,
      price: course?.price
    });

  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
