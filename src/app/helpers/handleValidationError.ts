/* eslint-disable @typescript-eslint/no-explicit-any */

import mongoose from "mongoose";
import {
  IGenericErrorResponse,
  TErrorSources,
} from "../interfaces/error.types.js";

//* handleValidationError-------------------------------
export const handleValidationError = (
  err: mongoose.Error.ValidationError,
): IGenericErrorResponse => {
  const errorSource: TErrorSources[] = [];

  const errors = Object.values(err.errors);

  //ValidatorError--castError----------------
  errors.forEach((errorObject: any) =>
    errorSource.push({
      path: errorObject.path,
      message: errorObject.message,
    }),
  );
  //console.log("P", errorSource);

  return {
    statusCode: 400,
    errorSource,
    message: "Invalid mongodb objectId, please provide valid Id!",
  };
};
