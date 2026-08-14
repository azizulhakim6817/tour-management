import { Router } from "express";
import { UserRouter } from "../modules/users/user.route.js";
import { AuthRoutes } from "../modules/auth/auth.route.js";
import { TourRoutes } from "../modules/tour/tour.router.js";
import { DivisionRoutes } from "../modules/division/division.route.js";
import { BookiingRoutes } from "../modules/booking/booking.route.js";
import { PaymentRoutes } from "../modules/payment/payment.route.js";
import { otpRoutes } from "../modules/opt/opt.routes.js";
import { statsRoutes } from "../modules/stats/stats.route.js";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRouter,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/division",
    route: DivisionRoutes,
  },
  {
    path: "/tour",
    route: TourRoutes,
  },
  {
    path: "/tour",
    route: TourRoutes,
  },
  {
    path: "/booking",
    route: BookiingRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoutes,
  },
  {
    path: "/otp",
    route: otpRoutes,
  },
  {
    path: "/stats",
    route: statsRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
