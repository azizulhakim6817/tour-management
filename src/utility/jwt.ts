import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import AppError from "../app/errorHelpers/AppError.js";
import { StatusCodes } from "http-status-codes";

//! generate token-----------------------------
export const generateToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: string,
) => {
  const token = jwt.sign(payload, secret, {
    expiresIn,
  } as SignOptions);

  return token;
};

//! veirified token-------------------------------
export const verifyToken = (token: string, secret: string) => {
  const verifiedToken = jwt.verify(token, secret);

  if (!verifiedToken) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid or expired token!");
  }

  return verifiedToken;
};
