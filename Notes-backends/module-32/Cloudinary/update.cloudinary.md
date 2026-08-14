## upload cloudinary image to change and add update Cloudinary images-----------

1. division.route.ts ------division/update/:id------
   --> previous image delete and update image added-----------------------

````js
route.patch(
  "/:id",
  validateRequest(updateDivisionZodSchema),
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("file"),
  DivisionController.updateDivision,
);

2. division.contorller.ts----------------
--> previous image delete and update image added-----------------------

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
   --> previous image delete and update image added-----------------------

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

## advernce update array[] data----------------------

1. tour.service.ts------------------------------------------
   --> multiple image add ---> multiple image deleted------Form Data---------

```js
//! update tour type service-------------------------------------------------------
const updateTour = async (id: string, payload: Partial<ITour>) => {
  const existingTour = await TourModel.findById(id);

  if (!existingTour) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Tour Type Not Found!");
  }

  //* duplicate tour type check---------------------
  const duplicateTour = await TourModel.findOne({
    title: payload.title as string,
    _id: { $ne: id },
  });

  if (duplicateTour) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "A Tour Type with this name already exists!",
    );
  }

  //! ### cloudinary-1 images update(basic)----------------------
  if (
    payload.images &&
    payload.images.length > 0 &&
    existingTour.images &&
    existingTour.images.length > 0
  ) {
    payload.images = [...payload.images, ...existingTour.images];
  }

  //! ### cloudinary-2 tour[array-data] advance images update--------------

  if (
    payload.deleteImages &&
    payload.deleteImages.length > 0 &&
    existingTour.images &&
    existingTour.images.length > 0
  ) {
    const restDBImages = existingTour.images.filter(
      (imageUrl) => !payload.deleteImages?.includes(imageUrl),
    );

    const updatedPayloadImages = (payload.images || [])
      .filter((imageUrl) => !payload.deleteImages?.includes(imageUrl))
      .filter((imageUrl) => !restDBImages.includes(imageUrl));

    payload.images = [...restDBImages, ...updatedPayloadImages];
  }

  const updatedTourData = await TourModel.findByIdAndUpdate(id, payload, {
    new: true,
  });

  //! ### cloudinary-3 tour[array-data] (advance) images update- deleteImageFromCloudinary-------------
  if (
    payload.deleteImages &&
    payload.deleteImages.length > 0 &&
    existingTour.images &&
    existingTour.images.length > 0
  ) {
    await Promise.all(
      payload.deleteImages.map((url) => deleteImageFromCloudinary(url)),
    );
  }

  return updatedTourData;
};
```
