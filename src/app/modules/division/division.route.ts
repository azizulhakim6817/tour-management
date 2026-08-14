import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest.js";
import {
  createDivisionZodSchema,
  updateDivisionZodSchema,
} from "./division.validation.js";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { Role } from "../users/user.interface.js";
import { DivisionController } from "./division.controller.js";
import { multerUpload } from "../../config/multer.config.js";

const route = Router();

//! division------------------------------------------
//* route.post("division/create")--> form data--body-/-file
route.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  validateRequest(createDivisionZodSchema),
  DivisionController.createTure,
);

route.get("/", DivisionController.getDivision);

route.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  validateRequest(updateDivisionZodSchema),
  DivisionController.updateDivision,
);

route.get(
  "/:slug",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DivisionController.singleSlugDivision,
);

route.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DivisionController.deleteDivision,
);

export const DivisionRoutes = route;
