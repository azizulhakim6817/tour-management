import { Response } from "express";
import { envVars } from "../app/config/env.js";

interface IAuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

//! set cookie to browser---------------------------
export const setAuthCookie = (res: Response, tokenInfo: IAuthTokens) => {
  //* accessToken set to cookie--------------
  if (tokenInfo.accessToken) {
    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      //secure: false, // local server use and test----
      secure: envVars.NODE_ENV === "production",
      sameSite: "none",
    });

    //* refreshToken set to cookie--------------
    if (tokenInfo.refreshToken) {
      res.cookie("refreshToken", tokenInfo.refreshToken, {
        httpOnly: true,
        //secure: false, // local server use and test----
        secure: envVars.NODE_ENV === "production",
        sameSite: "none",
      });
    }
  }
};

//! clear auth cookie browser------------------------------------
export const clearAuthCookie = (res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
};
