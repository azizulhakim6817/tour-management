/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utility/catchAsync.js";
import { AuthServices } from "./auth.service.js";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../../utility/sendResponse.js";
import AppError from "../../errorHelpers/AppError.js";
import { clearAuthCookie, setAuthCookie } from "../../../utility/setCookie.js";
import { JwtPayload } from "jsonwebtoken";
import { createUserToekns } from "../../../utility/userTokens.js";
import { envVars } from "../../config/env.js";
import { IUser } from "../users/user.interface.js";
import passport from "passport";

//! credentials Login--------------------------------------------
/* const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body);

    //* cookie set(accessToken)--------------------------
    setAuthCookie(res, loginInfo);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "User Login In Successfully",
      data: loginInfo,
    });
  },
); 
*/

//! login user---------------------------------------------
const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (err: any, user: any, info: any) => {
      if (err) {
        // throw new AppError(404, "Some error!");
        // return next(err);
        // return new AppError(404, err);
        return next(new AppError(StatusCodes.BAD_REQUEST, err.message));
      }

      if (!user) {
        return next(new AppError(404, info.message));
      }

      // create token----------------------------
      const userToken = await createUserToekns(user);

      // set-cookie-----------------------------
      setAuthCookie(res, userToken);

      // delete to user in password------------------
      const { password: pass, ...rest } = user.toObject();

      sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "User Login In Successfully",
        data: {
          accessToken: userToken.accessToken,
          refreshToken: userToken.refreshToken,
          user: rest,
        },
      });
    })(req, res, next);

    //* cookie set(accessToken)--------------------------
  },
);
//! get new refresh token user---------------------------------------------
const getNewRfreshTokenAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //* get req.cookie.refreshToken------------
    //const refreshToken = req.headers.authorization as string;
    const newRefreshToken = req.cookies.refreshToken;
    if (!newRefreshToken) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "No refresh token recieved from cookie!",
      );
    }

    const tokenInfo =
      await AuthServices.getNewRfreshTokenAccessTokenService(newRefreshToken);

    //* cookie set(refreshToken)--------------------------
    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "New Refresh Access Token Provided Successfully",
      data: tokenInfo,
    });
  },
);

//! logout user---------------------------------------------
const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //* cookie set(accessToken)--------------------------
    clearAuthCookie(res);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "User Login In Successfully",
      data: logout,
    });
  },
);

//! google callback url---------------------------------------------
const googleCallback = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //* route to see ---> state: redirect as string,-----------
    let redirectTo = req.query.state ? (req.query.state as string) : "";

    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }

    //* global token------------------
    const user = req.user;

    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, "User Not Found!");
    }

    const tokenInfo = await createUserToekns(user);
    await setAuthCookie(res, tokenInfo);

    res.redirect(`${envVars.FORNTEND_URL}/${redirectTo}`);
  },
);

//! change password user---------------------------------------------
const changePasswordUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const decodedToken = req.user as JwtPayload;

    const newUpdatePassword = await AuthServices.changePasswordUser(
      oldPassword,
      newPassword,
      decodedToken,
    );

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Password Reset Successfully",
      data: newUpdatePassword,
    });
  },
);

//! set-password user(google-loing)---------------------------------------------
const setPasswordUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decoded = req.user as JwtPayload;
    const { password } = req.body;

    const user = await AuthServices.setPasswordUser(decoded.userId, password);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Change Password Successfully",
      data: user,
    });
  },
);

//! forget password user---------------------------------------------
const forgetPasswordUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const user = await AuthServices.forgetPasswordUser(email);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Email sent Successfully",
      data: user,
    });
  },
);

//! reset password user---------------------------------------------
const resetPasswordUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newPassword = req.body.newPassword;
    const decoded = req.user as JwtPayload;

    const newUpdatePassword = await AuthServices.resetPasswordUser(
      newPassword,
      decoded.userId,
    );

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Password Reset Successfully",
      data: newUpdatePassword,
    });
  },
);

export const AuthController = {
  credentialsLogin,
  getNewRfreshTokenAccessToken,
  logout,
  googleCallback,
  changePasswordUser,
  setPasswordUser,
  forgetPasswordUser,
  resetPasswordUser,
};
