/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../utility/sendResponse.js";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../../utility/catchAsync.js";
import { BookingService } from "./booking.service.js";
import { JwtPayload } from "jsonwebtoken";

//! create booking-----------------------------
const createBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decoded = req.user as JwtPayload;
    const payload = req.body;

    const booking = await BookingService.createBooking(
      payload,
      decoded?.userId,
    );

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Booking created successfully",
      // meta: booking.meta,
      data: booking,
    });
  },
);

//! get bookings-----------------------------
const getBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const booking = await BookingService.getBooking();

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Get Booking successfully",
      // meta: booking.meta,
      data: booking,
    });
  },
);

//! my bookings-----------------------------
const myGetBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decoded = req.user as JwtPayload;
    const booking = await BookingService.myGetBooking(decoded.userId);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "My Booking Get successfully",
      // meta: booking.meta,
      data: booking,
    });
  },
);

//! update booking-----------------------------
const updateBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const bookingId = req.params.bookingId as string;
    const payload = req.body;

    const booking = await BookingService.updateBooking(bookingId, payload);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Booking updated successfully",
      // meta: booking.meta,
      data: booking,
    });
  },
);
//! delete booking-----------------------------
const deleteBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const bookingId = req.params.bookingId as string;
    const booking = await BookingService.deleteBooking(bookingId);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Booking deleted successfully",
      // meta: booking.meta,
      data: booking,
    });
  },
);
export const BookingController = {
  createBooking,
  getBooking,
  myGetBooking,
  updateBooking,
  deleteBooking,
};
