/* eslint-disable no-console */
import crypto from "node:crypto";
import { redisClient } from "../../config/redis.config.js";
import { sendEmail } from "../../../utility/sendEmail.js";
import { UserModel } from "../users/user.model.js";
import AppError from "../../errorHelpers/AppError.js";
import { StatusCodes } from "http-status-codes";

//! otp expiratoin time---------------------
const OTP_EXPIRATION = 2 * 60; // 2 minutes

//! generateOtp-------------------------
const generateOtp = (length = 6) => {
  const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString();

  return otp.toString();
};

//! send OTP service-------------------------------------------------------
const sendOTP = async (email: string, name: string) => {
  const otp = generateOtp();
  const redisKey = `otp:${email}`;

  const isUserExist = await UserModel.findOne({ email });

  if (!isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User not found!");
  }

  if (isUserExist.isVerified) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User is varified!");
  }

  await redisClient.set(redisKey, otp, {
    expiration: {
      type: "EX",
      value: OTP_EXPIRATION,
    },
  });

  //* sendEamil --------------------------
  await sendEmail({
    to: email,
    subject: "Your OTP Code",
    templateName: "otp",
    templateData: {
      name,
      otp,
    },
  });
};

//! verify OTP service-------------------------------------------------------
const verifyOTP = async (email: string, otp: string) => {
  console.log("Email", email, otp);
  const isUserExist = await UserModel.findOne({ email });

  if (!isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User not found!");
  }

  const redisKey = `otp:${email}`;
  const storedOtp = await redisClient.get(redisKey);

  if (!storedOtp) {
    throw new AppError(StatusCodes.BAD_REQUEST, "OTP has expired!");
  }

  if (storedOtp !== otp) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid OTP!");
  }
  if (isUserExist.isVerified) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User is varified!");
  }

  const updatedUser = await UserModel.findOneAndUpdate(
    { email },
    { isVerified: true },
    {
      new: true,
      runValidators: true,
    },
  );

  await redisClient.del(redisKey);

  return updatedUser;
};

export const ServiceOTP = { sendOTP, verifyOTP };
