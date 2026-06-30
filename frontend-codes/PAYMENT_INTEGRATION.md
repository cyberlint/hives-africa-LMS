# Paystack Payment Integration

This document outlines the Paystack payment integration implementation for the course checkout system.

## Overview

The payment flow consists of:
1. Payment initialization from checkout page
2. Redirect to Paystack checkout
3. Payment processing by Paystack
4. Callback handling and verification
5. Success/failure page display

## Environment Variables

Add these to your `.env` file:

```env
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key_here
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key_here
```

## File Structure

```
app/
├── api/
│   ├── payments/
│   │   ├── initialize/route.ts    # Payment initialization
│   │   └── verify/route.ts        # Payment verification
│   └── webhooks/
│       └── paystack/route.ts      # Webhook handler
├── (public routes)/
│   └── payment/
│       ├── callback/page.tsx      # Paystack redirect handler
│       ├── success/page.tsx       # Success page with verification
│       └── failure/page.tsx       # Failure page
hooks/
├── usePayments.ts                 # React Query hooks
lib/
├── paystack.ts                    # Paystack utilities
services/
├── payments.ts                    # Payment service (updated)
types/
├── payment.ts                     # Payment type definitions
```

## Payment Flow

### 1. Checkout Page (`/checkout`)
- User reviews cart items
- Applies coupon codes (optional)
- Clicks "Pay Securely" button
- Triggers payment initialization

### 2. Payment Initialization
- Calls `/api/payments/initialize` endpoint
- Forwards request to backend API
- Returns Paystack authorization URL
- Redirects user to Paystack checkout

### 3. Paystack Processing
- User completes payment on Paystack
- Paystack redirects to `/payment/callback`
- Callback page processes URL parameters
- Redirects to success or failure page

### 4. Payment Verification
- Success page calls `/api/payments/verify`
- Backend verifies payment with Paystack
- Updates transaction status
- Shows enrollment confirmation

## API Endpoints

### POST /api/payments/initialize
Initializes a payment session with Paystack.

**Request:**
```json
// Legacy (course)
{
  "course_id": "uuid-string",
  "coupon_code": "OPTIONAL_COUPON"
}

// Generic (recommended)
{
  "item_id": "uuid-or-sku",
  "item_type": "course|bootcamp|program",
  "amount": 50000, // integer (kobo or minor units depending on your conventions)
  "coupon_code": "OPTIONAL_COUPON",
  "redirect_url": "https://your-app.com/payment/callback",
  "success_url": "https://your-app.com/bootcamp/onboarding",
  "failure_url": "https://your-app.com/payment/failure",
  "metadata": { "some": "value" }
}
```

**Response:**
```json
{
  "authorization_url": "https://checkout.paystack.com/...",
  "reference": "TXN-2024...",
  "access_code": "XXXX",
  "amount": 50000,
  "currency": "NGN",
  "item_type": "course",
  "item_id": "uuid-or-sku"
}
```

### POST /api/payments/verify
Verifies a payment transaction.

**Request:**
```json
{
  "reference": "TXN-2024..."
}
```

**Response:**
```json
// Course purchases (legacy)
{
  "status": "success",
  "message": "Payment verified successfully",
  "enrollment_id": "uuid",
  "course_title": "Course Name",
  "course_id": "uuid"
}

// Generic non-course purchases (bootcamp/program)
{
  "status": "success",
  "message": "Payment verified successfully",
  "purchase_type": "bootcamp",
  "item_id": "bootcamp-123",
  "next_route": "/bootcamp/onboarding",
  "metadata": { /* paystack transaction object */ }
}
```

## React Query Hooks

### useInitializePayment()
```typescript
const initializePayment = useInitializePayment();

const handlePayment = async () => {
  try {
    // Generic initialization example
    const result = await initializePayment.mutateAsync({
      item_id: "bootcamp-123",
      item_type: "bootcamp",
      amount: 2500000,
      coupon_code: "EARLYBIRD",
      redirect_url: window.location.origin + '/payment/callback',
      success_url: window.location.origin + '/bootcamp/onboarding'
    });
    window.location.href = result.authorization_url;
  } catch (error) {
    console.error('Payment initialization failed:', error);
  }
};
```

### useVerifyPayment()
```typescript
const verifyPayment = useVerifyPayment();

const handleVerification = async (reference: string) => {
  try {
    const result = await verifyPayment.mutateAsync(reference);
    console.log('Payment verified:', result);
  } catch (error) {
    console.error('Verification failed:', error);
  }
};
```

## Error Handling

The integration includes comprehensive error handling:

- Network errors during initialization
- Invalid payment references
- Failed payment verification
- Webhook signature validation
- Backend API errors

## Security Features

1. **Webhook Signature Verification**: All webhook requests are verified using HMAC-SHA512
2. **Environment Variables**: Sensitive keys stored in environment variables
3. **HTTPS Only**: All payment URLs use HTTPS
4. **Token-based Auth**: API requests include authentication tokens

## Testing

### Test Cards (Paystack)
```
Successful Payment: 4084084084084081
Insufficient Funds: 4084084084084081 (amount > 2500000)
Invalid Card: 4084084084084082
```

### Test Flow
1. Add items to cart
2. Go to checkout
3. Use test card details
4. Verify success/failure pages
5. Check transaction in Paystack dashboard

## Production Checklist

- [ ] Replace test keys with live keys
- [ ] Configure webhook URL in Paystack dashboard
- [ ] Set up proper error monitoring
- [ ] Test with real bank cards
- [ ] Verify SSL certificates
- [ ] Set up transaction monitoring

## Webhook Configuration

In your Paystack dashboard:
1. Go to Settings > Webhooks
2. Add webhook URL: `https://yourdomain.com/api/webhooks/paystack`
3. Select events: `charge.success`, `charge.failed`
4. Save configuration

## Support

For issues with the payment integration:
1. Check Paystack dashboard for transaction details
2. Review server logs for API errors
3. Verify webhook delivery in Paystack dashboard
4. Contact Paystack support for payment-specific issues