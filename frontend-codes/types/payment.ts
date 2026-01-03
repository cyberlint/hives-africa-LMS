import "server-only";

export interface PaymentTransaction {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  gateway: 'paystack';
  gateway_response?: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
  course_id: string;
  user_id: string;
  metadata?: Record<string, any>;
}

export interface PaymentInitializationRequest {
  course_id: string;
  coupon_code?: string;
  amount?: number;
  currency?: string;
  metadata?: Record<string, any>;
}

export interface PaymentInitializationResponse {
  status: 'success';
  transaction_id: string;
  authorization_url: string;
  access_code: string;
  reference: string;
  amount: number;
  currency: string;
}

export interface PaymentVerificationRequest {
  reference: string;
}

export interface PaymentVerificationResponse {
  status: 'success';
  message: string;
  transaction: PaymentTransaction;
  enrollment_id?: string;
  course_title?: string;
}

export interface PaymentError {
  error: string;
  message?: string;
  code?: string;
  details?: Record<string, any>;
}

export interface PaystackWebhookEvent {
  event: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: Record<string, any>;
    log: {
      start_time: number;
      time_spent: number;
      attempts: number;
      errors: number;
      success: boolean;
      mobile: boolean;
      input: any[];
      history: any[];
    };
    fees: number;
    fees_split: any;
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
      account_name: string | null;
    };
    customer: {
      id: number;
      first_name: string | null;
      last_name: string | null;
      email: string;
      customer_code: string;
      phone: string | null;
      metadata: Record<string, any>;
      risk_action: string;
      international_format_phone: string | null;
    };
    plan: any;
    split: any;
    order_id: any;
    paidAt: string;
    createdAt: string;
    requested_amount: number;
    pos_transaction_data: any;
    source: any;
    fees_breakdown: any;
  };
}