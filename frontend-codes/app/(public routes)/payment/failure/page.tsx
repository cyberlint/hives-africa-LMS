"use client";

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { XCircle, RefreshCw, Loader2 } from 'lucide-react';

// Force dynamic rendering to prevent prerender errors
export const dynamic = 'force-dynamic';

// ... imports
import { PaymentsService } from '@/services/payments'; // Import service
import { useQuery } from '@tanstack/react-query'; // Import useQuery

// ...

function PaymentFailureContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');
  const message = searchParams.get('message') || 'Payment was not completed successfully.';

  // Attempt to fetch details about the failed transaction to show context
  const { data: paymentInfo } = useQuery({
    queryKey: ['failed-payment', reference],
    queryFn: () => PaymentsService.verifyPayment(reference!),
    enabled: !!reference,
    retry: false,
    // Expecting this to potentially fail or return failed status, we just want metadata if possible
    // Note: The verify endpoint currently throws on non-200. We might need to handle that or adjust service.
    // For now, let's just make the UI nicer without fetched data if it fails hard.
  });
  
  // Actually, standard VerifyPayment throws if not success. 
  // Let's just enhance the layout first. 

  const handleRetry = () => {
    router.push('/checkout');
  };

  const handleGoHome = () => {
    router.push('/home');
  };

  const handleContactSupport = () => {
    window.open('mailto:support@hivesafrica.com?subject=Payment Issue&body=Reference: ' + reference, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-red-100 shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-darkBlue-300">
            Payment Failed
          </h1>
          <p className="text-sm text-[#6E7485] mt-1">
            We couldn't process your transaction
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
           
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-left">
              <div className="flex gap-3">
                 <div className="mt-0.5">
                    <XCircle className="w-4 h-4 text-red-600" />
                 </div>
                 <div>
                    <h4 className="text-sm font-semibold text-red-900 mb-1">Transaction Error</h4>
                    <p className="text-xs text-red-700 leading-relaxed">
                      {message}
                    </p>
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-left text-[#6E7485] bg-gray-50 p-4 rounded-lg">
               <div>
                  <span className="block font-medium text-darkBlue-300 mb-1">Possible Reasons:</span>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Insufficient funds</li>
                    <li>Bank decline</li>
                  </ul>
               </div>
               <div>
                  <span className="block font-medium text-darkBlue-300 mb-1">&nbsp;</span>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Network timeout</li>
                    <li>Cancelled by user</li>
                  </ul>
               </div>
            </div>

            <div className="space-y-3 pt-2">
              <Button 
                onClick={handleRetry}
                className="w-full h-11 bg-yellow hover:bg-yellow/90 font-semibold shadow-sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <div className="grid grid-cols-2 gap-3">
                 <Button 
                  onClick={handleGoHome}
                  variant="outline"
                  className="w-full h-10 text-xs"
                >
                  Return Home
                </Button>
                <Button 
                  onClick={handleContactSupport}
                  variant="outline"
                  className="w-full h-10 text-xs"
                >
                  Help Center
                </Button>
              </div>
            </div>
          </div>
          
          {reference && (
            <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-[#6E7485]">
              <span>Transaction Ref:</span>
              <span className="font-mono bg-gray-100 px-2 py-1 rounded select-all">{reference}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#FAFAFB] flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-yellow mx-auto" />
        <h2 className="text-xl font-semibold text-darkBlue-300">
          Loading...
        </h2>
      </div>
    </div>
  );
}

export default function PaymentFailurePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentFailureContent />
    </Suspense>
  );
}