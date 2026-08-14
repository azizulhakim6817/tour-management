/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from "http-status-codes";
import AppError from "../errorHelpers/AppError.js";
import { envVars } from "./env.js";
import { v2 as cloudinary } from "cloudinary";
import Stream from "stream";

//! image add-uploaded-------------------------------
cloudinary.config({
  cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = cloudinary;

//! upload Buffer to cloudinary=============================
export const uploadBufferToCloudinary = async (
  buffer: Buffer,
  fileName: string,
) => {
  try {
    return new Promise((resolve, reject) => {
      const public_id = `pdf/${fileName}-${Date.now()}`;
      const bufferStream = new Stream.PassThrough();
      bufferStream.end(buffer);

      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
            public_id: public_id,
            folder: "pdf",
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          },
        )
        .end(buffer);
    });
  } catch (error: any) {
    console.log(error);
    throw new AppError(StatusCodes.BAD_REQUEST, "dsa");
  }
};
//!  delete image cloudinary=============================
//* If any image upload fails, all previously uploaded images will be deleted.
export const deleteImageFromCloudinary = async (url: string | undefined) => {
  if (!url) return;

  try {
    const regex = /\/v\d+\/(.*?)\.(jpeg|jpg|png|gif|webp|jfif)$/i;

    const match = url.match(regex);

    if (match?.[1]) {
      const public_id = match[1];
      await cloudinary.uploader.destroy(public_id);
    }
  } catch (error: any) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Cloudinary image deletion failed!",
      error.message,
    );
  }
};
