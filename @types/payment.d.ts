export interface PaymentSession {
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  userId: string;
  createdAt: Date;
  isEmi: boolean;
  installmentNumber: number;
  emiMonths: number;
  emiAmount: number;
  totalAmount: number;
  transactionId?: string;
  paymentMethod?: string;
}

declare global {
  var paymentStore: Map<string, PaymentSession> | undefined;
}
