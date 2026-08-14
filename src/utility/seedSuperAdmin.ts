/* eslint-disable no-console */
import { envVars } from "../app/config/env.js";
import { UserModel } from "../app/modules/users/user.model.js";
import {
  IAuthProvider,
  IUser,
  Role,
} from "../app/modules/users/user.interface.js";
import bcrypt from "bcryptjs";

export const SUPER_ADMINAutoInsert = async () => {
  try {
    const isSUPER_ADMIN = await UserModel.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });

    if (isSUPER_ADMIN) {
      console.log("Super Admin already exists.");
      return;
    }

    //* hash password---------------
    const hashPassword = await bcrypt.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUNT),
    );

    //* auths provider---------------------
    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.SUPER_ADMIN_EMAIL,
    };

    //* super admin create------------------
    const payload: IUser = {
      name: "Super Admin",
      role: Role.SUPER_ADMIN,
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hashPassword,
      isVerified: true,
      auths: [authProvider],
    };

    const SUPER_ADMIN = await UserModel.create(payload);

    console.log("Super Admin Created Successfully \n");

    return SUPER_ADMIN;
  } catch (error) {
    console.log(error);
  }
};
