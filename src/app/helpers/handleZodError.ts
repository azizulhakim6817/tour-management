/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IGenericErrorResponse,
  TErrorSources,
} from "../interfaces/error.types.js";

//* handle Zod Error-------------
export const handleZodError = (err: any): IGenericErrorResponse => {
  const errorSource: TErrorSources[] = [];

  //console.log(err.issues);

  err.issues.forEach((issue: any) => {
    errorSource.push({
      // path: "nickname niside lastname inside name"
      //path: issue.path.length > 1 && issue.path.reverse().join("inside")
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    });
  });
  //console.log("Issues", errorSource);
  return {
    statusCode: 400,
    errorSource,
    message: "Zod Error!",
  };
};
