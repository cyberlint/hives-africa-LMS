# Testing the Payment Status Page

## 🧪 How to Test the Payment Flow

### Prerequisites
1. Ensure your dev server is running: `npm run dev`
2. Have Paystack test keys configured in `.env`
3. Be logged in to the application

### Test Scenario 1: Successful Payment

1. **Navigate to Course Listing**
   - Go to `/course`
   - Select a paid course
   - Click "Add to Cart" or "Enroll Now"

2. **Proceed to Checkout**
   - Go to `/checkout`
   - Review your cart
   - Click "Pay Securely"

3. **Complete Payment on Paystack**
   - You'll be redirected to Paystack's test payment page
   - Use Paystack test card: `4084084084084081`
   - CVV: Any 3 digits
   - Expiry: Any future date
   - PIN: `0000`
   - OTP: `123456`

4. **Verify Success Flow**
   - After payment, you should be redirected to `/payment/callback`
   - Then automatically to `/payment/success?reference=TXN-...`
   - You should see:
     - ✅ Green checkmark icon with animation
     - "Payment Successful! 🎉" heading
     - Your course details in a card
     - "Start Learning Now" button
     - Transaction reference at bottom
   - Your cart should be cleared
   - Click "Start Learning Now" to go to `/learning`

### Test Scenario 2: Failed Payment

1. **Navigate to Checkout**
   - Add a course to cart
   - Go to `/checkout`
   - Click "Pay Securely"

2. **Cancel Payment on Paystack**
   - On Paystack's payment page, click "Cancel" or close the window
   - OR use a test card that will fail

3. **Verify Failure Flow**
   - You should be redirected to `/payment/success?reference=TXN-...`
   - The verification will fail
   - You should see:
     - ❌ Red X icon with animation
     - "Payment Failed" heading
     - Error message with possible reasons
     - "Try Again" button
     - Transaction reference at bottom
   - Click "Try Again" to return to `/checkout`

### Test Scenario 3: Direct URL Access

1. **Test with Valid Reference**
   - Get a valid transaction reference from a previous payment
   - Navigate directly to: `/payment/success?reference=TXN-...`
   - Should verify and show appropriate status

2. **Test without Reference**
   - Navigate to: `/payment/success`
   - Should show failure state with "No transaction reference found"

### Test Scenario 4: Mobile Responsiveness

1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test on different screen sizes:
   - iPhone SE (375px)
   - iPad (768px)
   - Desktop (1920px)
4. Verify:
   - Card is properly centered
   - Buttons stack correctly on mobile
   - Text is readable
   - Icons are properly sized

## 🔍 What to Look For

### Success Page Checklist
- [ ] Green gradient background
- [ ] Animated checkmark icon
- [ ] Course title displays correctly
- [ ] Enrollment ID shows (if available)
- [ ] All buttons are clickable
- [ ] Cart is cleared after success
- [ ] Transaction reference is displayed
- [ ] Navigation works correctly

### Failure Page Checklist
- [ ] Red gradient background
- [ ] Animated X icon
- [ ] Error message is clear
- [ ] Helpful tips are displayed
- [ ] All buttons are clickable
- [ ] Transaction reference is displayed
- [ ] Navigation works correctly

### Loading State Checklist
- [ ] Spinner animation works
- [ ] Bouncing dots animate
- [ ] Text is centered
- [ ] Background gradient shows

## 🐛 Common Issues & Solutions

### Issue: "No transaction reference found"
**Solution**: Ensure Paystack is redirecting with the reference parameter

### Issue: Verification takes too long
**Solution**: Check your internet connection and Paystack API status

### Issue: Cart not clearing after success
**Solution**: Check browser console for errors, ensure CartContext is working

### Issue: Buttons not working
**Solution**: Check browser console for navigation errors

## 📊 Testing Checklist

- [ ] Successful payment flow works end-to-end
- [ ] Failed payment shows appropriate error
- [ ] Cancelled payment redirects correctly
- [ ] Cart clears on successful payment
- [ ] All navigation buttons work
- [ ] Mobile responsive design works
- [ ] Loading states display correctly
- [ ] Error messages are helpful
- [ ] Transaction references display
- [ ] Support email link works

## 🎯 Expected Behavior

### On Success:
1. User sees loading state (1-2 seconds)
2. Page verifies transaction with backend
3. Success state displays with course details
4. Cart is automatically cleared
5. User can navigate to learning dashboard

### On Failure:
1. User sees loading state (1-2 seconds)
2. Page attempts verification with backend
3. Failure state displays with error details
4. User can retry or contact support
5. Cart remains intact for retry

## 📝 Notes

- The 1-second delay before verification ensures Paystack has processed the transaction
- The page handles both `reference` and `trxref` parameters from Paystack
- All states are fully responsive and work on mobile devices
- Transaction references are always displayed for support purposes
- The page automatically clears stored checkout data on success
