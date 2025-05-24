export interface InitializePaymentData {
  subscriptionId: string;
  amount: number;
  currency: string;
}

export interface PaymentResponse {
  paymentLink: string;
  orderId: string;
  amount: number;
  currency: string;
} 