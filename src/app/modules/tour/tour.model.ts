import { model, Schema } from "mongoose";
import { ITour, ITourTypes } from "./tour.interface.js";

//! tourTypes--------------------------------
const tourTypesSchema = new Schema<ITourTypes>(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true, versionKey: false },
);

export const TourTypesModel = model<ITourTypes>("tourTypes", tourTypesSchema);

//! tour-------------------------------------
const tourSchema = new Schema<ITour>(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String },
    images: { type: [String] },
    location: { type: String },
    costFrom: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    departureLocation: { type: String },
    arrivalLocation: { type: String },
    included: { type: [String], default: [] },
    excluded: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    tourPlan: { type: [String], default: [] },
    maxGuest: { type: [String], default: [] },
    division: { type: Schema.Types.ObjectId, required: true, ref: "divisions" },
    tourTypes: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "tourTypes",
    },
  },
  { timestamps: true, versionKey: false },
);

//! pre methode---> create--slug---------------------------------------
tourSchema.pre("save", async function () {
  const baseSlug = this.title.toLowerCase().trim().split(/\s+/).join("-");

  let slug = `${baseSlug}-tour`;
  let counter = 1;

  while (await TourModel.exists({ slug })) {
    slug = `${baseSlug}-tour-${counter}`;
    counter++;
  }

  this.slug = slug;
});

//! pre-methor--> update slug--------------------------------------
tourSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate() as Record<string, unknown>;

  if (!update.title) return;

  const baseSlug = (update.title as string)
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .join("-");

  let slug = `${baseSlug}-tour`;
  let counter = 1;

  while (await TourModel.exists({ slug })) {
    slug = `${baseSlug}-tour-${counter}`;
    counter++;
  }

  update.slug = slug;
  this.setUpdate(update);
});

export const TourModel = model<ITour>("tours", tourSchema);
