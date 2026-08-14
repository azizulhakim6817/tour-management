/* eslint-disable @typescript-eslint/no-explicit-any */
import { IGenericErrorResponse } from "../interfaces/error.types.js";

//* handleDuplicateError---------------
export const handleDuplicateError = (err: any): IGenericErrorResponse => {
  const matchArrayDuplicate = err.message.match(/"([^"]*)"/);

  return {
    statusCode: 400,
    message: `${matchArrayDuplicate?.[1] || "Duplicate value"} already exists!`,
  };
};
