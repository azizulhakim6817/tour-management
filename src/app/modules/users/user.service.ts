import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError.js";
import { IAuthProvider, IUser, Role } from "./user.interface.js";
import { UserModel } from "./user.model.js";
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env.js";
import { JwtPayload } from "jsonwebtoken";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config.js";

//! create user service---------------------------------------------------
const createUserService = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  if (!email) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Email is required");
  }

  const isUserExists = await UserModel.findOne({ email });

  //* user exist check -----------------
  if (isUserExists) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User already exists!");
  }

  //* auths------------------
  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email,
  };

  //* password -------------------
  const hashedPassword = await bcrypt.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUNT),
  );

  const user = await UserModel.create({
    ...rest,
    email,
    password: hashedPassword,
    auths: [authProvider],
  });

  return user;
};

//! get Users Service-------------------------------------------------------
const getUserService = async () => {
  const user = await UserModel.find();
  const totalUsers = await UserModel.countDocuments();

  return {
    meta: {
      total: totalUsers,
    },
    data: user,
  };
};

//! update User Service-------------------------------------------------------
const updateUser = async (
  userId: string | string[] | undefined,
  payload: Partial<IUser>,
  decodedToken: JwtPayload,
) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found!");
  }

  if (decodedToken.role === Role.ADMIN && user.role === Role.SUPER_ADMIN) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found!");
  }

  if (decodedToken.role === Role.USER && decodedToken.role === Role.GUIDE) {
    if (userId !== decodedToken.userId) {
      throw new AppError(StatusCodes.BAD_REQUEST, "unauthorized!");
    }
  }

  // Role update authorization
  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(StatusCodes.FORBIDDEN, "Unauthorized!");
    }
  }

  // Status update authorization
  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(StatusCodes.FORBIDDEN, "Unauthorized!");
    }
  }

  // Hash password
  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      Number(envVars.BCRYPT_SALT_ROUNT),
    );
  }

  // Update user
  const updatedUser = await UserModel.findByIdAndUpdate(userId, payload, {
    returnDocument: "after", // Mongoose 9
    runValidators: true,
  });

  // Delete old picture after successfully uploading a new image
  if (payload.picture && user.picture) {
    await deleteImageFromCloudinary(user.picture);
  }

  return updatedUser;
};

//! get me user service-------------------------------------------------------
const getMeUser = async (userId: string) => {
  if (!userId) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User Not~");
  }
  const user = await UserModel.findById(userId).select("-password");

  return {
    data: user,
  };
};

export const UserServices = {
  createUserService,
  getUserService,
  updateUser,
  getMeUser,
};
