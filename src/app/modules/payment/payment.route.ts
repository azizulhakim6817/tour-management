import { Router } from "express";
import { PaymentController } from "./payment.controller.js";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { Role } from "../users/user.interface.js";

const route = Router();

route.post("/init/payment/:bookingId", PaymentController.initPayment);
route.post("/success", PaymentController.successPayment);
route.post("/fail", PaymentController.failPayment);
route.post("/cancel", PaymentController.cancelPayment);

route.patch("/refund/payment/:paymentId", PaymentController.refundPayment);

route.get(
  "/invoice/url/:paymentId",
  checkAuth(...Object.values(Role)),
  PaymentController.getInvoiceDownloadUrlPayment,
);

//! validate payment-ssl-commerze----------------------
route.post("/validate/payment", PaymentController.validatePayment);

export const PaymentRoutes = route;
