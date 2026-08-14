import { JwtPayload } from "jsonwebtoken";

/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserServices } from "./user.service.js";
import { catchAsync } from "../../../utility/catchAsync.js";
import { sendResponse } from "../../../utility/sendResponse.js";
import { verifyToken } from "../../../utility/jwt.js";
import { envVars } from "../../config/env.js";
import { IUser } from "./user.interface.js";

//import AppError from "../../errorHelpers/AppError.js";

//! create user--------------------------------------------------
/* export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    //throw new AppError(StatusCodes.BAD_REQUEST, "fake error");
    //throw new Error("fake error");
    const user = await UserServices.createUserService(req.body);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (err: any) {
    console.error(err);
    next(err);
  }
}; */

//! create user--------------------------------------------------
const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: IUser = {
      ...req.body,
      picture: req.file?.path,
    };

    const user = await UserServices.createUserService(payload);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "User Created Successfully",
      data: user,
    });
  },
);

//! get user---------------------------------------------
const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.getUserService();

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "All User retrieved Successfully",
      data: user.data,
    });
  },
);

//! update user---------------------------------------------
const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const payload: IUser = {
      ...req.body,
      picture: req.file?.path,
    };

    const token = req.headers.authorization;
    const verifiedToken = verifyToken(
      token as string,
      envVars.JWT_ACCESS_SECRET,
    ) as JwtPayload;

    const UserToken = req.user;

    const user = await UserServices.updateUser(userId, payload, verifiedToken);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "User Updated Successfully",
      data: user,
    });
  },
);

//! get me user---------------------------------------------
const getMeUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decoded = req.user as JwtPayload;

    const user = await UserServices.getMeUser(decoded.userId);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Profile retrieved successfully",
      data: user,
    });
  },
);

export const UserController = {
  createUser,
  getUser,
  updateUser,
  getMeUser,
};
