import apiClient, { ApiResponse } from "@/lib/api-client";

export interface CouponValidationResult {
  valid: boolean;
  discount_amount: number;
  coupon: {
    id: string;
    code: string;
    description?: string;
    discount_type: "percentage" | "fixed" | string;
    discount_value: number;
    minimum_amount: number;
  };
}

export interface InitializePaymentPayload {
  course_id: string; // UUID
  coupon_code?: string;
}

export interface InitializePaymentResponse {
  status: "success";
  transaction_id: string;
  authorization_url: string;
  access_code: string;
  reference: string;
  amount: number;
  currency: string;
}

export interface VerifyPaymentResponse {
  status: "success";
  message: string;
  enrollment_id?: string;
  course_title?: string;
}

export interface WalletResponse {
  id: string;
  balance: number;
  is_active: boolean;
}

export interface PaymentMethod {
  id: string;
  card_type?: string;
  last4?: string;
  exp_month?: string;
  exp_year?: string;
  bank?: string;
  is_default?: boolean;
}

export const PaymentsService = {
  async validateCoupon(code: string, courseId?: string): Promise<CouponValidationResult> {
    return await apiClient.post<CouponValidationResult>(
      "/api/payments/coupons/validate/",
      { code, course_id: courseId }
    );
  },

  async initializePayment(payload: InitializePaymentPayload): Promise<InitializePaymentResponse> {
    // Use Next.js API route which forwards to backend
    const response = await fetch('/api/payments/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Payment initialization failed');
    }

    return await response.json();
  },

  async verifyPayment(reference: string): Promise<VerifyPaymentResponse> {
    // Use Next.js API route which forwards to backend
    const response = await fetch('/api/payments/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: JSON.stringify({ reference }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Payment verification failed');
    }

    return await response.json();
  },

  async getWallet(): Promise<WalletResponse> {
    return await apiClient.get<WalletResponse>("/api/payments/wallet/");
  },

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return await apiClient.get<PaymentMethod[]>("/api/payments/methods/");
  },
};

export default PaymentsService;
