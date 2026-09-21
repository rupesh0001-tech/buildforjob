import api from './axiosInstance';

export interface CreateOrderResponse {
  success: boolean;
  key: string;
  orderId: string;
  amount: number;
  currency: string;
  plan: string;
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  plan?: string;
}

export const paymentApi = {
  createOrder: async (plan: 'PRO_MONTHLY' | 'PRO_ANNUAL') => {
    const response = await api.post<CreateOrderResponse>('/payment/create-order', { plan });
    return response.data;
  },

  verifyPayment: async (data: VerifyPaymentRequest) => {
    const response = await api.post('/payment/verify', data);
    return response.data;
  },
};
