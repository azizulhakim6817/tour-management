import { model, Schema } from "mongoose";
import { IPayment, IPaymentStatus } from "./payment.interface.js";

const paymentSchema = new Schema<IPayment>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      required: true,

      ref: "bookings",
    },

    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: { type: Number, required: true },
    invoiceURL: { type: String },
    status: {
      type: String,
      enum: Object.values(IPaymentStatus),
      default: IPaymentStatus.UNPAID,
    },
    paymentGetway: { type: Schema.Types.Mixed },
  },
  { timestamps: true, versionKey: false },
);

export const PaymentModel = model<IPayment>("payments", paymentSchema);
