import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

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

    // Forward the request to your backend API
    const backendUrl = `${process.env.NEXT_CORE_API_URL}/payments/verify/`;
    
    console.log('Attempting to call backend URL:', backendUrl);
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
      },
      body: JSON.stringify({
        reference,
      }),
    });

    console.log('Backend response status:', response.status);

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text();
      console.error('Backend returned non-JSON response:', textResponse.substring(0, 500));
      return NextResponse.json(
        { error: 'Backend API returned invalid response format' },
        { status: 502 }
      );
    }

    const data = await response.json();

    if (!response.ok) {
      console.error('Backend API error:', data);
      return NextResponse.json(
        { error: data.message || data.error || 'Payment verification failed' },
        { status: response.status }
      );
    }

    // If payment is successful, create enrollment
    if (data.status === 'success' && data.transaction) {
      const courseId = data.transaction.metadata?.course_id;
      
      if (courseId) {
        // Check if enrollment already exists
        const existingEnrollment = await prisma.enrollment.findUnique({
          where: {
            userId_courseId: {
              userId,
              courseId,
            },
          },
        });

        if (!existingEnrollment) {
          // Create new enrollment
          await prisma.enrollment.create({
            data: {
              userId,
              courseId,
              paymentReference: reference,
              paymentStatus: 'Completed',
              paymentAmount: data.transaction.amount / 100, // Convert from kobo to naira
              paidAt: new Date(data.transaction.paid_at),
            },
          });
        } else if (existingEnrollment.paymentStatus !== 'Completed') {
          // Update existing enrollment
          await prisma.enrollment.update({
            where: { id: existingEnrollment.id },
            data: {
              paymentReference: reference,
              paymentStatus: 'Completed',
              paymentAmount: data.transaction.amount / 100,
              paidAt: new Date(data.transaction.paid_at),
            },
          });
        }
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}