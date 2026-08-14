/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes/index.js";
import { StatusCodes } from "http-status-codes";
import { success } from "zod";
import { envVars } from "./app/config/env.js";

import { notFoundRoute } from "./app/middlewares/notFound.js";
const app: Application = express();
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import passport from "passport";
import "./app/config/passport.js";
import { globalErrorhandle } from "./app/middlewares/globalErrorHandler.js";

//! middleware-------------------------------------

app.use(express.json()); // post create-----stringify-to-object-
app.use(express.urlencoded({ extended: true })); // for form data
app.use(cookieParser());
app.set("trust proxy", 1);
app.use(
  cors({
    origin: envVars.FORNTEND_URL,
    credentials: true,
  }),
);

//* passportJS--------------------
app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

//! router-------------------------------------------
app.use("/api/v1", router);

//! home page
app.get("/", (req: Request, res: Response) => {
  res.send("Home Page");
});

//! Global error handle------------------
app.use(globalErrorhandle);

//! Not fount router-------------------
app.use(notFoundRoute);

export default app;
