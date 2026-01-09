import "server-only";

import axios from 'axios';

// Paystack configuration and utilities

export const PAYSTACK_CONFIG = {
  publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
  secretKey: process.env.PAYSTACK_SECRET_KEY || '',
  baseUrl: 'https://api.paystack.co',
};

export interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    status: string;
    reference: string;
    amount: number;
    gateway_response: string;
    channel: string;
    currency: string;
    metadata: any;
    paid_at: string;
    receipt_url?: string;
    // Add other fields as needed
  };
}

export const Paystack = {
  // Initialize a transaction
  async initializeTransaction(
    email: string,
    amount: number, // in kobo
    callbackUrl?: string,
    metadata?: any,
    channels?: string[]
  ): Promise<PaystackInitializeResponse> {
    try {
      const response = await axios.post(
        `${PAYSTACK_CONFIG.baseUrl}/transaction/initialize`,
        {
          email,
          amount,
          callback_url: callbackUrl,
          metadata,
          channels,
        },
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_CONFIG.secretKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Paystack initialization error:', error.response?.data || error);
      throw new Error(error.response?.data?.message || 'Paystack initialization failed');
    }
  },

  // Verify a transaction
  async verifyTransaction(reference: string): Promise<PaystackVerifyResponse> {
    try {
      const response = await axios.get(
        `${PAYSTACK_CONFIG.baseUrl}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_CONFIG.secretKey}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Paystack verification error:', error.response?.data || error);
      throw new Error(error.response?.data?.message || 'Paystack verification failed');
    }
  },
};

export const generatePaymentReference = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `TXN-${timestamp}-${random}`.toUpperCase();
};

// Helper to convert Amount to Kobo
export const formatAmountForPaystack = (amount: number): number => {
  return Math.round(amount * 100);
};

// Helper to convert Kobo to Amount
export const formatAmountFromPaystack = (amount: number): number => {
  return amount / 100;
};