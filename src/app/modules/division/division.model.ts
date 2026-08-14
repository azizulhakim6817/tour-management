import { model, Schema } from "mongoose";
import { IDivision } from "./division.interface.js";

const divisionSchema = new Schema<IDivision>(
  {
    name: { type: String, unique: true },
    slug: { type: String, unique: true },
    thumbnail: { type: String },
    description: { type: String },
  },
  { timestamps: true, versionKey: false },
);

//! pre methode---> create--slug---------------------------------------
divisionSchema.pre("save", async function () {
  if (!this.name) return;

  const baseSlug = this.name.toLowerCase().trim().split(/\s+/).join("-");

  let slug = `${baseSlug}-division`;
  let counter = 1;

  while (await DivisionModel.exists({ slug })) {
    slug = `${baseSlug}-division-${counter++}`;
  }

  this.slug = slug;
});

//! pre-methor--> update slug--------------------------------------
divisionSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate() as Record<string, unknown>;

  if (!update.name) return;

  const baseSlug = (update.name as string)
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .join("-");

  let slug = `${baseSlug}-division`;
  let counter = 1;

  while (await DivisionModel.exists({ slug })) {
    slug = `${baseSlug}-division-${counter}`;
    counter++;
  }

  update.slug = slug;
  this.setUpdate(update);
});

export const DivisionModel = model<IDivision>("divisions", divisionSchema);
