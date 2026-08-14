/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../utility/sendResponse.js";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../../utility/catchAsync.js";
import { StatsService } from "./stats.service.js";

//! get user stats---------------------------------------------
const getUserStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await StatsService.getUserStats();

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "All User retrieved Successfully",
      data: user,
    });
  },
);
//! get tour stats---------------------------------------------
const getTourStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await StatsService.getTourStats();

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "All User retrieved Successfully",
      data: user,
    });
  },
);
//! get booking stats---------------------------------------------
const getBookingStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await StatsService.getBookingStats();

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "All User retrieved Successfully",
      data: user,
    });
  },
);
//! get payment stats---------------------------------------------
const getPaymentStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await StatsService.getPaymentStats();

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "All User retrieved Successfully",
      data: user,
    });
  },
);

export const StatsController = {
  getUserStats,
  getTourStats,
  getBookingStats,
  getPaymentStats,
};
