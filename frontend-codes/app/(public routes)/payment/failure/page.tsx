"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { XCircle, RefreshCw } from 'lucide-react';

export default function PaymentFailurePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');
  const message = searchParams.get('message') || 'Payment was not completed successfully.';

  const handleRetry = () => {
    router.push('/home/checkout');
  };

  const handleGoHome = () => {
    router.push('/home');
  };

  const handleContactSupport = () => {
    // You can implement your support contact logic here
    // For now, we'll just show a toast or redirect to a support page
    window.open('mailto:support@yourcompany.com?subject=Payment Issue&body=Reference: ' + reference, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-darkBlue-300">
            Payment Failed
          </h1>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <p className="text-[#6E7485]">
              {message}
            </p>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                Your payment could not be processed. This could be due to:
              </p>
              <ul className="text-xs text-red-700 mt-2 space-y-1 list-disc list-inside">
                <li>Insufficient funds</li>
                <li>Card declined by bank</li>
                <li>Network connectivity issues</li>
                <li>Payment was cancelled</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Button 
                onClick={handleRetry}
                className="w-full bg-yellow hover:bg-yellow/90"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button 
                onClick={handleGoHome}
                variant="outline"
                className="w-full"
              >
                Go to Home
              </Button>
              <Button 
                onClick={handleContactSupport}
                variant="ghost"
                className="w-full text-sm"
              >
                Contact Support
              </Button>
            </div>
          </div>
          
          {reference && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-[#6E7485] text-center">
                Reference: {reference}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}