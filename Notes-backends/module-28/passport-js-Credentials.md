# Passport---> Credentials-----------------

1. auth/router.ts-----------------------------------------
   //! login-----
   router.post("/login", AuthController.credentialsLogin);

2. config/passport.ts--------------------------------------

```js
//! crendentials login--------------------------------------
passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email: string, password: string, done) => {
      try {
        //* user findOne-----------------------
        const isUserExist = await UserModel.findOne({ email });

        if (!isUserExist) {
          return done("User doesn't exist!");
        }

        //* google authenticated--> auths check-----------------------------
        const isGoogleAuthenticated = isUserExist.auths.some(
          (providerObjects) => providerObjects.provider === "google",
        );

        if (isGoogleAuthenticated) {
          done(
            "This account was created with Google. Sign in with Google first to set a password",
          );
        }

        // password match compare----------------
        const isPasswordMatched = await bcrypt.compare(
          password as string,
          isUserExist.password as string,
        );

        if (!isPasswordMatched) {
          return done("Password doesn't match!");
        }

        return done(null, isUserExist);
      } catch (error) {
        done(error);
      }
    },
  ),
);
```

3. auth/controller----------------------------

```js
//! login user---------------------------------------------
const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", async (err: any, user: any, info: any) => {
      if (err) {
        // throw new AppError(404, "Some error!");
        // return next(err);
        // return new AppError(404, err);
        return next(new AppError(404, err));
      }

      if (!user) {
        return next(new AppError(404, info.message));
      }

      // create token----------------------------
      const userToken = await createUserToekns(user);

      // set-cookie-----------------------------
      setAuthCookie(res, userToken);

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
```
