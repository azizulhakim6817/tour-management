import { Types } from "mongoose";
import { z } from "zod";
import { IBookingStatus } from "./booking.interface.js";

//! create booking zox schema----------------------
export const createBookingZodSchema = z.object({
  tourId: z
    .string()
    .min(1, "Tour ID is required")
    .refine((id) => Types.ObjectId.isValid(id), {
      message: "Invalid Tour ID",
    }),

  guestCount: z.coerce.number().int().positive(),
});

//! update booking zod schema----------------------------
export const updateBookingZodSchema = z.object({
  status: z
    .enum(Object.values(IBookingStatus) as [string, ...string[]])
    .optional(),
});
