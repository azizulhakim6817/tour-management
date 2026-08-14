/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utility/catchAsync.js";
import { sendResponse } from "../../../utility/sendResponse.js";
import { StatusCodes } from "http-status-codes";
import { DivisionModel } from "./division.model.js";
import { divisionServices } from "./division.service.js";
import { IDivision } from "./division.interface.js";

//! create division---------------------------------
const createTure = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //const payload = req.body;

    //* form data -------------------
    //console.log({ file: req.file, body: req.body });

    const payload: IDivision = {
      ...req.body,
      thumbnail: req.file?.path,
    };

    const user = await divisionServices.createDivision(payload);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Divison Created Successfully",
      data: user,
    });
  },
);

//! get division----------------------------------
const getDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const divisions = await divisionServices.getDivision();

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "All Divisions Successfully",
      // meta: divisions.meta,
      data: divisions,
    });
  },
);

//! update division----------------------------------
const updateDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const payload = {
      ...req.body,
    };

    if (req.file) {
      payload.thumbnail = req.file.path;
    }
    const divisions = await divisionServices.updateDivision(id, payload);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Divison Updated Successfully",
      // meta: divisions.meta,
      data: divisions,
    });
  },
);
//! findOne slut division----------------------------------
const singleSlugDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug as string;
    const divisions = await divisionServices.singleSlugDivision(slug);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Divison Is Single Data Successfully",
      // meta: divisions.meta,
      data: divisions,
    });
  },
);

//! delete division----------------------------------
const deleteDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.slug as string;
    await divisionServices.deleteDivision(id);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Divison Deleted Successfully",
      // meta: divisions.meta,
      data: null,
    });
  },
);

export const DivisionController = {
  createTure,
  getDivision,
  updateDivision,
  singleSlugDivision,
  deleteDivision,
};
