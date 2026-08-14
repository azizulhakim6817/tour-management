# //! get new refresh token user---------------------------------------------

0. router.post("/refresh/token", AuthController.getNewRfreshToken);

1. auth/controller------------------------

```js
const getNewRfreshToken = catchAsync(
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

    const tokenInfo = await AuthServices.getNewRfreshToken(newRefreshToken);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Refresh Token Provided Successfully",
      data: tokenInfo,
    });
  },
);
```

2. utility/userToken.ts-----------------------

```js
export const createNewAccessTokenWithRefreshToekn = async (
  newRefreshToken: string,
) => {
  const verifiedRefreshToken = verifyToken(
    newRefreshToken,
    envVars.JWT_REFRESH_SECRET,
  ) as JwtPayload;

  const isUserExist = await UserModel.findOne({
    email: verifiedRefreshToken.email,
  });

  if (!isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User dose not exist!");
  }
  if (
    isUserExist.isActive === IsActive.BLOCKED ||
    isUserExist.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User is blocked!");
  }

  if (isUserExist.isDeleted) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User is deleted!");
  }
  //* refresh token--------------------------------------
  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  //* refresh token----------------------------
  const newRefreshTokenAsscces = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES_IN,
  );

  return {
    newRefreshTokenAsscces,
  };
};
```

3. auth/services------------------------------------

```js

//! Get New Rfresh Token------------------------------------
const getNewRfreshToken = async (refreshToken: string) => {
  const newRefreshToken =
    await createNewAccessTokenWithRefreshToekn(refreshToken);

  return newRefreshToken;
};
```
