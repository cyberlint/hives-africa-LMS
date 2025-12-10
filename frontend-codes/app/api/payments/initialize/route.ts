import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth'; // Assuming auth is available here, or use request session
import { Paystack, formatAmountForPaystack, generatePaymentReference } from '@/lib/paystack';

interface PaymentRequestBody {
  course_id: string;
  coupon_code?: string;
  redirect_url?: string;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user?.email || !session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized: User email and ID required' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const userEmail = session.user.email;
    const body: PaymentRequestBody = await request.json();
    const { course_id, redirect_url, channels } = body as any;

    if (!course_id) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    // 1. Fetch Course details
    const course = await prisma.course.findUnique({
      where: { id: course_id },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check if user is already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: course_id,
        },
      },
    });

    if (existingEnrollment && existingEnrollment.paymentStatus === 'Completed') {
      return NextResponse.json(
        { error: 'You are already enrolled in this course' },
        { status: 400 }
      );
    }

    // 2. Calculate Amount (Handle coupons here if needed, strictly just course price for now)
    // TODO: Integrate Coupon validation logic if needed
    let amount = course.price;
    if (amount === 0) {
      // Free course logic should be handled separately or here
      return NextResponse.json({ error: 'Payment not required for free course' }, { status: 400 });
    }

    // 3. Generate Reference
    const reference = generatePaymentReference();

    // 4. Create local Payment record (Pending)
    await prisma.payment.create({
      data: {
        reference,
        amount: amount,
        currency: 'NGN',
        status: 'Pending',
        userId: userId,
        courseId: course_id,
        metadata: {
          course_title: course.title,
          ...body
        }
      },
    });

    // 5. Initialize Paystack Transaction
    const paystackResponse = await Paystack.initializeTransaction(
      userEmail,
      formatAmountForPaystack(amount),
      redirect_url, // Optional: Paystack uses default if not provided, or override
      {
        custom_fields: [
          {
            display_name: "Course",
            variable_name: "course",
            value: course.title
          }
        ],
        course_id: course_id,
        user_id: userId,
        payment_reference: reference // Pass our reference in metadata for cross-check
      },
      channels // Pass channels if provided (e.g. ['card', 'bank'])
    );

    if (!paystackResponse.status) {
      await prisma.payment.update({
        where: { reference },
        data: { status: 'Failed' }
      });
      return NextResponse.json({ error: 'Failed to initialize payment with Paystack' }, { status: 502 });
    }

    // Update local payment with Paystack's reference if different (usually we use ours or theirs)
    // We already set our reference. Paystack returns 'access_code' and 'reference'.
    // If Paystack enforces their own reference, we might need to store it.
    // Usually we send OUR reference to Paystack.
    // Let's rely on the reference we generated and stored.

    return NextResponse.json({
      authorization_url: paystackResponse.data.authorization_url,
      reference: reference, // Return OUR reference
      access_code: paystackResponse.data.access_code,
    });

  } catch (error: any) {
    console.error('Payment initialization error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
