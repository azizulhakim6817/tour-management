# Reset password------------------------------------------

1. auth/authController----------------------------------
2. auth/authService--------------------------------------

---

1. auth/authController----------------------------------

```js
//! reset password user---------------------------------------------
const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const decodedToken = req.user;

    const newUpdatePassword = await AuthServices.resetPassword(
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
```

2. auth/authService--------------------------------------

```js
//! reset password------------------------------------
const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload,
) => {
  //* find userId----------------------
  const user = await UserModel.findById(decodedToken.userId);

  //* compare password-----------------------
  const isOldPasswordMactch = await bcrypt.compare(
    oldPassword,
    user!.password as string,
  );

  if (!isOldPasswordMactch) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Old Password dosen't match!");
  }

  //* hash password--------------------------------------
  user!.password = await bcrypt.hash(
    newPassword,
    Number(envVars?.BCRYPT_SALT_ROUNT),
  );

  user!.save();
};
```
