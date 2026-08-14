# Loain-------------------------------

```js
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError.js";
import { IUser } from "../users/user.interface.js";
import { UserModel } from "../users/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../../../utility/jwt.js";
import { envVars } from "../../config/env.js";
import { JwtPayload } from "jsonwebtoken";
import { createUserToekns } from "../../../utility/userTokens.js";

const credentials = async (payload: Partial<IUser>) => {
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

  /*
  // access--fresh token--------------------------------------
  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES_IN,
  );

  // refresh token----------------------------
  const refreshToken = generateToken(
    payload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES_IN,
  );
  */

  //* access--fresh token--------------------------------------
  const userTokens = createUserToekns(isUserExist);

  //* password hide------------------
  const { password: pass, ...rest } = isUserExist.toObject();

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest,
  };
};

export const AuthServices = {
  credentials,
};
```
