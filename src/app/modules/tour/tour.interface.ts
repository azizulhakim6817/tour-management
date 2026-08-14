import { Types } from "mongoose";

//! tourTypes-------------------
export interface ITourTypes {
  name: string;
}

//! tour ---------------------------------
export interface ITour {
  title: string;
  slug?: string;
  description: string;
  images?: string[];
  location?: string;
  costFrom?: number;
  startDate?: Date;
  endDate?: Date;
  departureLocation?: string;
  arrivalLocation?: string;
  included?: string[];
  excluded?: string[];
  amenities?: string[];
  tourPlan?: string[];
  maxGuest?: string[];
  division?: Types.ObjectId;
  tourTypes?: Types.ObjectId;
  deleteImages?: string[];
}
