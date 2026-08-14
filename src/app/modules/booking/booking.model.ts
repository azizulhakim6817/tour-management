import { model, Schema } from "mongoose";
import { IBooking, IBookingStatus } from "./booking.interface.js";

const bookingSchema = new Schema<IBooking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    tourId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "tours",
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      unique: true,
      ref: "payments",
    },
    status: {
      type: String,
      enum: Object.values(IBookingStatus),
      default: IBookingStatus.PENDING,
    },
    guestCount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export const BookingModel = model<IBooking>("bookings", bookingSchema);
