# Payment Status Flow

This document explains the payment verification flow for Paystack transactions in the LMS.

## Flow Overview

1. **User initiates checkout** (`/checkout`)
   - User reviews cart and clicks "Pay Securely"
   - System calls `/api/payments/initialize` with course details and callback URL
   - Backend creates a pending Payment record and initializes Paystack transaction
   - User is redirected to Paystack payment page

2. **User completes payment on Paystack**
   - User enters payment details on Paystack's secure page
   - Paystack processes the payment
   - Paystack redirects back to our callback URL with transaction reference

3. **Payment callback** (`/payment/callback`)
   - Receives the transaction reference from Paystack
   - Immediately redirects to the payment status page

4. **Payment status page** (`/payment/success`)
   - **Unified page that handles both success and failure**
   - Automatically verifies the transaction with backend
   - Backend calls Paystack API to verify transaction status
   - Backend updates Payment record and creates/updates Enrollment
   - Displays success or failure based on verification result

## Payment Status Page Features

### Success State
- ✅ Green-themed UI with success icon
- 🎉 Congratulations message
- 📚 Course enrollment details
- 🔗 Navigation buttons:
  - "Start Learning Now" → `/learning`
  - "Browse Courses" → `/course`
  - "Go Home" → `/home`
- 🧹 Automatically clears cart and checkout data

### Failure State
- ❌ Red-themed UI with error icon
- 📋 Error message and possible reasons
- 🔁 Navigation buttons:
  - "Try Again" → `/checkout`
  - "Browse Courses" → `/course`
  - "Go Home" → `/home`
  - "Contact Support" → Opens email client

### Pending/Verifying State
- ⏳ Loading spinner with animated dots
- 💬 "Verifying Payment" message
- 🔄 Automatically verifies after 1 second delay

## API Endpoints

### Initialize Payment
**POST** `/api/payments/initialize`

**Request:**
```json
{
  "course_id": "uuid",
  "coupon_code": "OPTIONAL_CODE",
  "redirect_url": "https://yourdomain.com/payment/callback"
}
```

**Response:**
```json
{
  "authorization_url": "https://checkout.paystack.com/...",
  "reference": "TXN-1234567890-ABC123",
  "access_code": "..."
}
```

### Verify Payment
**POST** `/api/payments/verify`

**Request:**
```json
{
  "reference": "TXN-1234567890-ABC123"
}
```

**Response (Success):**
```json
{
  "status": "success",
  "message": "Payment verified successfully",
  "enrollment_id": "uuid",
  "course_title": "Course Name"
}
```

**Response (Failure):**
```json
{
  "error": "Payment verification failed or payment was not successful"
}
```

## Database Updates

When a payment is verified successfully:

1. **Payment Record** is updated:
   - Status: `Pending` → `Completed`
   - Payment method and metadata are stored

2. **Enrollment Record** is created/updated:
   - Links user to course
   - Stores payment reference and amount
   - Sets payment status to `Completed`
   - Records payment timestamp

## Environment Variables Required

```env
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
PAYSTACK_SECRET_KEY=sk_test_...
```

## User Experience Notes

- The payment status page provides a **unified experience** for both success and failure
- Users don't need to worry about different pages - everything is handled in one place
- The page automatically verifies the transaction, so users just wait briefly
- Clear navigation options are provided regardless of payment outcome
- Transaction reference is always displayed for support purposes

## Future Enhancements

1. **Webhook Integration**: Implement Paystack webhooks for real-time payment notifications
2. **Multi-course Payments**: Support paying for multiple courses in one transaction
3. **Payment History**: Add a page where users can view their payment history
4. **Refund Support**: Implement refund functionality for failed enrollments
