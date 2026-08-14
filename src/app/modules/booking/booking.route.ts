import { Router } from "express";
import { BookingController } from "./booking.controller.js";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { Role } from "../users/user.interface.js";
import {
  createBookingZodSchema,
  updateBookingZodSchema,
} from "./booking.validation.js";
import { validateRequest } from "../../middlewares/validateRequest.js";

const route = Router();

//! create booking---------------
route.post(
  "/create",
  checkAuth(...Object.values(Role)),
  validateRequest(createBookingZodSchema),
  BookingController.createBooking,
);

//! get-booking-role-SA-------------
route.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  BookingController.getBooking,
);

//! get-my-booking----------------
route.get(
  "/my/bookings",
  checkAuth(...Object.values(Role)),
  BookingController.myGetBooking,
);

//! update-booking----------------
route.patch(
  "/update/:bookingId",
  checkAuth(...Object.values(Role)),
  validateRequest(updateBookingZodSchema),
  BookingController.updateBooking,
);

//! delete-booking----------------
route.delete(
  "/delete/:bookingId",
  checkAuth(...Object.values(Role)),
  BookingController.deleteBooking,
);

export const BookiingRoutes = route;
