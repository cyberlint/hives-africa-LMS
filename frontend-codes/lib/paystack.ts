// Paystack configuration and utilities

export const PAYSTACK_CONFIG = {
  publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
  baseUrl: 'https://api.paystack.co',
  checkoutUrl: 'https://checkout.paystack.com',
};

export interface PaystackCallbackParams {
  reference: string;
  trxref: string;
  status: 'success' | 'cancelled' | 'failed';
}

export interface PaystackInitializeData {
  email: string;
  amount: number; // in kobo (smallest currency unit)
  currency?: string;
  reference?: string;
  callback_url?: string;
  metadata?: Record<string, any>;
  channels?: string[];
  split_code?: string;
  subaccount?: string;
  transaction_charge?: number;
  bearer?: 'account' | 'subaccount';
}

export const formatAmountForPaystack = (amount: number): number => {
  // Convert from Naira to Kobo (multiply by 100)
  return Math.round(amount * 100);
};

export const formatAmountFromPaystack = (amount: number): number => {
  // Convert from Kobo to Naira (divide by 100)
  return amount / 100;
};

export const generatePaymentReference = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `TXN-${timestamp}-${random}`.toUpperCase();
};

export const getCallbackUrl = (baseUrl: string): string => {
  return `${baseUrl}/payment/callback`;
};

export const getSuccessUrl = (baseUrl: string, reference: string): string => {
  return `${baseUrl}/payment/success?reference=${reference}`;
};

export const getFailureUrl = (baseUrl: string, reference: string, message?: string): string => {
  const params = new URLSearchParams({ reference });
  if (message) params.append('message', message);
  return `${baseUrl}/payment/failure?${params.toString()}`;
};