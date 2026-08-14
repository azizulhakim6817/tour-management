import { Router } from "express";
import { OTPController } from "./otp.controller.js";

const router = Router();

router.post("/send", OTPController.sendOTP);
router.post("/verify", OTPController.verifyOTP);

export const otpRoutes = router;
