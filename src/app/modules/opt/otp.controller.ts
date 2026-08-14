/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../../utility/sendResponse.js";
import { ServiceOTP } from "./opt.service.js";
import { catchAsync } from "../../../utility/catchAsync.js";
import { StatusCodes } from "http-status-codes";

//! send OTP----------------------------------
const sendOTP = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, name } = req.body;

    const otpSend = await ServiceOTP.sendOTP(email, name);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "OTP Sent Successfully",
      // meta: otpSend.meta,
      data: otpSend,
    });
  },
);

//! send OTP----------------------------------
const verifyOTP = catchAsync(async (req, res) => {
  const { email, otp } = req.body;

  const verifiedOTP = await ServiceOTP.verifyOTP(email, otp);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "OTP verified successfully",
    data: verifiedOTP,
  });
});

export const OTPController = { sendOTP, verifyOTP };
