import { StatusCodes } from "http-status-codes";
import { envVars } from "../app/config/env.js";
import AppError from "../app/errorHelpers/AppError.js";
import { IsActive, IUser } from "../app/modules/users/user.interface.js";
import { UserModel } from "../app/modules/users/user.model.js";
import { generateToken, verifyToken } from "./jwt.js";
import { JwtPayload } from "jsonwebtoken";

//! create accessToken---refreshToken---------------------------
export const createUserToekns = (user: Partial<IUser>) => {
  //* access token--------------------------------------
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES_IN,
  );

  //* refresh token----------------------------
  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES_IN,
  );

  return {
    accessToken,
    refreshToken,
  };
};

//! create new refreshToken-----------------------------------
export const createNewAccessTokenWithRefreshToekn = async (
  newRefreshToken: string,
) => {
  const verifiedRefreshToken = verifyToken(
    newRefreshToken,
    envVars.JWT_REFRESH_SECRET,
  ) as JwtPayload;

  const isUserExist = await UserModel.findOne({
    email: verifiedRefreshToken.email,
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

  if (!isUserExist.isVerified) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User isn't verified!");
  }

  //* refresh token--------------------------------------
  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  //* refresh token----------------------------
  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES_IN,
  );

  return {
    accessToken: accessToken,
  };
};
