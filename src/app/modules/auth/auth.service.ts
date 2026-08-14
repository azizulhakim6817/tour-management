/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError.js";
import { IAuthProvider, IsActive, IUser } from "../users/user.interface.js";
import { UserModel } from "../users/user.model.js";
import bcrypt, { compare } from "bcryptjs";
import { generateToken, verifyToken } from "../../../utility/jwt.js";
import { envVars } from "../../config/env.js";
import { JwtPayload } from "jsonwebtoken";
import {
  createNewAccessTokenWithRefreshToekn,
  createUserToekns,
} from "../../../utility/userTokens.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../../utility/sendEmail.js";

//! login---------------------------------------------
/* const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await UserModel.findOne({ email: email! });

  if (!isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Email dose not exist!");
  }

  //* password marching------------------------------------
  const isPasswordMaching = await bcrypt.compare(
    password as string,
    isUserExist.password as string,
  );

  if (!isPasswordMaching) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Incorrect Password!");
  }

  //* accessToken--freshToken--------------------------------------
  const userTokens = createUserToekns(isUserExist);

  //* password hide------------------
  const { password: pass, ...rest } = isUserExist.toObject();

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest,
  };
}; */

//! get new refresh token --> accessToken------------------------------------
const getNewRfreshTokenAccessTokenService = async (refreshToken: string) => {
  return await createNewAccessTokenWithRefreshToekn(refreshToken);
};

//! change password-auth------------------------------------
const changePasswordUser = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload,
) => {
  //* find userId----------------------
  const user = await UserModel.findById(decodedToken.userId);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found!");
  }

  //* compare password-----------------------
  const isOldPasswordMactch = await bcrypt.compare(
    oldPassword,
    user!.password as string,
  );

  if (!isOldPasswordMactch) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Old Password dosen't match!");
  }

  //* hash password--------------------------------------
  user!.password = await bcrypt.hash(
    newPassword,
    Number(envVars?.BCRYPT_SALT_ROUNT),
  );

  user!.save();
};

//! set-password Users Service-------------------------------------------------------
const setPasswordUser = async (userId: string, plainPassword: string) => {
  //* check(find) user(userId)------------------------------
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User Not Found!");
  }

  //* user.password(exist)--auth(google)-------------------
  const isGoogleUser = user.auths.some((auth) => auth.provider === "google");

  if (!isGoogleUser) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "This account is not a Google account.",
    );
  }

  if (user.password) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Password has already been set.",
    );
  }

  //* password hash------------------------------
  const hashPassword = await bcrypt.hash(
    plainPassword,
    Number(envVars.BCRYPT_SALT_ROUNT),
  );

  //* auths--set-------------------------------------
  const credentialProvider: IAuthProvider = {
    provider: "credentials",
    providerId: user.email,
  };

  const auths: IAuthProvider[] = [...user.auths, credentialProvider];

  //* body---set--------------------------------
  user.password = hashPassword;
  user.auths = auths;

  await user.save();
};

//! forget-password Users Service-------------------------------------------------------
const forgetPasswordUser = async (email: string) => {
  const isUserExist = await UserModel.findOne({ email });

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

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const resetToken = jwt.sign(jwtPayload, envVars.JWT_ACCESS_SECRET, {
    expiresIn: "10m",
  });

  const resetUrlLink = `${envVars.FORNTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`;

  await sendEmail({
    to: isUserExist.email,
    subject: "Password Reset",
    templateName: "forgetpassword",
    templateData: {
      name: isUserExist.name,
      resetLink: resetUrlLink,
    },
  });
};

//* reset-password Users Service-------------------------------------------------------
const resetPasswordUser = async (newPassword: string, userId: string) => {
  //* check(find) user(userId)------------------------------
  const isUserExist = await UserModel.findById(userId);

  if (!isUserExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found!");
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

  //* password hash------------------------------
  const hashPassword = await bcrypt.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUNT),
  );

  //* Update password--------------------------------
  isUserExist.password = hashPassword;

  //* Save--------------------------------------------
  return await isUserExist.save();
};

export const AuthServices = {
  //credentialsLogin,
  getNewRfreshTokenAccessTokenService,
  changePasswordUser,
  setPasswordUser,
  forgetPasswordUser,
  resetPasswordUser,
};
