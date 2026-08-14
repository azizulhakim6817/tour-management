import { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError.js";
import { StatusCodes } from "http-status-codes";
import { verifyToken } from "../../utility/jwt.js";
import { envVars } from "../config/env.js";
import { UserModel } from "../modules/users/user.model.js";
import { IsActive } from "../modules/users/user.interface.js";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    //* req --headers---token--------
    const accessToken = req.headers.authorization;

    if (!accessToken) {
      throw new AppError(StatusCodes.BAD_REQUEST, "No Token Recieved!");
    }

    //* verify token------------------
    const verifiedToken = verifyToken(
      accessToken,
      envVars.JWT_ACCESS_SECRET,
    ) as JwtPayload;

    //* find user-------------------
    const isUserExist = await UserModel.findOne({
      email: verifiedToken.email,
    });

    if (!isUserExist) {
      throw new AppError(StatusCodes.BAD_REQUEST, "User dose not exist!");
    }

    if (
      isUserExist.isActive === IsActive.BLOCKED ||
      isUserExist.isActive === IsActive.INACTIVE
    ) {
      throw new AppError(StatusCodes.BAD_REQUEST, "User is blocked!");
    }

    if (isUserExist.isDeleted) {
      throw new AppError(StatusCodes.BAD_REQUEST, "User is deleted!");
    }

    //* role checking--------------------------------
    if (!authRoles.includes(verifiedToken.role)) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "You are not permitted to view this route!",
      );
    }

    req.user = verifiedToken;
    next();
  };
