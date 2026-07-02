import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { Paystack, formatAmountFromPaystack } from '@/lib/paystack';
import { eventBus } from '@/domains/communications/events/publisher';
import { EVENT_TYPES } from '@/domains/communications/events/event-types';

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

    // Read generic metadata and narrow it to an object for safe property access
    const rawMetadata = transactionData.metadata;
    const md: Record<string, any> = (typeof rawMetadata === 'object' && rawMetadata !== null)
      ? (rawMetadata as Record<string, any>)
      : {};
    const itemId = md.item_id || md.course_id || md.itemId || md.courseId || undefined;
    const itemType = md.item_type || md.itemType || (md.course_id ? 'course' : undefined) || 'course';

    const mapItemType = (t?: string) => {
      if (!t) return undefined;
      const s = t.toString().toLowerCase();
      if (s === 'course') return 'Course';
      if (s === 'bootcamp') return 'Bootcamp';
      if (s === 'program') return 'Program';
      if (s === 'event') return 'Event';
      if (s === 'enrollment') return 'Enrollment';
      if (s === 'subscription') return 'Subscription';
      return 'Other';
    };
    const prismaItemType = mapItemType(itemType);

    // Try to fetch any existing payment record
    const paymentRecord = await prisma.payment.findUnique({
  where: { reference },
});

const paymentMd: Record<string, any> =
  paymentRecord?.metadata &&
  typeof paymentRecord.metadata === "object" &&
  !Array.isArray(paymentRecord.metadata)
    ? (paymentRecord.metadata as Record<string, any>)
    : {};

    // Prepare upsert payload
    const upsertUpdate: any = {
      status: 'Completed',
      paymentMethod: transactionData.channel,
      metadata: transactionData as any,
    };
    const upsertCreate: any = {
      reference,
      amount: formatAmountFromPaystack(transactionData.amount),
      currency: transactionData.currency,
      status: 'Completed',
      paymentMethod: transactionData.channel,
      metadata: transactionData as any,
      userId,
    };

    if (itemId) {
      // keep legacy courseId for compatibility when applicable
      if (itemType === 'course') {
        upsertUpdate.courseId = itemId;
        upsertCreate.courseId = itemId;
      }
      // set polymorphic fields
      if (prismaItemType) {
        upsertUpdate.itemType = prismaItemType;
        upsertUpdate.itemId = itemId;
        upsertCreate.itemType = prismaItemType;
        upsertCreate.itemId = itemId;
      }
    }

    const payment = await prisma.payment.upsert({
      where: { reference },
      update: upsertUpdate,
      create: upsertCreate,
    });

    // If course purchase, create/update enrollment
    if (itemType === 'course' && itemId) {
      const existingEnrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId: itemId } },
      });

      const enrollment = await prisma.enrollment.upsert({
        where: { userId_courseId: { userId, courseId: itemId } },
        update: {
          paymentReference: reference,
          paymentStatus: 'Completed',
          paymentAmount: formatAmountFromPaystack(transactionData.amount),
          paidAt: new Date(transactionData.paid_at),
          paymentId: payment.id
        },
        create: {
          userId,
          courseId: itemId,
          paymentReference: reference,
          paymentStatus: 'Completed',
          paymentAmount: formatAmountFromPaystack(transactionData.amount),
          paidAt: new Date(transactionData.paid_at),
          paymentId: payment.id
        }
      });

      // Fetch course details for response
      const course = await prisma.course.findUnique({ where: { id: itemId }, include: { user: { select: { name: true, image: true } } } });

      const shouldPublishEnrollmentEvent = !existingEnrollment || existingEnrollment.paymentStatus !== 'Completed';

      if (shouldPublishEnrollmentEvent) {
        void eventBus.publish({
          type: EVENT_TYPES.COURSE_ENROLLED,
          userId,
          payload: {
            courseId: itemId,
            courseTitle: course?.title || md.title || 'your course',
            courseUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://hives.africa'}/dashboard/courses/${itemId}`,
            enrolledAt: new Date().toISOString(),
            instructorName: course?.user?.name,
          },
        }).catch((error) => {
          console.error('Failed to publish course enrollment event:', error);
        });
      }

      return NextResponse.json({
        status: 'success',
        message: 'Payment verified successfully',
        enrollment_id: enrollment.id,
        course_title: course?.title || md.title,
        course_id: itemId,
        instructor: course?.user?.name,
        thumbnail: course?.fileKey,
        price: course?.price
      });
    }

    // Non-course purchases: return next_route if provided by metadata
    const nextRoute = md.success_url || md.next_route || paymentMd.success_url || paymentMd.next_route;

    return NextResponse.json({
      status: 'success',
      message: 'Payment verified successfully',
      purchase_type: itemType,
      item_id: itemId,
      next_route: nextRoute,  
      metadata: transactionData,
    });

  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}