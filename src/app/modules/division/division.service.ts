import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError.js";
import { IDivision } from "./division.interface.js";
import { DivisionModel } from "./division.model.js";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config.js";

//! create division service-------------------------------------------------------
const createDivision = async (payload: Partial<IDivision>) => {
  //* create division-------------------------------------
  const division = await DivisionModel.create(payload);

  return division;
};

//! get division service-------------------------------------------------------
const getDivision = async () => {
  const divisions = await DivisionModel.find();
  const totalUsers = await DivisionModel.countDocuments();

  return {
    meta: {
      total: totalUsers,
    },
    data: divisions,
  };
};

//! update division service-------------------------------------------------------
const updateDivision = async (id: string, payload: Partial<IDivision>) => {
  const existingDivision = await DivisionModel.findById(id);

  if (!existingDivision) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Division Not Found!");
  }

  //* duplicate division check---------------------
  const duplicateDivision = await DivisionModel.findOne({
    name: payload.name as string,
    _id: { $ne: id },
  });

  if (duplicateDivision) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "A Division with this name already exists!",
    );
  }

  //* update division ----------------------------
  const updateDivision = await DivisionModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  //* cloudinary update--> previous_iamge_delete----> new_image_add-----
  if (payload.thumbnail && existingDivision.thumbnail) {
    await deleteImageFromCloudinary(existingDivision.thumbnail);
  }

  return updateDivision;
};

//! single by id with division service-------------------------------------------------------
const singleSlugDivision = async (slug: string) => {
  const division = await DivisionModel.findOne({ slug });

  return division;
};

//! delete division service-------------------------------------------------------
const deleteDivision = async (id: string) => {
  const divisions = await DivisionModel.findByIdAndDelete(id);

  return divisions;
};

export const divisionServices = {
  createDivision,
  getDivision,
  updateDivision,
  singleSlugDivision,
  deleteDivision,
};
