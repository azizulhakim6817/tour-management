/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utility/catchAsync.js";
import { TourModel } from "./tour.model.js";
import { sendResponse } from "../../../utility/sendResponse.js";
import { StatusCodes } from "http-status-codes";
import { TourServices } from "./tour.service.js";
import { meta } from "zod/v4/core";
import { ITour } from "./tour.interface.js";

//*********************************************************************** */
//! ### tour type-------------------------------------------
//! create tour type---------------------------------

const createTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const tourType = await TourServices.createTourType(payload);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Tour Type Created Successfully",
      data: tourType,
    });
  },
);

//! get tour type----------------------------------
const getTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourType = await TourServices.getTourType();

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "All Tour Type Successfully",
      // meta: divisions.meta,
      data: tourType,
    });
  },
);

//! update tour type----------------------------------
const updateTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const payload = req.body;
    const tourType = await TourServices.updateTourType(id, payload);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Tour Type Updated Successfully",
      // meta: tourType.meta,
      data: tourType,
    });
  },
);
//! single by id tour type----------------------------------
const singleTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const tourType = await TourServices.singleTourType(id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Tour Type Is Single Data Successfully",
      // meta: tourType.meta,
      data: tourType,
    });
  },
);

//! delete tour type----------------------------------
const deleteTourType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    await TourServices.deleteTourType(id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Tour Type Deleted Successfully",
      // meta: tourType.meta,
      data: null,
    });
  },
);

//*********************************************************************** */
//!### Tour****************************************************
//! create tour ---------------------------------
const createTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: ITour = {
      ...req.body,
      images: (req.files as Express.Multer.File[]).map((file) => file.path),
    };

    const tour = await TourServices.createTour(payload);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Tour Created Successfully",
      data: tour,
    });
  },
);

//! get tour----------------------------------
//* location=Dhaka(Dhaka)
//* serachTerm=Banany --> (Dhaka)
const getTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as Record<string, string>;

    const tour = await TourServices.getTour(query);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "All Tour Successfully",
      //meta: tour.meta,
      data: tour,
    });
  },
);

//! update tour----------------------------------
const updateTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const payload: ITour = {
      ...req.body,
      images: (req.files as Express.Multer.File[]).map((file) => file.path),
    };

    const tour = await TourServices.updateTour(id, payload);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Tour Updated Successfully",
      // meta: tourType.meta,
      data: tour,
    });
  },
);

//! single by id tour----------------------------------
const singleTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug as string;
    const tour = await TourServices.singleTour(slug);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Tour Single Data Successfully",
      // meta: tourType.meta,
      data: tour,
    });
  },
);

//! delete tour----------------------------------
const deleleteTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    await TourServices.deleleteTour(id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Tour Deleted Successfully",
      // meta: tourType.meta,
      data: null,
    });
  },
);

export const TourController = {
  /* tour types---------- */
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
