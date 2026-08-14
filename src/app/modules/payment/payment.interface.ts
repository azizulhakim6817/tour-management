/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";

export enum IPaymentStatus {
  PAID = "PAID",
  UNPAID = "UNPAID",
  CANCELED = "CANCELED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export interface IPayment {
  bookingId: Types.ObjectId;
  transactionId: string;
  amount: number;
  paymentGetway?: any;
  invoiceURL?: string;
  status: IPaymentStatus;
}
