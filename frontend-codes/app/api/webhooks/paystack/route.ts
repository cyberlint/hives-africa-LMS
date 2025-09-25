import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-paystack-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    // Verify the webhook signature
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      console.error('PAYSTACK_SECRET_KEY not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    const hash = crypto
      .createHmac('sha512', secret)
      .update(body)
      .digest('hex');

    if (hash !== signature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);

    // Handle different webhook events
    switch (event.event) {
      case 'charge.success':
        await handleSuccessfulPayment(event.data);
        break;
      case 'charge.failed':
        await handleFailedPayment(event.data);
        break;
      case 'transfer.success':
        // Handle successful transfers if needed
        break;
      case 'transfer.failed':
        // Handle failed transfers if needed
        break;
      default:
        console.log(`Unhandled webhook event: ${event.event}`);
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleSuccessfulPayment(data: any) {
  try {
    // Forward to your backend API to update transaction status
    const backendUrl = `${process.env.NEXT_CORE_API_URL}/payments/webhook/paystack/`;
    
    await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Source': 'paystack',
      },
      body: JSON.stringify({
        event: 'charge.success',
        data,
      }),
    });

    console.log(`Payment successful for reference: ${data.reference}`);
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
}

async function handleFailedPayment(data: any) {
  try {
    // Forward to your backend API to update transaction status
    const backendUrl = `${process.env.NEXT_CORE_API_URL}/payments/webhook/paystack/`;
    
    await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Source': 'paystack',
      },
      body: JSON.stringify({
        event: 'charge.failed',
        data,
      }),
    });

    console.log(`Payment failed for reference: ${data.reference}`);
  } catch (error) {
    console.error('Error handling failed payment:', error);
  }
}