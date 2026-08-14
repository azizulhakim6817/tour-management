## passportJS

# 1. passport-google-oauth20------

# 2. passport-local----------

# 3. passport-google-oauth20-----------------------

```js
var GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://www.example.com/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    },
  ),
);
```

# 4. Goole Cloud----------------------------------------------

1.  Google Cloud: AI and Cloud Computing Services --> click
2.  Console ----> click
3.  API & Service----> click
4.  Project create ----->
5.  OAuth Consent screen----->
6.  Crendentials----------------------> click
7.  create oauth client ID------------------->

8.  http://localhost:5000
9.  http://localhost:5000/api/v1/auth/google/callback

# 5. packages--------------------------------

1.  npm i passport + typescript
2.  npm i passport-local + typescript
3.  npm i passport-google-oauth20 + typescript
4.  npm i express-session + typescript

# 6. app.ts-----------------------------

import expressSession from "express-session";
import passport from "passport";
import "./app/config/passport.js";

```js
app.use(passport.initialize());
app.use(passport.session());
app.use(
  expressSession({
    secret: "Your secret",
    resave: false,
    saveUninitialized: false,
  }),
);
```

# 7. .env----------------------------------------

```js
# passport-google-oauth20(pass-1)------------
GOOGLE_CLIENT_ID=19941879656-
GOOGLE_CLIENT_SECRET=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

# Authorized redirect URIs(pass-2)----------
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# frontend_Url(pass-3)--------
FORNTEND_URL=http://localhost:5173

# express session(pass-4)----------------------
EXPRESS_SESSION_SECRET=express_session
```

# 8. config/passport.ts------------------------------------------

# Client--Backend_URL---------------->

Frontend_URL:
---> http://localhost:5371/login?redirect=/booking--->
--> passport---> google_oauth_consent---> gmail login---->
--> successfull--> callback_url---->
--> Backend_URL: http://localhost:5000/api/v1/auth/google?redirect=/booking
--> DB_store --> token

\*\*\* Brigde---> google---> user DB_store--> token
---> custom--> email, password, role_user, name---> registration --> DB_store---> creaet_user

_\*\* Google --->
req---> google---> successfull----> jwt=role,email,name ---> DB_store---> api_access
_/

# 11. passport.ts--------------------------------

```js
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import passport, { Profile } from "passport";
import {
  Strategy as googleStrategy,
  VerifyCallback,
} from "passport-google-oauth20";
import { envVars } from "./env.js";
import { UserModel } from "../modules/users/user.model.js";
import { Role } from "../modules/users/user.interface.js";

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

        let user = await UserModel.findOne({ email });

        if (!user) {
          user = await UserModel.create({
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
        return done(null, user);
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


```

# 9. auth.route.ts-----------------------------

1. scope: ["profile", "email"] → Google থেকে কোন তথ্য (profile ও email) চাওয়া হবে।

2. state: redirect as string → Login শেষে কোন page-এ ফিরে যাবে, সেই তথ্য নিরাপদভাবে Google

3. passport.authenticate("google", {scope: ["profile", "email"],state: "/booking"});---
   Passport Google-এ redirect করবে।
   Google URL-এর মধ্যে scope এবং state যোগ হবে।

````
1. passport.authenticate("google", { failureRedirect: "/login" }),------------s-
   ✅ Authentication সফল → পরের middleware (AuthController.googleCallback) চলবে।
   ❌ Authentication ব্যর্থ → /login route-এ redirect হবে।

```js
//! google cloud----------------------------
// /booking--->/login---> successfull google login---> /booing frontend
// /login---> successfull google login ---> frontend

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

//* google/callback-----------------
// /api/v1/google/callback?state=/booking
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  AuthController.googleCallback,
);

````

# 10 auth.controller.ts---------------------

1. startsWith()------------------------

```js
startsWith() হলো JavaScript-এর একটি String Method।
```

2. slice(1)----> "/booking"=======================================
   Index:
   / b o o k i n g
   0 1 2 3 4 5 6 7
   slice(1) শুরু করবে index 1 থেকে, তাই / বাদ যাবে।

```js
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
```
