## jwt--> json web token-----------------------

1. verify access token------------------------
   1. jwt.ts ---> verifyToken create paramiter------recieved---
   1. checkAuth.ts --> created and role permission
   1. Any routes use to checkAuth(Role.ADMIN || Role.USER || Role.SUPER_ADMIN)

1. What is jwtPayload?----------------------------
   as JwtPayload হলো Type Assertion (আগে একে Type Casting-ও বলা হতো)।-----
   এর মাধ্যমে তুমি TypeScript-কে বলছ:
   "আমি জানি এই value-টি JwtPayload type-এর।"

3..toObject() হলো Mongoose Document-কে Plain JavaScript Object-এ রূপান্তর করার Method।

# 4. access token--------------------------------------

```js
const credentials = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await UserModel.findOne({ email: email! });

  if (!isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Email dose not exist!");
  }

  //* password marching------------------------------------
  const isPasswordMaching = await bcrypt.compare(
    password as string,
    isUserExist?.password as string,
  );

  if (!isPasswordMaching) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Incorrect Password!");
  }

  //* access token--------------------------------------
  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const accessToken = jwt.sign(jwtPayload, "secret", { expiresIn: "1d" });

  //* refresh token----------------------------
  const refreshToken = generateToken(
    payload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES_IN,
  );

  //* password hide------------------
  const { password: pass, ...rest } = isUserExist.toObject();


  return {
    token: accessToken,
  };
};
```

# 5. jwt main jwt.js file create and setup------------

```js
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


```
