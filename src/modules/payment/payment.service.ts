import { Injectable } from '@nestjs/common';
import { PaymentType } from '@prisma/client';

export interface ChargeRequest {
  bookingId: string;
  amount: number;
  currency: string;
  method: PaymentType;
  customerEmail: string;
}

export interface ChargeResult {
  success: boolean;
  transactionId: string;
  gatewayOrderId: string;
  gatewayPaymentId: string;
  gatewaySignature: string;
  paidAt: Date;
  failureReason?: string;
}

/**
 * Mock payment gateway.
 *
 * Swap this out for a real provider (Razorpay / Stripe / PhonePe) later and keep
 * the `charge()` signature so BookingsService does not have to change.
 *
 * NOTE: this mock resolves in-process, so it is safe to call inside a DB
 * transaction. A REAL gateway does network I/O and must NOT be called while a
 * transaction is open — it would hold row locks for the whole round-trip. With a
 * real provider, split the flow: create the order first, return it to the client,
 * then confirm the booking + calendar in a second transaction from the gateway
 * webhook.
 */
@Injectable()
export class PaymentService {
  charge(req: ChargeRequest): Promise<ChargeResult> {
    const ref = `${req.bookingId.slice(0, 8)}_${req.method.toLowerCase()}`;
    return Promise.resolve({
      success: true,
      transactionId: `mock_txn_${ref}`,
      gatewayOrderId: `mock_order_${ref}`,
      gatewayPaymentId: `mock_pay_${ref}`,
      gatewaySignature: `mock_sig_${ref}`,
      paidAt: new Date(),
    });
  }
}
