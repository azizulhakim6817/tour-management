# 1. utility/setCookie.ts------------------------

1. httpOnly: true ==> XSS attack থেকে সুরক্ষা বাড়ায়।----------------

2. secure: false------------------
   false → HTTP এবং HTTPS দুইটিতেই cookie কাজ করবে (development-এর জন্য)।
   true → শুধুমাত্র HTTPS-এ cookie পাঠানো হবে (production-এর জন্য)।
3. sameSite: "lax"---------
   Cross-site request-এর উপর নিয়ন্ত্রণ করে।
   "lax" সাধারণত নিরাপদ default এবং বেশিরভাগ application-এর জন্য উপযুক্ত।

```js
import { Response } from "express";

interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export const setAuthCookie = (res: Response, tokenInfo: IAuthTokens) => {
  //* accessToken set to cookie--------------
  if (tokenInfo.accessToken) {
    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: false,
    });

    //* refreshToken set to cookie--------------
    if (tokenInfo.accessToken) {
      res.cookie("refreshToken", tokenInfo.refreshToken, {
        httpOnly: true,
        secure: false,
      });
    }
  }
};
```

# 2. auth/authContoller use---------------------

```js
const loginInfo = await AuthServices.credentials(req.body);

//* cookie set(accessToken)--------------------------
setAuthCookie(res, loginInfo);

//* cookie set(refreshToken)--------------------------
setAuthCookie(res, loginInfo);
```

## final code --- cookie--------

```js
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
```
