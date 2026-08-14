import { Types } from "mongoose";

export enum IBookingStatus {
  PENDING = "PENDING",
  CANCELED = "CANCELED",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export interface IBooking {
  userId: Types.ObjectId;
  tourId: Types.ObjectId;
  paymentId?: Types.ObjectId;
  status: IBookingStatus;
  guestCount: number;
  createdAt?: Date;
}
