import { StatusCodes } from "http-status-codes";
import {
  IGuideApplication,
  IGuideApplicationStatus,
} from "./guide.interface.js";
import { GuideModel } from "./guide.model.js";
import AppError from "../../errorHelpers/AppError.js";
import { UserModel } from "../users/user.model.js";
import mongoose from "mongoose";

//! create guide----------------------------------------
const createGuide = async (payload: IGuideApplication, userId: string) => {
  const guide = await GuideModel.create({
    ...payload,
    userId,
  });

  return guide;
};

//! Approve Reject Guide------------------------------
const approveRejectGuide = async (
  status: IGuideApplicationStatus,
  guideId: string,
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 1. Validate requested status
    if (
      status !== IGuideApplicationStatus.APPROVED &&
      status !== IGuideApplicationStatus.REJECTED
    ) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Status must be APPROVED or REJECTED",
      );
    }

    // 2. Find guide application
    const guide = await GuideModel.findById(guideId).session(session);

    if (!guide) {
      throw new AppError(StatusCodes.NOT_FOUND, "Guide application not found");
    }

    // 3. Only PENDING applications can be updated
    if (guide.status !== IGuideApplicationStatus.PENDING) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        `Guide application is already ${guide.status}`,
      );
    }

    // 4. Update guide application status
    guide.status = status;

    await guide.save({ session });

    // 5. Update user role according to application status
    const role = status === IGuideApplicationStatus.APPROVED ? "GUIDE" : "USER";

    const user = await UserModel.findByIdAndUpdate(
      guide.userId,
      {
        role,
      },
      {
        new: true,
        runValidators: true,
        session,
      },
    );

    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    await session.commitTransaction();

    return guide;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

//! getAllGuide-------------------------------------------
const getAllGuide = async () => {
  const guides = await GuideModel.find()

    .sort({ createdAt: 1 })
    .populate("userId", "name email role")
    .populate("divisionId", "name slug");

  if (guides.length == 0) {
    throw new AppError(StatusCodes.NOT_FOUND, "Guide application not found");
  }

  return guides;
};

//! single Guide-------------------------------------------
const singleGuide = async (guideId: string) => {
  const guides = await GuideModel.findById(guideId);

  return guides;
};

//! archive guide-------------------------------------------
const archiveGuide = async (guideId: string) => {
  const guide = await GuideModel.findById(guideId);

  if (!guide) {
    throw new AppError(StatusCodes.NOT_FOUND, "Guide application not found");
  }

  //* Only approved or rejected applications can be archived
  if (
    guide.status !== IGuideApplicationStatus.APPROVED &&
    guide.status !== IGuideApplicationStatus.REJECTED
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Only approved or rejected applications can be archived",
    );
  }
  const updateGuide = await GuideModel.findByIdAndUpdate(
    guideId,
    {
      status: IGuideApplicationStatus.ARCHIVED,
    },
    {
      new: true,
    },
  );

  return updateGuide;
};

export const GuideService = {
  createGuide,
  approveRejectGuide,
  getAllGuide,
  singleGuide,
  archiveGuide,
};
