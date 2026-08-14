import passport from "passport";
import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { Role } from "../users/user.interface.js";
import { NextFunction, Request, Response } from "express";
import { envVars } from "../../config/env.js";

const router = Router();

//! login----------------------------------------------
router.post("/login", AuthController.credentialsLogin);
//! refres token---------------------------------------
router.post("/refresh/token", AuthController.getNewRfreshTokenAccessToken);
//! logout---------------------------------------------
router.post("/logout", AuthController.logout);

//! google cloud---------------------------------------
// booking--->/login---> successfull google login----/booing frontend-----
// login--- successfull google login --- frontend-------------------------
router.get(
  "/google",
  async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/";

    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: redirect as string,
    })(req, res, next);
  },
);

//* google/callback-------------------------------------
// /api/v1/google/callback?state=/booking--------
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${envVars.FORNTEND_URL}/login?error=There is an issue with your account. Please contact our support team.!`,
  }),
  AuthController.googleCallback,
);

//! change PasswordUser-users---------------------------------
router.post(
  "/change/password",
  checkAuth(...Object.values(Role)),
  AuthController.changePasswordUser,
);

//! set-password user(google-login)-----------------------
router.post(
  "/set/password",
  checkAuth(...Object.values(Role)),
  AuthController.setPasswordUser,
);

//! forget-password-users---------------------------------
router.post(
  "/forget/password",
  checkAuth(...Object.values(Role)),
  AuthController.forgetPasswordUser,
);

//* reset-password-users---------------------------------
router.post(
  "/reset/password",
  checkAuth(...Object.values(Role)),
  AuthController.resetPasswordUser,
);

export const AuthRoutes = router;
