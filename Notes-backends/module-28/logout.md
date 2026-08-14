# 1. logout--------------

1. utility/setCookei.ts------------

```js
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

2. auth/logout--------------------

```js
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
```
