import { useMutation, useQuery } from '@tanstack/react-query';
import { PaymentsService } from '@/services/payments';
import { toast } from 'sonner';

export const useInitializePayment = () => {
  return useMutation({
    mutationFn: PaymentsService.initializePayment,
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to initialize payment');
    },
  });
};

export const useVerifyPayment = () => {
  return useMutation({
    mutationFn: (reference: string) => PaymentsService.verifyPayment(reference),
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to verify payment');
    },
  });
};

export const useValidateCoupon = () => {
  return useMutation({
    mutationFn: ({ code, courseId }: { code: string; courseId?: string }) => 
      PaymentsService.validateCoupon(code, courseId),
    onError: (error: any) => {
      toast.error(error?.message || 'Invalid coupon code');
    },
  });
};

export const useWallet = () => {
  return useQuery({
    queryKey: ['wallet'],
    queryFn: PaymentsService.getWallet,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePaymentMethods = () => {
  return useQuery({
    queryKey: ['payment-methods'],
    queryFn: PaymentsService.getPaymentMethods,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};