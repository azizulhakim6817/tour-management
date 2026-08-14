# User update-----------------------------------

```js
router.patch(
  "/update/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  UserController.updateUser,
);
```

```js
//! update User Service-------------------------------------------------------
const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload,
) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found!");
  }

  // Role update authorization
  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(StatusCodes.FORBIDDEN, "Unauthorized!");
    }

    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(StatusCodes.FORBIDDEN, "Unauthorized!");
    }
  }

  // Status update authorization
  if (
    payload.isActive !== undefined ||
    payload.isDeleted !== undefined ||
    payload.isVerified !== undefined
  ) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(StatusCodes.FORBIDDEN, "Unauthorized!");
    }
  }

  // Hash password
  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      Number(envVars.BCRYPT_SALT_ROUNT),
    );
  }

  return await UserModel.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });
};
```
