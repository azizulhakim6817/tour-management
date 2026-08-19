import { model, Schema } from "mongoose";
import {
  IGuideApplication,
  IGuideApplicationStatus,
} from "./guide.interface.js";

const guideSchema = new Schema<IGuideApplication>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "users",
    },

    divisionId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "divisions",
    },

    nidPhoto: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(IGuideApplicationStatus),
      default: IGuideApplicationStatus.PENDING,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const GuideModel = model<IGuideApplication>("guides", guideSchema);
