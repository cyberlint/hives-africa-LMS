"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { PaymentsService } from '@/services/payments';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CheckCircle, Loader2, XCircle, AlertCircle, Home, BookOpen, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { constructUrl } from '@/lib/construct-url';

// Force dynamic rendering to prevent prerender errors
export const dynamic = 'force-dynamic';

function PaymentStatusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const reference = searchParams.get('reference');
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const verifyPaymentMutation = useMutation({
    mutationFn: (reference: string) => PaymentsService.verifyPayment(reference),
    onSuccess: (data) => {
      setVerificationStatus('success');
      setPaymentDetails(data);
      // Clear cart on successful payment
      clearCart();
      // Clear stored checkout data
      localStorage.removeItem('checkout_cart');
      localStorage.removeItem('checkout_coupon');
      toast.success('Payment verified successfully!');
    },
    onError: (error: any) => {
      setVerificationStatus('failed');
      setErrorMessage(error?.message || 'Payment verification failed');
      toast.error(error?.message || 'Payment verification failed');
    },
  });

  useEffect(() => {
    if (reference) {
      // Add a small delay to ensure Paystack has processed the transaction
      const timer = setTimeout(() => {
        verifyPaymentMutation.mutate(reference);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      setVerificationStatus('failed');
      setErrorMessage('No transaction reference found');
    }
  }, [reference]);

  const handleStartLearning = () => {
    router.push('/dashboard/learning');
  };

  const handleGoHome = () => {
    router.push('/dashboard');
  };

  const handleRetry = () => {
    router.push('/checkout');
  };

  const handleBrowseCourses = () => {
    router.push('/course');
  };

  // Pending/Verifying State
  if (verificationStatus === 'pending') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAFAFB] dark:from-[#1d2026] to-[#F0F0F2] dark:to-[#2a2f3a] transition-colors duration-300 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-gray-200 dark:border-[#404854] dark:bg-[#2a2f3a] shadow-lg">
          <CardContent className="pt-12 pb-8">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-yellow/10 rounded-full animate-pulse"></div>
                </div>
                <Loader2 className="w-16 h-16 animate-spin text-yellow mx-auto relative z-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-darkBlue-300 dark:text-gray-100">
                  Verifying Payment
                </h2>
                <p className="text-sm text-[#6E7485] dark:text-gray-400">
                  Please wait while we confirm your transaction with Paystack...
                </p>
              </div>
              <div className="flex items-center justify-center gap-1">
                <div className="w-2 h-2 bg-yellow rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-yellow rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-yellow rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success State
  if (verificationStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 dark:from-[#1d2026] via-[#FAFAFB] dark:via-[#2a2f3a] to-yellow-50 dark:to-[#1d2026] transition-colors duration-300 flex items-center justify-center p-4 lg:p-8">
        <Card className="w-full max-w-md lg:max-w-3xl border-green-200 dark:border-[#404854] dark:bg-[#2a2f3a] shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full animate-ping opacity-20"></div>
              </div>
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto relative z-10 drop-shadow-lg" strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl font-bold text-darkBlue-300 dark:text-gray-100 mb-2">
              Payment Successful! 🎉
            </h1>
            <p className="text-sm text-[#6E7485] dark:text-gray-400">
              Your enrollment has been confirmed
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-[#6E7485] dark:text-gray-400 leading-relaxed">
                Congratulations! Your payment has been processed successfully. You now have full access to your course content.
              </p>
              
              {paymentDetails?.course_title && (
                <div className="bg-white dark:bg-[#1d2026] border border-green-200 dark:border-[#404854] rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center md:items-start text-left">
                  {paymentDetails.thumbnail ? (
                    <div className="relative w-full md:w-32 h-32 md:h-24 rounded-lg overflow-hidden flex-shrink-0">
                       {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={constructUrl(paymentDetails.thumbnail)} 
                        alt={paymentDetails.course_title} 
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                  )}
                  
                  <div className="flex-1 space-y-1">
                    <p className="text-xs uppercase tracking-wide text-green-600 dark:text-green-400 font-medium">
                      Enrolled Course
                    </p>
                    <h3 className="font-bold text-darkBlue-300 dark:text-gray-100 text-lg line-clamp-2">
                      {paymentDetails.course_title}
                    </h3>
                    
                    {paymentDetails.instructor && (
                      <p className="text-sm text-[#6E7485] dark:text-gray-400">
                        Instructor: <span className="font-medium text-darkBlue-300 dark:text-gray-100">{paymentDetails.instructor}</span>
                      </p>
                    )}
                    
                    {paymentDetails.enrollment_id && (
                       <p className="text-xs text-gray-400 dark:text-gray-500 font-mono mt-2">
                        ID: {paymentDetails.enrollment_id.slice(0, 8)}...
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-3 pt-2">
                <Button
                  onClick={handleStartLearning}
                  className="w-full h-12 bg-yellow hover:bg-yellow/90 text-white font-semibold text-base shadow-md hover:shadow-lg transition-all"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Start Learning Now
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleBrowseCourses}
                    variant="outline"
                    className="h-11 border-gray-300 dark:border-[#404854] dark:bg-[#1d2026] dark:text-gray-100 dark:hover:bg-[#2a2f3a] hover:bg-gray-50"
                  >
                    Browse Courses
                  </Button>
                  <Button
                    onClick={handleGoHome}
                    variant="outline"
                    className="h-11 border-gray-300 dark:border-[#404854] dark:bg-[#1d2026] dark:text-gray-100 dark:hover:bg-[#2a2f3a] hover:bg-gray-50"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Button>
                </div>
              </div>
            </div>

            {reference && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-[#6E7485] text-center font-mono">
                  Transaction Ref: {reference}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Failure State
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-[#FAFAFB] to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-red-200 shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-red-100 rounded-full animate-pulse opacity-30"></div>
            </div>
            <XCircle className="w-20 h-20 text-red-500 mx-auto relative z-10 drop-shadow-lg" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-bold text-darkBlue-300 mb-2">
            Payment Failed
          </h1>
          <p className="text-sm text-[#6E7485]">
            We couldn&apos;t process your payment
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-xl p-5 space-y-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div className="text-left flex-1">
                  <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-2">
                    {errorMessage || 'Payment verification failed'}
                  </p>
                  <p className="text-xs text-red-700 dark:text-red-400 mb-3">
                    This could be due to:
                  </p>
                  <ul className="text-xs text-red-700 dark:text-red-400 space-y-1.5 list-none">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-400 dark:bg-red-600 rounded-full"></span>
                      Insufficient funds in your account
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-400 dark:bg-red-600 rounded-full"></span>
                      Card declined by your bank
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-400 dark:bg-red-600 rounded-full"></span>
                      Network connectivity issues
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-400 dark:bg-red-600 rounded-full"></span>
                      Transaction was cancelled
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Button
                onClick={handleRetry}
                className="w-full h-12 bg-yellow hover:bg-yellow/90 text-white font-semibold text-base shadow-md hover:shadow-lg transition-all"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Try Again
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleBrowseCourses}
                  variant="outline"
                  className="h-11 border-gray-300 dark:border-[#404854] dark:bg-[#1d2026] dark:text-gray-100 dark:hover:bg-[#2a2f3a] hover:bg-gray-50"
                >
                  Browse Courses
                </Button>
                <Button
                  onClick={handleGoHome}
                  variant="outline"
                  className="h-11 border-gray-300 dark:border-[#404854] dark:bg-[#1d2026] dark:text-gray-100 dark:hover:bg-[#2a2f3a] hover:bg-gray-50"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </div>
              <Button
                onClick={() => window.open('mailto:support@hivesafrica.com?subject=Payment Issue&body=Reference: ' + reference, '_blank')}
                variant="ghost"
                className="w-full text-sm text-[#6E7485] dark:text-gray-400 hover:text-darkBlue-300 dark:hover:text-gray-100"
              >
                Contact Support
              </Button>
            </div>
          </div>

          {reference && (
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-[#404854]">
              <p className="text-xs text-[#6E7485] dark:text-gray-400 text-center font-mono">
                Transaction Ref: {reference}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#FAFAFB] dark:bg-[#1d2026] transition-colors duration-300 flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-yellow mx-auto" />
        <h2 className="text-xl font-semibold text-darkBlue-300 dark:text-gray-100">
          Loading...
        </h2>
      </div>
    </div>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentStatusContent />
    </Suspense>
  );
}