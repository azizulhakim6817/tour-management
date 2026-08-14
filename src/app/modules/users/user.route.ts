import { Router } from "express";
import { UserController } from "./user.controller.js";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { Role } from "./user.interface.js";
import { multerUpload } from "../../config/multer.config.js";

const router = Router();

router.post(
  "/register",
  multerUpload.single("file"),
  validateRequest(createUserZodSchema),
  UserController.createUser,
);

//! get all user (AS)
router.get(
  "/get/users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserController.getUser,
);

//! get me user-(AS)--------------------
router.get("/me", checkAuth(...Object.values(Role)), UserController.getMeUser);

router.patch(
  "/update/:id",
  multerUpload.single("file"),
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  UserController.updateUser,
);

export const UserRouter = router;
