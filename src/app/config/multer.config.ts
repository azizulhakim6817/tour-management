/* eslint-disable @typescript-eslint/no-explicit-any */
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { uploadToCloudinary } from "./cloudinary.config.js";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary: uploadToCloudinary,
  params: async (req: any, file: { originalname: string }) => {
    const fileName = file.originalname
      .replace(/\s+/g, "-") // শেষের extension বাদ দিন
      .replace(/\./g, "-") // space -> -
      .replace(/[^a-zA-Z0-9-]/g, "-"); // special character -> -

    const extension = file.originalname.split(".").pop();

    const uniqueFileName = `${Math.random().toString(36).substring(2)}-${Date.now()}-${fileName}.${extension}`;

    return {
      folder: "PH-Tour-Management", // Cloudinary folder
      public_id: uniqueFileName,
      resource_type: "image",
    };
  },
});

export const multerUpload = multer({ storage });
