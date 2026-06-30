import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth'; // Assuming auth is available here, or use request session
import { Paystack, formatAmountForPaystack, generatePaymentReference } from '@/lib/paystack';

interface PaymentRequestBody {
  // Legacy
  course_id?: string;
  // Generic
  item_id?: string;
  item_type?: string;
  amount?: number;
  coupon_code?: string;
  redirect_url?: string; // callback used by client
  success_url?: string; // product-specific success redirect
  failure_url?: string;
  metadata?: any;
  channels?: string[];
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
    const { item_id, item_type, course_id, amount: bodyAmount, redirect_url, channels, success_url, failure_url, metadata } = body as any;

    // Normalize legacy course_id -> item_id + item_type
    const itemId = item_id || course_id;
    const itemType = item_type || (course_id ? 'course' : undefined);

    // Map to Prisma enum casing (Course, Program, Event, etc.)
    const mapItemType = (t?: string) => {
      if (!t) return undefined;
      const s = t.toString().toLowerCase();
      if (s === 'course') return 'Course';
      if (s === 'program') return 'Program';
      if (s === 'bootcamp') return 'Bootcamp';
      if (s === 'event') return 'Event';
      if (s === 'enrollment') return 'Enrollment';
      if (s === 'subscription') return 'Subscription';
      return 'Other';
    };
    const prismaItemType = mapItemType(itemType);

    // 1. Resolve product and amount
    let amount: number | undefined = bodyAmount;
    let productTitle: string | undefined = undefined;
    if (itemType === 'course' && itemId) {
      const course = await prisma.course.findUnique({ where: { id: itemId } });
      if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });

      // Check enrollment for courses
      const existingEnrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId: itemId } },
      });
      if (existingEnrollment && existingEnrollment.paymentStatus === 'Completed') {
        return NextResponse.json({ error: 'You are already enrolled in this course' }, { status: 400 });
      }

      amount = amount ?? course.price;
      productTitle = course.title;
      if (amount === 0) {
        return NextResponse.json({ error: 'Payment not required for free course' }, { status: 400 });
      }
    }

    // For non-course items, require amount to be provided
    if (!amount) {
      return NextResponse.json({ error: 'Amount is required for this product type' }, { status: 400 });
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
        // keep legacy relation for compatibility
        ...(itemType === 'course' && itemId ? { courseId: itemId } : {}),
        // set polymorphic fields for future-proof queries
        ...(prismaItemType && itemId ? { itemType: prismaItemType, itemId: itemId } : {}),
        metadata: {
          item_type: itemType,
          item_id: itemId,
          title: productTitle,
          success_url,
          failure_url,
          ...metadata,
          // keep original request for debugging
          requested: body,
        },
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
            display_name: productTitle ? 'Product' : 'Item',
            variable_name: 'product',
            value: productTitle || itemId
          }
        ],
        item_type: itemType,
        item_id: itemId,
        user_id: userId,
        payment_reference: reference,
        success_url,
        failure_url,
        metadata: metadata,
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
      amount,
      currency: 'NGN',
      item_type: itemType,
      item_id: itemId,
    });

  } catch (error: any) {
    console.error('Payment initialization error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
