## Cloudinary-----------------------------------------

1. cloudinary ---login------
2. get start-----------------------
3. npm i cloudinary ----terminal resolve--->
   --> npm i cloudinary --foce
   --> npm i multer-storage-cloudinary --force

   --> npm install cloudinary@1.41.3

4. View API keys------------------

5. ## Cloudinary----------------------------

   CLOUDINARY_CLOUD_NAME=d66........
   CLOUDINARY_API_KEYS=92493287...........
   CLOUDINARY_API_SECRET=EmLB5...............

6. app/config/multer.config.ts---------------------

Multer**\*\*\*\***\*\***\*\*\*\***\***\*\*\*\***\*\***\*\*\*\***

1. Frontend--> Form data with image file---> multer--> form data---> req(body + file)--------------

2. Folder--->image-->From data--->File--->Multer--->multer/folder(temporary)--->req.file-----------
   ------>url---->mongoose--->mongodb

Cloudinary Storage**\*\*\*\***\*\***\*\*\*\***\***\*\*\*\***\*\***\*\*\*\***

1. req.file---> cloudinary(req.file)---> url----> mongoose---->mongodb-----------------------------

2. Folder--->image-->From data--->File--->Multer--->storage in cloudinary--->req.file-----------
   ------>package(req.file)--->url---->req.file---->mongoose--->mongodb

3. config file ---> add---------------------------------

# config/-cloudinary.config.ts--------------------------------

```js
import { envVars } from "./env.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = cloudinary;
```

# config/-multer.config.ts--------------------------------

```js
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { uploadToCloudinary } from "./cloudinary.config.js";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary: uploadToCloudinary,
  params: async (req, file) => {
    const fileName = file.originalname
      .replace(/\s+/g, "-")
      .replace(/\./g, "-")
      .replace(/[^a-zA-Z0-9-]/g, "-");

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
```

# middleware.validateRequest.ts========================

```js
import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

export const validateRequest =
  (zodSchema: ZodType) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // req.body = JSON.parse(req.body.data) || req.body;
      if (req.body.data) {
        req.body = JSON.parse(req.body.data);
      }
      req.body = await zodSchema.parseAsync(req.body);
      next();
    } catch (err) {
      next(err);
    }
  };

```

# divisoin.route.ts--add(multerUpload.single("file"))----------------------------

1. single image add ---------------------

```js
route.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  //validateRequest(createDivisionZodSchema),
  DivisionController.createTure,
);
```

# middleware/validationRequest.ts--------updae code and add--------------------

1.  update for cloudinary-------------
    req.body = JSON.parse(req.body.data) || req.body;

```js
import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

export const validateRequest =
  (zodSchema: ZodType) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = JSON.parse(req.body.data) || req.body;
      req.body = await zodSchema.parseAsync(req.body);
      next();
    } catch (err) {
      next(err);
    }
  };

```

# division.controller.ts-------------------------

1. update code add ----------------

   ````js
    const payload: IDivision = {
      ...req.body,
      thumbnail: req.file?.path,
    };```
   ````

2. full code update division.controller.ts----------------

```js
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

```

# Multiple image add------(arrry)----multerUpload.array("files"),----------

1. tour.route.ts--------------------

```js
//! tour---------------------------
route.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.array("files"),
  validateRequest(createTourZodSchema),
  TourController.createTour,
);
```

2. src/tour.controller.ts--------------------------------

```js
//! update tour----------------------------------
const updateTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const payload: ITour = {
      ...req.body.data,
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
```

3. postment -form-data ---files--data-----------

```js
{
  "title": "Old Dhaka Heritage Tour",
  "description": "Explore Lalbagh Fort, Ahsan Manzil and Sadarghat.",
  "images": [
    "https://example.com/dhaka1.jpg"
  ],
  "location": "Dhaka",
  "costFrom": 4000,
  "startDate": "2026-08-05",
  "endDate": "2026-08-05",
  "departureLocation": "Dhaka Mirpur",
  "arrivalLocation": "Cox's Bazzar",
  "included": [
    "Transport",
    "Guide"
  ],
  "excluded": [
    "Food"
  ],
  "amenities": [
    "AC Bus"
  ],
  "tourPlan": [
    "Morning: Lalbagh Fort",
    "Afternoon: Ahsan Manzil",
    "Evening: Sadarghat"
  ],
  "maxGuest": 35,
  "minAge": 5,
  "division": "6a59d055f97d1ff0199ff12c",
  "tourTypes": "6a59e04e80762ad815bbe16d"
}
```

## delete Image From Cloudinary------------------------

==> cloudinary : if any post image URL don't successfullt then it will be deleted!

```js
https://res.cloudinary.com/dlksmhtmq/image/upload/v1784887352/PH-Tour-Management/jhvyqfshq1m-1784887348156-ChatGPT-Image-Mar-2--2026--09-55-26-PM-png.png.png
```

1. app/config/cloudinary.config.ts---------------------

   ==> cloudinary : if any post image URL don't successfullt then it will be deleted!

```js
//!  delete image cloudinary=============================
//* If any image upload fails, all previously uploaded images will be deleted.
export const deleteImageFromCloudinary = async (url: string) => {
  try {
    const regex = /\/v\d+\/(.*?)\.(jpeg|jpg|png|gif|webp)$/i;
    const match = url.match(regex);

    if (match && match[1]) {
      const public_id = match[1];
      await cloudinary.uploader.destroy(public_id);
    }
  } catch (error: any) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Cloudinary image deletion faild!",
      error.message,
    );
  }
};
```

2. Middleware/globalErrorHandler.ts-------------------------------
   ==> cloudinary : if any post image URL don't successfullt then it will be deleted!

```js
  if (req.file) {
    await deleteImageFromCloudinary(req.file.path);
  }
  if (req.files && Array.isArray(req.files) && req.files.length) {
    const imageUrl = (req.files as Express.Multer.File[]).map(
      (file) => file.path,
    );

    await Promise.all(imageUrl.map((url) => deleteImageFromCloudinary(url)));
  }
```

## upload cloudinary image to change and add update Cloudinary images-----------

1. division.route.ts ------division/update/:id------

````js
route.patch(
  "/:id",
  validateRequest(updateDivisionZodSchema),
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  DivisionController.updateDivision,
);

2. division.contorller.ts----------------

```js
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
````

2. division.serviece.ts----------------

```js
//! update division service-------------------------------------------------------
const updateDivision = async (id: string, payload: Partial<IDivision>) => {
  const existingDivision = await DivisionModel.findById(id);

  if (!existingDivision) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Division Not Found!");
  }

  //* duplicate division check---------------------
  const duplicateDivision = await DivisionModel.findOne({
    name: payload.name as string,
    _id: { $ne: id },
  });

  if (duplicateDivision) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "A Division with this name already exists!",
    );
  }

  //* update division ----------------------------
  const updateDivision = await DivisionModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  //* cloudinary update--> previous_iamge_delete----> new_image_add-----
  if (payload.thumbnail && existingDivision.thumbnail) {
    await deleteImageFromCloudinary(existingDivision.thumbnail);
  }

  return updateDivision;
};

```

## tour.update------------------------------------

0. tour.interface.ts---add--to---field-------
   ---> deleteImages?: string[];

1. tour.validation.ts---zod--add to--field-----
   ---> deleteImages: z.array(z.string()).optional(),

2. tour.route.ts---------------------------------------------

```js
route.patch(
  "/update/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.array("files"),
  validateRequest(updateTourZodSchema),
  TourController.updateTour,
);
```

2. tour.controller.ts-----------------------

```js
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
```

3. tour.servies.ts---------------------------

cloudinary images update-----

```js
if (
  payload.images &&
  payload.images.length &&
  existingTour.images &&
  existingTour.images.length
) {
  payload.images = [...payload.images, ...existingTour.images];
}
```

## tour[array-data] upload cloudinary image to change and add update Cloudinary images-----------

1. division.route.ts ------division/update/:id------

````js
route.patch(
  "/:id",
  validateRequest(updateDivisionZodSchema),
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  DivisionController.updateDivision,
);

2. division.contorller.ts----------------

```js
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
````

2. division.serviece.ts----------------

```js
//! update division service-------------------------------------------------------
const updateDivision = async (id: string, payload: Partial<IDivision>) => {
  const existingDivision = await DivisionModel.findById(id);

  if (!existingDivision) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Division Not Found!");
  }

  //* duplicate division check---------------------
  const duplicateDivision = await DivisionModel.findOne({
    name: payload.name as string,
    _id: { $ne: id },
  });

  if (duplicateDivision) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "A Division with this name already exists!",
    );
  }

  //* update division ----------------------------
  const updateDivision = await DivisionModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  //* cloudinary update--> previous_iamge_delete----> new_image_add-----
  if (payload.thumbnail && existingDivision.thumbnail) {
    await deleteImageFromCloudinary(existingDivision.thumbnail);
  }

  return updateDivision;
};

```
