import { Router } from "express";
import { TourController } from "./tour.controller.js";
import { createTourZodSchema, updateTourZodSchema } from "./tour.validation.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { Role } from "../users/user.interface.js";
import { multerUpload } from "../../config/multer.config.js";

const route = Router();

//! tour Types---------------------
route.post("/type/create", TourController.createTourType);
route.get(
  "/types",
  checkAuth(...Object.values(Role)),
  TourController.getTourType,
);

route.get(
  "/types/single/:id",
  checkAuth(...Object.values(Role)),
  TourController.singleTourType,
);

route.patch(
  "/types/update/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourController.updateTourType,
);

route.delete(
  "/types/delete/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourController.deleteTourType,
);

//! tour---------------------------
route.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.array("files"),
  validateRequest(createTourZodSchema),
  TourController.createTour,
);

route.get("/", checkAuth(...Object.values(Role)), TourController.getTour);

route.patch(
  "/update/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.array("files"),
  validateRequest(updateTourZodSchema),
  TourController.updateTour,
);

route.get(
  "/single/get/:slug",
  checkAuth(...Object.values(Role)),
  TourController.singleTour,
);

route.delete(
  "/delete/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourController.deleleteTour,
);

export const TourRoutes = route;
