/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from "mongoose";
import { IGenericErrorResponse } from "../interfaces/error.types.js";

//* handleCastError----------------------------
export const handleCastError = (
  err: mongoose.Error.CastError,
): IGenericErrorResponse => {
  return {
    statusCode: 400,
    message: "Invalid mongodb objectId, please provide valid Id!",
  };
};
