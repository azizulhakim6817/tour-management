import { Router } from "express";
import { guideController } from "./guide.controller.js";
import { multerUpload } from "../../config/multer.config.js";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { Role } from "../users/user.interface.js";
import { guideApplicationZodSchema } from "./guide.validation.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
const router = Router();

router.post(
  "/apply",
  checkAuth(Role.USER),
  multerUpload.single("nidPhoto"),
  validateRequest(guideApplicationZodSchema),
  guideController.createGuide,
);

//! user to guide role chnage---Admin and super_admin
router.post(
  "/approved-reject/:guideId",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  guideController.approveRejectGuide,
);

//! find all Guide by admin and super_admin----------
router.get(
  "/all",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  guideController.getAllGuide,
);

//! single guide-by admin and super_admin---------------
router.get(
  "/single/:guideId",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  guideController.singleGuide,
);

//! archive guide---------------------
router.patch(
  "/archive/:guideId",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  guideController.archiveGuide,
);

export const guideRouter = router;
