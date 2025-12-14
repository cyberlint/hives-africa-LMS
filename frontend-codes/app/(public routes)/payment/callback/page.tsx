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
    
    // Use reference or trxref (Paystack sends both)
    const transactionRef = reference || trxref;

    if (transactionRef) {
      // Redirect to unified payment status page for verification
      // The status page will handle verification and display success/failure
      router.replace(`/payment/success?reference=${transactionRef}`);
    } else {
      // No reference found, redirect to status page which will show error
      router.replace('/payment/success');
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFB] dark:from-[#1d2026] to-[#F0F0F2] dark:to-[#2a2f3a] transition-colors duration-300 flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-yellow/10 rounded-full animate-pulse"></div>
          </div>
          <Loader2 className="w-16 h-16 animate-spin text-yellow mx-auto relative z-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-darkBlue-300 dark:text-gray-100">
            Processing Payment
          </h2>
          <p className="text-sm text-[#6E7485] dark:text-gray-400 max-w-sm mx-auto">
            Please wait while we redirect you to verify your payment...
          </p>
        </div>
        <div className="flex items-center justify-center gap-1">
          <div className="w-2 h-2 bg-yellow rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-yellow rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-yellow rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#FAFAFB] dark:bg-[#1d2026] transition-colors duration-300 flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-yellow mx-auto" />
        <h2 className="text-xl font-semibold text-darkBlue-300 dark:text-gray-100">
          Processing Payment
        </h2>
        <p className="text-sm text-[#6E7485] dark:text-gray-400">
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