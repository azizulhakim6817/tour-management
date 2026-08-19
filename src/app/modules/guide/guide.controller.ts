/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../../utility/sendResponse.js";
import { catchAsync } from "../../../utility/catchAsync.js";
import { NextFunction, Request, Response } from "express";
import { GuideService } from "./guide.service.js";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError.js";

//! post createGuide-----------------------------
const createGuide = catchAsync(async (req: Request, res: Response) => {
  const decoded = req.user as JwtPayload;
  const payload = req.body;

  if (!req.file) {
    throw new AppError(StatusCodes.BAD_REQUEST, "NID photo is required");
  }

  const guide = await GuideService.createGuide(
    {
      ...payload,
      nidPhoto: req.file.path,
    },
    decoded.userId,
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Guide application created successfully",
    data: guide,
  });
});

//! Approve Reject Guide ------------------------------
const approveRejectGuide = catchAsync(async (req: Request, res: Response) => {
  const { status } = req.body ?? {};
  const guideId = req.params.guideId as string;

  if (!status) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Status is required");
  }

  const guide = await GuideService.approveRejectGuide(status, guideId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: `Guide application ${status.toLowerCase()} successfully`,
    data: guide,
  });
});

//! Get All Guide ------------------------------
const getAllGuide = catchAsync(async (req: Request, res: Response) => {
  const guides = await GuideService.getAllGuide();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All guide applications retrieved successfully",
    data: guides,
  });
});

//! single Guide ------------------------------
const singleGuide = catchAsync(async (req: Request, res: Response) => {
  const guideId = req.params.guideId as string;

  const guides = await GuideService.singleGuide(guideId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All guide applications retrieved successfully",
    data: guides,
  });
});

//! archive guide ------------------------------
const archiveGuide = catchAsync(async (req: Request, res: Response) => {
  const guideId = req.params.guideId as string;

  const guide = await GuideService.archiveGuide(guideId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Guide application archived successfully",
    data: guide,
  });
});

export const guideController = {
  createGuide,
  approveRejectGuide,
  getAllGuide,
  singleGuide,
  archiveGuide,
};
