"use client";

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// Force dynamic rendering to prevent prerender errors
export const dynamic = 'force-dynamic';

function PaymentCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const reference = searchParams.get('reference');
    const trxref = searchParams.get('trxref'); // Paystack also sends trxref
    const status = searchParams.get('status');

    // Use reference or trxref (Paystack sends both)
    const transactionRef = reference || trxref;

    if (transactionRef) {
      if (status === 'success' || status === 'successful') {
        // Redirect to success page for verification
        router.replace(`/payment/success?reference=${transactionRef}`);
      } else if (status === 'cancelled' || status === 'failed') {
        // Redirect to failure page
        router.replace(`/payment/failure?reference=${transactionRef}&message=Payment was ${status}`);
      } else {
        // Unknown status, still try to verify
        router.replace(`/payment/success?reference=${transactionRef}`);
      }
    } else {
      // No reference found, redirect to failure
      router.replace('/payment/failure?message=No transaction reference found');
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#FAFAFB] flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-yellow mx-auto" />
        <h2 className="text-xl font-semibold text-darkBlue-300">
          Processing Payment
        </h2>
        <p className="text-sm text-[#6E7485]">
          Please wait while we process your payment...
        </p>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#FAFAFB] flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-yellow mx-auto" />
        <h2 className="text-xl font-semibold text-darkBlue-300">
          Processing Payment
        </h2>
        <p className="text-sm text-[#6E7485]">
          Please wait while we process your payment...
        </p>
      </div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentCallbackContent />
    </Suspense>
  );
}