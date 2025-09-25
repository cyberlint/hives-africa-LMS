"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { PaymentsService } from '@/services/payments';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  const verifyPaymentMutation = useMutation({
    mutationFn: (reference: string) => PaymentsService.verifyPayment(reference),
    onSuccess: (data) => {
      setVerificationStatus('success');
      setPaymentDetails(data);
      toast.success('Payment verified successfully!');
    },
    onError: (error: any) => {
      setVerificationStatus('failed');
      toast.error(error?.message || 'Payment verification failed');
    },
  });

  useEffect(() => {
    if (reference) {
      verifyPaymentMutation.mutate(reference);
    } else {
      setVerificationStatus('failed');
    }
  }, [reference]);

  const handleContinue = () => {
    if (verificationStatus === 'success') {
      router.push('/learning');
    } else {
      router.push('/home/checkout');
    }
  };

  const handleGoHome = () => {
    router.push('/home');
  };

  if (verificationStatus === 'pending') {
    return (
      <div className="min-h-screen bg-[#FAFAFB] flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-yellow mx-auto" />
              <h2 className="text-xl font-semibold text-darkBlue-300">
                Verifying Payment
              </h2>
              <p className="text-sm text-[#6E7485]">
                Please wait while we verify your payment...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFB] flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          {verificationStatus === 'success' ? (
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          ) : (
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          )}
          <h1 className="text-2xl font-bold text-darkBlue-300">
            {verificationStatus === 'success' ? 'Payment Successful!' : 'Payment Failed'}
          </h1>
        </CardHeader>
        <CardContent className="space-y-4">
          {verificationStatus === 'success' ? (
            <div className="text-center space-y-4">
              <p className="text-[#6E7485]">
                Your payment has been processed successfully. You now have access to your course.
              </p>
              {paymentDetails?.course_title && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-green-800">
                    Course: {paymentDetails.course_title}
                  </p>
                  {paymentDetails.enrollment_id && (
                    <p className="text-xs text-green-600 mt-1">
                      Enrollment ID: {paymentDetails.enrollment_id}
                    </p>
                  )}
                </div>
              )}
              <div className="space-y-2">
                <Button 
                  onClick={handleContinue}
                  className="w-full bg-yellow hover:bg-yellow/90"
                >
                  Start Learning
                </Button>
                <Button 
                  onClick={handleGoHome}
                  variant="outline"
                  className="w-full"
                >
                  Go to Home
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-[#6E7485]">
                We couldn't verify your payment. Please try again or contact support if the issue persists.
              </p>
              <div className="space-y-2">
                <Button 
                  onClick={handleContinue}
                  className="w-full bg-yellow hover:bg-yellow/90"
                >
                  Try Again
                </Button>
                <Button 
                  onClick={handleGoHome}
                  variant="outline"
                  className="w-full"
                >
                  Go to Home
                </Button>
              </div>
            </div>
          )}
          
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