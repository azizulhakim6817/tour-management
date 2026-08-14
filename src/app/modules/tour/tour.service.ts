/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from "http-status-codes";
import { ITour, ITourTypes } from "./tour.interface.js";
import { TourModel, TourTypesModel } from "./tour.model.js";
import AppError from "../../errorHelpers/AppError.js";
import { ParsedQs } from "qs";
import {
  excludeField,
  tourSearchAbleField,
} from "../../constents/tour.constant.js";
import { Query } from "mongoose";
import { any } from "zod";
import { QueryBuilder } from "../../../utility/QueryBuilder.js";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config.js";

//! create tour type service-------------------------------------------------------
const createTourType = async (payload: Partial<ITourTypes>) => {
  const division = await TourTypesModel.create(payload);

  return division;
};

//*********************************************************************** */
//! ### tour-type-------------------------------------------
//! get tour type service-------------------------------------------------------
const getTourType = async () => {
  const tourType = await TourTypesModel.find();
  const totaltourType = await TourTypesModel.countDocuments();

  return {
    meta: {
      total: totaltourType,
    },
    data: tourType,
  };
};

//! update tour type service-------------------------------------------------------
const updateTourType = async (id: string, payload: Partial<ITourTypes>) => {
  const existingTourType = await TourTypesModel.findById(id);

  if (!existingTourType) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Tour Type Not Found!");
  }

  //* duplicate tour type check---------------------
  const duplicateTourType = await TourTypesModel.findOne({
    name: payload.name as string,
    _id: { $ne: id },
  });

  if (duplicateTourType) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "A Tour Type with this name already exists!",
    );
  }

  //* update Tour Type ----------------------------
  const updateTourType = await TourTypesModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return updateTourType;
};

//! single by id with tour type service-------------------------------------------------------
const singleTourType = async (id: string) => {
  const divisions = await TourTypesModel.findById(id);

  return divisions;
};

//! delete tour type service-------------------------------------------------------
const deleteTourType = async (id: string) => {
  const tourType = await TourTypesModel.findByIdAndDelete(id);

  return tourType;
};

//*********************************************************************** */
//! ### Tour-------------------------------------------
//! create tour type service-------------------------------------------------------
const createTour = async (payload: Partial<ITour>) => {
  const tour = await TourModel.create(payload);

  return tour;
};

//! get tour type service-------------------------------------------------------
/* const getTour = async (query: Record<string, string>) => {
  const filter = query;
  const searchTerm = query.searchTerm || "";
  const sort = query.sort || "-createdAt";

  //* skip--limit-------------------------------
  const page = Number(query.page) || 5;
  const limit = Number(query.limit) || 5;
  const skip = (page - 1) * limit;

  //* field-1 filtering--------------------------
  const selectfields = query.selectfields || "";
  //* field-2 filtering-(multi-field)-------------------------
  //const selectfields = query.selectfields?.split(" ").join(" ") || "";

  //console.log(filter); // {searchTerm: 'Heritage',sort: 'Rajshahi',location: 'Rajshahi'}

  //* filter----query---------------
  for (const field of excludeField) {
    delete filter[field];
  }
  // delete filter["searchTerm"];
  // delete filter["sort"];

  //console.log(filter); // {location: 'Rajshahi'}

  //* searchTerm---------------------
  const searachQuery = {
    $or: tourSearchAbleField.map((field) => ({
      [field]: { $regex: searchTerm, $options: "i" },
    })),
  };

  //* tour count----------------------------
  const totalTours = await TourModel.find().countDocuments();

  //* meta_data_details_page------------------
  // const totalPage = 20/5 == ciel(2.1) => 3
  const totalPage = Math.ceil(totalTours / limit);

  const meta = {
    page: page,
    totals: totalTours,
    limit: limit,
    totalPage: totalPage,
  };

  //* tour find query by search-------------
  const tours = await TourModel.find(searachQuery)
    .find(filter)
    .sort(sort)
    .select(selectfields)
    .skip(skip)
    .limit(limit);

  //* Alternative method -- find()==========
  /*  const filterQuery = TourModel.find(filter);
  const tours = filterQuery.find(searachQuery);
  const allTours = await tours
    .find()
    .sort(sort)
    .select(selectfields)
    .skip(skip)
    .limit(limit); */
/*
return {
  tour_pages_details: meta,
  meta: {
    totalTours,
  },
  data: tours,
};
}; 
*/

//! get tour type service-------------------------------------------------------
const getTour = async (query: Record<string, string>) => {
  //* search---filter---
  const queryBuilder = new QueryBuilder(TourModel.find(), query);
  const tours = queryBuilder
    .search(tourSearchAbleField)
    .filter()
    .sort()
    .fields()
    .pagination();

  //* data = tours.build()-in result-------------
  //* meta = queryBuilder.getMeta()-in result----
  const [data, meta] = await Promise.all([
    tours.build(),
    queryBuilder.getMeta(),
  ]);

  return {
    meta,
    data,
  };
};

//! update tour type service-------------------------------------------------------
const updateTour = async (id: string, payload: Partial<ITour>) => {
  const existingTour = await TourModel.findById(id);

  if (!existingTour) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Tour Type Not Found!");
  }

  //* duplicate tour type check---------------------
  const duplicateTour = await TourModel.findOne({
    title: payload.title as string,
    _id: { $ne: id },
  });

  if (duplicateTour) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "A Tour Type with this name already exists!",
    );
  }

  //! ### cloudinary-1 images update(basic)----------------------
  if (
    payload.images &&
    payload.images.length > 0 &&
    existingTour.images &&
    existingTour.images.length > 0
  ) {
    payload.images = [...payload.images, ...existingTour.images];
  }

  //! ### cloudinary-2 tour[array-data] advance images update--------------

  if (
    payload.deleteImages &&
    payload.deleteImages.length > 0 &&
    existingTour.images &&
    existingTour.images.length > 0
  ) {
    const restDBImages = existingTour.images.filter(
      (imageUrl) => !payload.deleteImages?.includes(imageUrl),
    );

    const updatedPayloadImages = (payload.images || [])
      .filter((imageUrl) => !payload.deleteImages?.includes(imageUrl))
      .filter((imageUrl) => !restDBImages.includes(imageUrl));

    payload.images = [...restDBImages, ...updatedPayloadImages];
  }

  const updatedTourData = await TourModel.findByIdAndUpdate(id, payload, {
    new: true,
  });

  //! ### cloudinary-3 tour[array-data] (advance) images update- deleteImageFromCloudinary-------------
  if (
    payload.deleteImages &&
    payload.deleteImages.length > 0 &&
    existingTour.images &&
    existingTour.images.length > 0
  ) {
    await Promise.all(
      payload.deleteImages.map((url) => deleteImageFromCloudinary(url)),
    );
  }

  return updatedTourData;
};

//! single tour service-------------------------------------------------------
const singleTour = async (slug: string) => {
  const tour = await TourModel.findOne({ slug });

  return tour;
};

//! delete tour service-------------------------------------------------------
const deleleteTour = async (id: string) => {
  const tourType = await TourModel.findByIdAndDelete(id);

  return tourType;
};

export const TourServices = {
  /* tour-types----------- */
  createTourType,
  getTourType,
  updateTourType,
  singleTourType,
  deleteTourType,
  /* Tour----------- */
  createTour,
  getTour,
  updateTour,
  singleTour,
  deleleteTour,
};
