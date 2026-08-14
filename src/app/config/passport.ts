/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import passport, { Profile } from "passport";
import {
  Strategy as googleStrategy,
  VerifyCallback,
} from "passport-google-oauth20";
import { Strategy as LocalStrategy, VerifyFunction } from "passport-local";
import { envVars } from "./env.js";
import { UserModel } from "../modules/users/user.model.js";
import { IsActive, Role } from "../modules/users/user.interface.js";
import { string } from "zod";
import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import AppError from "../errorHelpers/AppError.js";

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

        //* isUserExist more login user--(Start)----------------------
        if (
          isUserExist.isActive === IsActive.BLOCKED ||
          isUserExist.isActive === IsActive.INACTIVE
        ) {
          return done("User is blocked!");
        }

        if (isUserExist.isDeleted) {
          // return done("User is deleted!");
          throw new AppError(StatusCodes.BAD_REQUEST, "User is deleted!");
        }

        if (!isUserExist.isVerified) {
          return done("User isn't verified!");
        }

        //*--------------(Ended)--isUserExist--more login user---------------------

        //* google authenticated--> auths check-----------------------------
        const isGoogleAuthenticated = isUserExist.auths.some(
          (providerObjects) => providerObjects.provider === "google",
        );

        if (isGoogleAuthenticated && !isUserExist.password) {
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

//! google login--------------------------------------
passport.use(
  new googleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback,
    ) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(null, false, { message: "Not Found Email!" });
        }

        let isUserExist = await UserModel.findOne({ email });

        if (!isUserExist) {
          isUserExist = await UserModel.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0]?.value ?? "",
            role: Role.USER,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }

        //*--------isUserExist more login user--(Start)----------------------
        if (
          isUserExist.isActive === IsActive.BLOCKED ||
          isUserExist.isActive === IsActive.INACTIVE
        ) {
          return done(null, false, { message: "User is blocked!" });
        }

        if (isUserExist.isDeleted) {
          return done({ message: "User is deleted!" });
        }

        if (!isUserExist.isVerified) {
          return done({ message: "User isn't verified!" });
        }

        //*--------------(Ended)--isUserExist--more login user---------------------

        return done(null, isUserExist);
      } catch (error) {
        console.error("Google Strategy Error!", error);
        return done(error as Error);
      }
    },
  ),
);

//! serializeUser---------------------------
passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

//! deserializeUser--------------------------
passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (error) {
    console.log(error);
    done(error);
  }
});

/* 
*** client_URL--> 
  Frontend_URL:
  ---> http://localhost:5371/login?redirect=/booking--->
   --> passport---> google_oauth_consent---> gmail login---->
   --> successfull--> callback_url---->
   --> Backend_URL: http://localhost:5000/api/v1/auth/google?redirect=/booking
   --> DB_store --> token

*** Brigde---> google---> user DB_store--> token
    ---> custom--> email, password, role_user, name---> registration --> DB_store---> creaet_user

*** Google ---> 
     req---> google---> successfull----> jwt=role,email,name ---> DB_store---> api_access
*/
