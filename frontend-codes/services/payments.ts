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
    return await apiClient.post<InitializePaymentResponse>(
      "/api/payments/initialize/",
      payload
    );
  },

  async verifyPayment(reference: string): Promise<VerifyPaymentResponse> {
    return await apiClient.post<VerifyPaymentResponse>(
      "/api/payments/verify/",
      { reference }
    );
  },

  async getWallet(): Promise<WalletResponse> {
    return await apiClient.get<WalletResponse>("/api/payments/wallet/");
  },

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return await apiClient.get<PaymentMethod[]>("/api/payments/methods/");
  },
};

export default PaymentsService;
