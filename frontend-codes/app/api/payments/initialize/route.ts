import { NextRequest, NextResponse } from 'next/server';

interface PaymentRequestBody {
  course_id: string;
  coupon_code?: string;
}

interface BackendResponse {
  message?: string;
  [key: string]: unknown;
}

const BACKEND_BASE_URL = process.env.NEXT_CORE_API_URL;

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await parseRequestBody(request);
    
    validateRequestBody(body);
    
    const backendResponse = await forwardToBackend(body);
    
    return NextResponse.json(backendResponse);
  } catch (error) {
    return handleError(error);
  }
}

async function parseRequestBody(request: NextRequest): Promise<PaymentRequestBody> {
  try {
    return await request.json();
  } catch {
    throw new Error('Invalid JSON in request body');
  }
}

function validateRequestBody(body: PaymentRequestBody): void {
  if (!body.course_id) {
    throw new ValidationError('Course ID is required');
  }
}

async function forwardToBackend(body: PaymentRequestBody): Promise<BackendResponse> {
  if (!BACKEND_BASE_URL) {
    throw new Error('Backend URL not configured');
  }

  const backendUrl = `${BACKEND_BASE_URL}/payments/initialize/`;
  
  const response = await fetch(backendUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      course_id: body.course_id,
      coupon_code: body.coupon_code,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new BackendError(
      data.message || 'Payment initialization failed',
      response.status
    );
  }

  return data;
}

function handleError(error: unknown): NextResponse {
  console.error('Payment initialization error:', error);
  
  if (error instanceof ValidationError) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
  
  if (error instanceof BackendError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }
  
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class BackendError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = 'BackendError';
  }
}