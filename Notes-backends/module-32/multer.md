# Multer [DT]--> click--[TS]---> @types/multer

1. Multer------------------
   --> npm i multer -----> terminal resolve--->--npm i multer --foce
   --> npm i @types/multer
   --> npm i multer-storage-cloudinary --force

2. app/config/cloudinary.config.ts--------------
   Frontend--> Form data with image file---> multer--> form data---> req(body + file)--------------
   Folder--->image-->From data--->File--->Multer--->multer/folder(temporary)--->req.file-----------
   req.file---> cloudinary(req.file)---> url----> mongoose---->mongodb-----------------------------

3. route---> file : image
   ---> data: body text--> req.body ---> req.body.data

4. route.post("division/create")--> form data--body/file-------

# Multer---CloudinaryStorage-----------------------

```js
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { uploadToCloudinary } from "./cloudinary.config.js";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary: uploadToCloudinary,
  params: async (req, file) => {
    const fileName = file.originalname
      .replace(/\s+/g, "-") // space -> -
      .replace(/\./g, "-") // . -> -
      .replace(/[^a-zA-Z0-9-]/g, "-"); // special character -> -

    const extention = file.originalname.split(".").pop();

    const uniqueFileName =
      Math.random().toString(36).substring(2) +
      "-" +
      Date.now() +
      "-" +
      fileName +
      "." +
      extention;

    return uniqueFileName;
  },
});
```

# Multer basic code file-------------------------------------

```js
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`,
    );
  },
});
```

2.
