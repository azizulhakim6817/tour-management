import { Router } from "express";
import { StatsController } from "./stats.controller.js";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { Role } from "../users/user.interface.js";

const router = Router();

router.get(
  "/get/users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StatsController.getUserStats,
);
router.get(
  "/get/tour",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StatsController.getTourStats,
);
router.get(
  "/get/booking",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StatsController.getBookingStats,
);
router.get(
  "/get/payment",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  StatsController.getPaymentStats,
);

export const statsRoutes = router;
