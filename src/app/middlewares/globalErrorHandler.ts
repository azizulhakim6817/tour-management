/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { envVars } from "../config/env.js";
import AppError from "../errorHelpers/AppError.js";
import { fi } from "zod/locales";
import { error } from "node:console";
import mongoose from "mongoose";
import {
  IGenericErrorResponse,
  TErrorSources,
} from "../interfaces/error.types.js";
import { handleDuplicateError } from "../helpers/handleDuplicateError.js";
import { handleCastError } from "../helpers/handleCastError.js";
import { handleValidationError } from "../helpers/handleValidationError.js";
import { handleZodError } from "../helpers/handleZodError.js";
import { deleteImageFromCloudinary } from "../config/cloudinary.config.js";

//!### global Error handle----------------------------
export const globalErrorhandle = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //console.log("E", err);

  let statusCode = 500;
  let message = `Something went wrong!!`;
  let errorSource: TErrorSources[] = [];

  //! AppError--with and without-------------------------
  //* development---production ---------------
  if (envVars.NODE_ENV === "development") {
    console.log(err);
  }

  //* cloudinary :  if any post image URL don't successfullt then it will be deleted!
  if (req.file) {
    await deleteImageFromCloudinary(req.file.path);
  }
  if (req.files && Array.isArray(req.files) && req.files.length) {
    const imageUrl = (req.files as Express.Multer.File[]).map(
      (file) => file.path,
    );

    await Promise.all(imageUrl.map((url) => deleteImageFromCloudinary(url)));
  }

  //* Mongoose duplicate Error handle----
  if (err.code === 11000) {
    //console.log("Duplicate Error!", err.message);
    const simplifiedError = handleDuplicateError(err);
    ((statusCode = simplifiedError.statusCode),
      (message = simplifiedError.message));
  }
  //* CastError--objectId-------------------------------
  else if (err.name === "CastError") {
    const simplifiedError = handleCastError(err);
    ((statusCode = simplifiedError.statusCode),
      (message = simplifiedError.message));
  }
  //* ValidationError -------------------------
  else if (err.name === "ValidationError") {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError.statusCode;
    errorSource = simplifiedError.errorSource ?? [];
    message = simplifiedError.message;
  }
  //* ZodError error--------------------
  else if (err.name === "ZodError") {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    errorSource = simplifiedError.errorSource ?? [];
    message = simplifiedError.message;
  }
  //* AppError--Error------------------------
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSource,
    err,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};
